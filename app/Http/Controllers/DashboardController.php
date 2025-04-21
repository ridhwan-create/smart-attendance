<?php

namespace App\Http\Controllers;

use App\Models\{Employee, Attendance, Location};
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $companyId = Auth::user()->company_id;

        $totalEmployees = Employee::where('company_id', $companyId)->count();
        $presentToday = Attendance::whereDate('created_at', now())
            ->where('company_id', $companyId)
            ->whereNotNull('check_in_time')
            ->count();
        $activeLocations = Location::where('company_id', $companyId)
            ->whereNull('deleted_at')
            ->count();
        $lateArrivals = Attendance::whereDate('created_at', now())
            ->where('company_id', $companyId)
            ->where('is_late', true)
            ->count();
        $earlyDepartures = Attendance::whereDate('created_at', now())
            ->where('company_id', $companyId)
            ->where('is_early_leave', true)
            ->count();

        $weeklyStats = Attendance::select(
                DB::raw("DATE_FORMAT(created_at, '%a') as day"),
                DB::raw('COUNT(*) as total'),
                DB::raw('SUM(CASE WHEN check_in_time IS NOT NULL THEN 1 ELSE 0 END) as present')
            )
            ->where('company_id', $companyId)
            ->whereBetween('created_at', [now()->subDays(6)->startOfDay(), now()->endOfDay()])
            ->groupBy('day')
            ->orderByRaw("FIELD(day, 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')")
            ->get()
            ->map(function ($row) {
                return [
                    'name' => $row->day,
                    'attendance' => round(($row->present / $row->total) * 100, 1),
                ];
            });

        return Inertia::render('dashboard', [
            'summary' => [
                'totalEmployees' => $totalEmployees,
                'presentToday' => $presentToday,
                'activeLocations' => $activeLocations,
                'lateArrivals' => $lateArrivals,
                'earlyDepartures' => $earlyDepartures,
            ],
            'attendanceData' => $weeklyStats,
        ]);
    }
}
