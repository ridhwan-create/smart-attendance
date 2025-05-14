<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

// class AttendanceSummaryController extends Controller
// {
//     public function __invoke()
//     {
//         $total = Attendance::count();
//         $totalLate = Attendance::where('is_late', true)->count();
//         $totalEarlyLeave = Attendance::where('is_early_leave', true)->count();

//         return Inertia::render('AttendanceSummary', [
//             'summary' => [
//                 'total' => $total,
//                 'late' => $totalLate,
//                 'early_leave' => $totalEarlyLeave,
//                 'late_percentage' => $total > 0 ? round($totalLate / $total * 100, 1) : 0,
//                 'early_leave_percentage' => $total > 0 ? round($totalEarlyLeave / $total * 100, 1) : 0,
//             ],
//         ]);
//     }
// }

use App\Models\Company;
use App\Models\Location;
use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __invoke()
    {
        // $total = Attendance::count();
        // $totalLate = Attendance::where('is_late', true)->count();
        // $totalEarlyLeave = Attendance::where('is_early_leave', true)->count();
        $today = Carbon::today();

        $total = Attendance::whereDate('check_in_time', $today)->count();
        $totalLate = Attendance::where('is_late', true)->whereDate('check_in_time', $today)->count();
        $totalEarlyLeave = Attendance::where('is_early_leave', true)->whereDate('check_in_time', $today)->count();


        $totalCompanies = Company::count();
        $totalLocations = Location::count();
        $totalEmployees = Employee::count();

        $locationsByCompany = Company::withCount('locations')
            ->get()
            ->map(fn($company) => [
                'name' => $company->company_name,
                'location_count' => $company->locations_count,
            ]);

        // $locationsByCompany = Company::withCount(['locations', 'employees', 'attendances'])
        //     ->get()
        //     ->map(fn ($company) => [
        //         'name' => $company->company_name,
        //         'location_count' => $company->locations_count,
        //         'employee_count' => $company->employees_count,
        //         'attendance_count' => $company->attendances_count,
        //     ]);
        $today = Carbon::today();

        $locationsByCompany = Company::withCount([
            'locations',
            'employees',
            'attendances' => function ($query) use ($today) {
                $query->whereDate('check_in_time', $today);
            },
            'attendances as late_count' => function ($query) use ($today) {
                $query->where('is_late', true)->whereDate('check_in_time', $today);
            },
            'attendances as early_leave_count' => function ($query) use ($today) {
                $query->where('is_early_leave', true)->whereDate('check_in_time', $today);
            },
            'attendances as today_attendance_count' => function ($query) use ($today) {
                $query->whereDate('check_in_time', $today);
            },
        ])
            ->get()
            ->map(fn($company) => [
                'name' => $company->company_name,
                'location_count' => $company->locations_count,
                'employee_count' => $company->employees_count,
                // 'attendance_count' => $company->attendances_count, // already filtered to today
                'today_attendance_count' => $company->today_attendance_count,
                'late' => $company->late_count,
                'early_leave' => $company->early_leave_count,
                'late_percentage' => $company->today_attendance_count > 0
                    ? round($company->late_count / $company->today_attendance_count * 100, 1)
                    : 0,
                'early_leave_percentage' => $company->attendances_count > 0
                    ? round($company->early_leave_count / $company->attendances_count * 100, 1)
                    : 0,
                'present_percentage' => $company->employees_count > 0
                    ? round($company->today_attendance_count / $company->employees_count * 100, 1)
                    : 0,
                'absent_count' => max($company->employees_count - $company->today_attendance_count, 0),
                'absent_percentage' => $company->employees_count > 0
                    ? round(($company->employees_count - $company->today_attendance_count) / $company->employees_count * 100, 1)
                    : 0,
            ]);



        $companies = Company::all();

        $lateEarlyByCompany = $companies->map(function ($company) {
            $attendances = Attendance::where('company_id', $company->id)->get();
            $total = $attendances->count();
            $late = $attendances->where('is_late', true)->count();
            $earlyLeave = $attendances->where('is_early_leave', true)->count();

            return [
                'company' => $company->company_name,
                'total_attendances' => $total,
                'late' => $late,
                'early_leave' => $earlyLeave,
                'late_percentage' => $total > 0 ? round($late / $total * 100, 1) : 0,
                'early_leave_percentage' => $total > 0 ? round($earlyLeave / $total * 100, 1) : 0,
            ];
        });


        // return Inertia::render('AttendanceSummary', [
        //     'summary' => [
        //         'total' => $total,
        //         'late' => $totalLate,
        //         'early_leave' => $totalEarlyLeave,
        //         'late_percentage' => $total > 0 ? round($totalLate / $total * 100, 1) : 0,
        //         'early_leave_percentage' => $total > 0 ? round($totalEarlyLeave / $total * 100, 1) : 0,
        //         'total_companies' => $totalCompanies,
        //         'total_locations' => $totalLocations,
        //         'locations_by_company' => $locationsByCompany,
        //     ],
        // ]);
        return Inertia::render('dashboard', [
            'summary' => [
                'total' => $total,
                'late' => $totalLate,
                'early_leave' => $totalEarlyLeave,
                'late_percentage' => $total > 0 ? round($totalLate / $total * 100, 1) : 0,
                'early_leave_percentage' => $total > 0 ? round($totalEarlyLeave / $total * 100, 1) : 0,
                'total_companies' => $totalCompanies,
                'total_locations' => $totalLocations,
                'total_employees' => $totalEmployees,
                'locations_by_company' => $locationsByCompany,
                'late_early_by_company' => $lateEarlyByCompany,
            ],
        ]);
    }

    // public function employeeDashboard()
    // {
    //     $user = Auth::user();

    //     // Pastikan eager loading untuk elak N+1 query
    //     $employee = $user->employee()->with('location')->first();


    //     $today = Carbon::today();
    //     $attendance = Attendance::where('employee_id', optional($employee)->id)
    //         ->whereDate('check_in_time', $today)
    //         ->first();

    //     return Inertia::render('EmployeeDashboard', [
    //         'employee' => [
    //             'name' => $user->name,
    //             'ic_number' => optional($employee)->ic_number ?? '-',
    //             'location' => optional(optional($employee)->location)->name ?? '-',
    //         ],
    //         'attendance' => [
    //             'status' => $attendance ? 'Present' : 'Absent',
    //             'check_in_time' => $attendance && $attendance->check_in_time ? \Carbon\Carbon::parse($attendance->check_in_time)->format('H:i'): '-',
    //             'check_out_time' => optional($attendance)->check_out_time  ? \Carbon\Carbon::parse($attendance->check_out_time)->format('H:i'): '-',
    //             'is_late' => $attendance->is_late ,
    //             'late_duration' => $attendance->late_duration ,
    //             'is_early_leave' => $attendance->is_early_leave ,
    //             'early_leave_duration' => $attendance->early_leave_duration ,
    //         ],
    //     ]);
    // }

    public function employeeDashboard()
    {
        $user = Auth::user();
        $today = Carbon::today();

        // Load employee with location and company
        $employee = $user->employee()->with(['location', 'company'])->first();

        // Dapatkan rekod kehadiran untuk hari ini
        $attendance = null;
        if ($employee) {
            $attendance = Attendance::where('employee_id', $employee->id)
                ->whereDate('check_in_time', $today)
                ->first();
        }

        return Inertia::render('EmployeeDashboard', [
            'employee' => [
                'name' => $user->name,
                'ic_number' => $employee->ic_number ?? '-',
                'location' => $employee->location->name ?? '-',
                'company' => $employee->company->company_name ?? '-',
            ],
            'attendance' => [
                'status' => $attendance ? 'Present' : 'Absent',
                'check_in_time' => $attendance && $attendance->check_in_time
                    ? Carbon::parse($attendance->check_in_time)->format('H:i') : '-',
                'check_out_time' => $attendance && $attendance->check_out_time
                    ? Carbon::parse($attendance->check_out_time)->format('H:i') : '-',
                'is_late' => $attendance->is_late ?? false,
                'late_duration' => $attendance->late_duration ?? 0,
                'is_early_leave' => $attendance->is_early_leave ?? false,
                'early_leave_duration' => $attendance->early_leave_duration ?? 0,
            ],
        ]);
    }

    public function managerDashboard()
    {
        $user = Auth::user();
        $today = Carbon::today();

        // Get the manager's company
        $employee = $user->employee()->with('company')->first();
        $company = $employee->company;

        // Get company statistics
        $companyStats = [
            'name' => $company->company_name,
            'location_count' => $company->locations()->count(),
            'employee_count' => $company->employees()->count(),
            'today_attendance_count' => $company->attendances()->whereDate('check_in_time', $today)->count(),
            'late' => $company->attendances()->where('is_late', true)->whereDate('check_in_time', $today)->count(),
            'early_leave' => $company->attendances()->where('is_early_leave', true)->whereDate('check_in_time', $today)->count(),
            'absent_count' => max($company->employees()->count() - $company->attendances()->whereDate('check_in_time', $today)->count(), 0),
        ];

        // Calculate percentages
        $companyStats['present_percentage'] = $companyStats['employee_count'] > 0
            ? round($companyStats['today_attendance_count'] / $companyStats['employee_count'] * 100, 1)
            : 0;
        $companyStats['absent_percentage'] = $companyStats['employee_count'] > 0
            ? round($companyStats['absent_count'] / $companyStats['employee_count'] * 100, 1)
            : 0;
        $companyStats['late_percentage'] = $companyStats['today_attendance_count'] > 0
            ? round($companyStats['late'] / $companyStats['today_attendance_count'] * 100, 1)
            : 0;
        $companyStats['early_leave_percentage'] = $companyStats['today_attendance_count'] > 0
            ? round($companyStats['early_leave'] / $companyStats['today_attendance_count'] * 100, 1)
            : 0;

        // Get historical stats
        $totalAttendances = $company->attendances()->count();
        $totalLate = $company->attendances()->where('is_late', true)->count();
        $totalEarlyLeave = $company->attendances()->where('is_early_leave', true)->count();

        return Inertia::render('ManagerDashboard', [
            'summary' => [
                'company' => $companyStats,
                'stats' => [
                    'total_attendances' => $totalAttendances,
                    'late' => $totalLate,
                    'early_leave' => $totalEarlyLeave,
                    'late_percentage' => $totalAttendances > 0 ? round($totalLate / $totalAttendances * 100, 1) : 0,
                    'early_leave_percentage' => $totalAttendances > 0 ? round($totalEarlyLeave / $totalAttendances * 100, 1) : 0,
                ],
            ],
        ]);
    }
}
