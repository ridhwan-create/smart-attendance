<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Location;
use App\Models\Company;
use App\Models\Department;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AttendanceExport;
use Barryvdh\DomPDF\Facade\Pdf;

class AttendanceReportController extends Controller
{
    // public function index(Request $request)
    // {
    //     $search = $request->input('search');
    //     $perPage = $request->input('per_page', 30);
    
    //     $query = Attendance::query()
    //         ->with(['employee.company', 'location'])
    //         ->when($request->start_date, fn($q) => 
    //             $q->whereDate('date_of_month', '>=', $request->start_date))
    //         ->when($request->end_date, fn($q) => 
    //             $q->whereDate('date_of_month', '<=', $request->end_date))
    //         ->when($request->company_id, fn($q) => 
    //             $q->whereHas('employee', fn($q) => 
    //                 $q->where('company_id', $request->company_id)))
    //         ->when($search, fn($q) => 
    //             $q->where(function ($q) use ($search) {
    //                 $q->whereHas('employee', fn($q) => 
    //                     $q->where('name', 'like', "%{$search}%")
    //                       ->orWhere('ic_number', 'like', "%{$search}%"))
    //                   ->orWhereHas('location', fn($q) => 
    //                     $q->where('name', 'like', "%{$search}%"));
    //             }))
    //         ->orderBy('date_of_month', 'asc');
    
    //     $attendances = $query->paginate($perPage)->withQueryString();
    
    //     return Inertia::render('attendances/report', [
    //         'filters' => $request->only(['start_date', 'end_date', 'company_id', 'per_page', 'search']),
    //         'attendances' => $attendances,
    //         'companies' => Company::select('id', 'company_name')->get(),
    //     ]);
    // }

    public function index(Request $request)
{
    $request->validate([
        'search' => [
            'nullable',
            'string',
            function ($attribute, $value, $fail) use ($request) {
                $query = Attendance::query()
                    ->with(['employee.company', 'location'])
                    ->when($request->start_date, fn($q) => 
                        $q->whereDate('date_of_month', '>=', $request->start_date))
                    ->when($request->end_date, fn($q) => 
                        $q->whereDate('date_of_month', '<=', $request->end_date))
                    ->when($request->company_id, fn($q) => 
                        $q->whereHas('employee', fn($q) => 
                            $q->where('company_id', $request->company_id)))
                    ->when($value, fn($q) => 
                        $q->where(function ($q) use ($value) {
                            $q->whereHas('employee', fn($q) => 
                                $q->where('name', 'like', "%{$value}%")
                                  ->orWhere('ic_number', 'like', "%{$value}%"))
                              ->orWhereHas('location', fn($q) => 
                                $q->where('name', 'like', "%{$value}%"));
                        }));

                $attendances = $query->take(1)->get();

                if ($value && $attendances->isEmpty()) {
                    $fail('Tiada rekod ditemui untuk carian yang dimasukkan.');
                }
            }
        ],
        // Anda bisa menambahkan validasi untuk parameter lain di sini
        'start_date' => 'nullable|date',
        'end_date' => 'nullable|date|after_or_equal:start_date',
        'company_id' => 'nullable|exists:companies,id',
        'per_page' => 'nullable|integer|min:1|max:100'
    ]);

    $search = $request->input('search');
    $perPage = $request->input('per_page', 30);
    
    $query = Attendance::query()
        ->with(['employee.company', 'location'])
        ->when($request->start_date, fn($q) => 
            $q->whereDate('date_of_month', '>=', $request->start_date))
        ->when($request->end_date, fn($q) => 
            $q->whereDate('date_of_month', '<=', $request->end_date))
        ->when($request->company_id, fn($q) => 
            $q->whereHas('employee', fn($q) => 
                $q->where('company_id', $request->company_id)))
        ->when($search, fn($q) => 
            $q->where(function ($q) use ($search) {
                $q->whereHas('employee', fn($q) => 
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('ic_number', 'like', "%{$search}%"))
                  ->orWhereHas('location', fn($q) => 
                    $q->where('name', 'like', "%{$search}%"));
            }))
        ->orderBy('date_of_month', 'asc');
    
    $attendances = $query->paginate($perPage)->withQueryString();
    
    return Inertia::render('attendances/report', [
        'filters' => $request->only(['start_date', 'end_date', 'company_id', 'per_page', 'search']),
        'attendances' => $attendances,
        'companies' => Company::select('id', 'company_name')->get(),
    ]);
}

    protected function calculateAttendancePercentage($employee, $start, $end)
    {
        if (!$employee) return 0;

        $totalDays = \Carbon\Carbon::parse($start)->diffInWeekdays(\Carbon\Carbon::parse($end)) + 1;
        $attendedDays = Attendance::where('employee_id', $employee->id)
            ->whereBetween('check_in_time', [$start, $end])
            ->distinct('check_in_time')
            ->count();

        return $totalDays > 0 ? round(($attendedDays / $totalDays) * 100, 2) : 0;
    }

    // public function export(Request $request)
    // {
    //     $request->validate([
    //         'search' => 'required|string'
    //     ], [
    //         'search.required' => 'Please enter the name or IC number before exporting.'
    //     ]);
        
