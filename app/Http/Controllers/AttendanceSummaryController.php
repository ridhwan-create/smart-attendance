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

class AttendanceSummaryController extends Controller
{
    public function __invoke()
    {
        $total = Attendance::count();
        $totalLate = Attendance::where('is_late', true)->count();
        $totalEarlyLeave = Attendance::where('is_early_leave', true)->count();

        $totalCompanies = Company::count();
        $totalLocations = Location::count();
        $totalEmployees = Employee::count();

        $locationsByCompany = Company::withCount('locations')
            ->get()
            ->map(fn ($company) => [
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
        $locationsByCompany = Company::withCount([
            'locations',
            'employees',
            'attendances',
            'attendances as late_count' => function ($query) {
                $query->where('is_late', true);
            },
            'attendances as early_leave_count' => function ($query) {
                $query->where('is_early_leave', true);
            },
            'attendances as today_attendance_count' => function ($query) {
                $query->whereDate('check_in_time', Carbon::today());
            },
        ])
        ->get()
        ->map(fn ($company) => [
            'name' => $company->company_name,
            'location_count' => $company->locations_count,
            'employee_count' => $company->employees_count,
            'attendance_count' => $company->attendances_count,
            'today_attendance_count' => $company->today_attendance_count,
            'late' => $company->late_count,
            'early_leave' => $company->early_leave_count,
            'late_percentage' => $company->attendances_count > 0
                ? round($company->late_count / $company->attendances_count * 100, 1)
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
        return Inertia::render('AttendanceSummary', [
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
}