    //     $query = Attendance::query()
    //         ->with(['employee', 'location'])
    //         ->when($request->start_date, fn($q) =>
    //             $q->whereDate('date_of_month', '>=', $request->start_date))
    //         ->when($request->end_date, fn($q) =>
    //             $q->whereDate('date_of_month', '<=', $request->end_date))
    //         ->when($request->location_id, fn($q) =>
    //             $q->where('location_id', $request->location_id))
    //         ->when($request->company_id, fn($q) =>
    //             $q->whereHas('employee', fn($q) =>
    //                 $q->where('company_id', $request->company_id)))
    //         ->when($request->department_id, fn($q) =>
    //             $q->whereHas('employee', fn($q) =>
    //                 $q->where('department_id', $request->department_id)))
    //         ->when($request->search, fn($q) =>
    //             $q->whereHas('employee', fn($subQ) =>
    //                 $subQ->where('name', 'like', "%{$request->search}%")
    //                     ->orWhere('ic_number', 'like', "%{$request->search}%")))
    //         ->orderBy('date_of_month'); // Diubah dari orderByDesc ke orderBy untuk susunan menaik
    
    //     $attendances = $query->get();
    
    //     $employee = $attendances->first()?->employee;
    //     $company = $employee?->company;
    //     $department = $employee?->department;
    //     $location = $attendances->first()?->location;
    //     $month = $request->start_date ?? now();
    //     $attendancePercentage = $this->calculateAttendancePercentage($employee, $request->start_date, $request->end_date);
    
    //     if ($request->format === 'pdf') {
    //         $pdf = Pdf::loadView('exports.attendance-pdf', compact(
    //             'attendances',
    //             'employee',
    //             'company',
    //             'department',
    //             'location',
    //             'month',
    //             'attendancePercentage'
    //         ))->setPaper('a4', 'landscape');
    
    //         return $pdf->download('attendance_report.pdf');
    //     }
    
    //     return Excel::download(new AttendanceExport($attendances), 'attendance_report.xlsx');
    // }

    public function export(Request $request)
    {
        $request->validate([
            'search' => [
                'required',
                'string',
                function ($attribute, $value, $fail) use ($request) {
                    $query = Attendance::query()
                        ->with(['employee', 'location'])
                        ->when($request->start_date, fn($q) =>
                            $q->whereDate('date_of_month', '>=', $request->start_date))
                        ->when($request->end_date, fn($q) =>
                            $q->whereDate('date_of_month', '<=', $request->end_date))
                        ->when($request->location_id, fn($q) =>
                            $q->where('location_id', $request->location_id))
                        ->when($request->company_id, fn($q) =>
                            $q->whereHas('employee', fn($q) =>
                                $q->where('company_id', $request->company_id)))
                        ->when($request->department_id, fn($q) =>
                            $q->whereHas('employee', fn($q) =>
                                $q->where('department_id', $request->department_id)))
                        ->when($request->search, fn($q) =>
                            $q->whereHas('employee', fn($subQ) =>
                                $subQ->where('name', 'like', "%{$value}%")
                                    ->orWhere('ic_number', 'like', "%{$value}%")));
    
                    $attendances = $query->get();
    
                    if ($attendances->isEmpty()) {
                        $fail('No records found for the specified name or IC number.');
                        return;
                    }
    
                    $employee = $attendances->first()->employee;
                    
                    if (!$employee) {
                        $fail('Employee not found for the specified records.');
                    }
                }
            ]
        ], [
            'search.required' => 'Please enter the name or IC number before exporting.'
        ]);
        
        // Lanjutan kode eksport seperti semula
        $query = Attendance::query()
            ->with(['employee', 'location'])
            ->when($request->start_date, fn($q) =>
                $q->whereDate('date_of_month', '>=', $request->start_date))
            ->when($request->end_date, fn($q) =>
                $q->whereDate('date_of_month', '<=', $request->end_date))
            ->when($request->location_id, fn($q) =>
                $q->where('location_id', $request->location_id))
            ->when($request->company_id, fn($q) =>
                $q->whereHas('employee', fn($q) =>
                    $q->where('company_id', $request->company_id)))
            ->when($request->department_id, fn($q) =>
                $q->whereHas('employee', fn($q) =>
                    $q->where('department_id', $request->department_id)))
            ->when($request->search, fn($q) =>
                $q->whereHas('employee', fn($subQ) =>
                    $subQ->where('name', 'like', "%{$request->search}%")
                        ->orWhere('ic_number', 'like', "%{$request->search}%")))
            ->orderBy('date_of_month');
    
        $attendances = $query->get();
        
        $employee = $attendances->first()->employee;
        $company = $employee->company;
        $department = $employee->department;
        $location = $attendances->first()->location;
        $month = $request->start_date ?? now();
        $attendancePercentage = $this->calculateAttendancePercentage($employee, $request->start_date, $request->end_date);
    
        if ($request->format === 'pdf') {
            $pdf = Pdf::loadView('exports.attendance-pdf', compact(
                'attendances',
                'employee',
                'company',
                'department',
                'location',
                'month',
                'attendancePercentage'
            ))->setPaper('a4', 'landscape');
    
            return $pdf->download('attendance_report.pdf');
        }
    
        return Excel::download(new AttendanceExport($attendances), 'attendance_report.xlsx');
    }
    
}
