<?php

namespace App\Http\Controllers;

use App\Models\{Location, Attendance, WorkingHour, WorkScheduleType, HRMSAttendance};
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class AttendanceSelfController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $employee = $user->employee;
        $userLocation = $employee?->location;

        // Get today's attendance record
        $today = now()->toDateString();
        $todayAttendance = Attendance::where('employee_id', $employee->id)
            ->where('date_of_month', $today)
            ->first();

        return Inertia::render('attendances/self', [
            'userLocation' => $userLocation ? [
                'id' => $userLocation->id,
                'name' => $userLocation->name,
                'radius_meters' => $userLocation->radius_meters,
                'latitude' => $userLocation->latitude,
                'longitude' => $userLocation->longitude,
            ] : null,
            'attendanceStatus' => [
                'hasCheckedIn' => $todayAttendance ? !is_null($todayAttendance->check_in_time) : false,
                'hasCheckedOut' => $todayAttendance ? !is_null($todayAttendance->check_out_time) : false,
                'checkInTime' => $todayAttendance ? $todayAttendance->check_in_time : null,
                'checkOutTime' => $todayAttendance ? $todayAttendance->check_out_time : null,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:check_in,check_out',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'distance' => 'required|numeric',
        ]);

        $user = Auth::user();
        $employee = $user->employee;

        if (!$employee) {
            return back()->withErrors(['employee' => 'Employee record not found.']);
        }

        $location = $employee->location;

        if (!$location) {
            return back()->withErrors(['location' => 'Location not set for employee.']);
        }

        if ($request->distance > $location->radius_meters) {
            return back()->withErrors(['location' => 'You are outside the allowed radius.']);
        }

        $now = now();
        $today = $now->toDateString();
        $day_of_week = $now->format('l');

        $workingHour = WorkingHour::where('location_id', $location->id)
            ->where('day_of_week', $day_of_week)
            ->first();

        if (!$workingHour) {
            return back()->withErrors(['working_hour' => 'No working hour set for today.']);
        }

        try {
            $startTime = Carbon::parse($workingHour->start_time);
            $endTime = Carbon::parse($workingHour->end_time);
        } catch (\Exception $e) {
            return back()->withErrors(['working_hour' => 'Invalid working hour format.']);
        }

        $todayAttendance = Attendance::firstOrNew(
            [
                'employee_id' => $employee->id,
                'date_of_month' => $today,
            ],
            [
                'ic_number' => $employee->ic_number,
                'name' => $employee->name,
                'company_id' => $employee->company_id ?? auth()->user()->company_id ?? null,
                'created_by' => auth()->id(),
            ]
        );

        $todayAttendance->fill([
            'location_id' => $location->id,
            'work_schedule_type_id' => $location->work_schedule_type_id,
        ]);

        $isFlexible = $location->work_schedule_type?->type === 'Flexibel';
        $flexStart = Carbon::createFromTime(7, 30);
        $flexEnd = Carbon::createFromTime(9, 0);

        if ($request->type === 'check_in') {
            if ($todayAttendance->check_in_time) {
                return back()->withErrors(['type' => 'You have already checked in today.']);
            }

            $validCheckIn = $isFlexible
                ? $now->between($flexStart, $endTime)
                : $now->between($startTime->copy()->subMinutes(60), $endTime);

            if (!$validCheckIn) {
                return back()->withErrors(['check_in_time' => 'Check-in time is outside allowed working hours.']);
            }

            $todayAttendance->check_in_time = $now;
            if (Carbon::parse($todayAttendance->date_of_month)->isSameDay($today)) {
                $todayAttendance->status = 'present';
            }

            if ($isFlexible && $now->gt($flexEnd)) {
                $todayAttendance->is_late = true;
                $todayAttendance->late_duration = $now->diff($flexEnd)->format('%H:%I:%S');
            } elseif (!$isFlexible && $now->gt($startTime)) {
                $todayAttendance->is_late = true;
                $todayAttendance->late_duration = $now->diff($startTime)->format('%H:%I:%S');
            } else {
                $todayAttendance->is_late = false;
                $todayAttendance->late_duration = null;
            }
        }

        if ($request->type === 'check_out') {
            if (!$todayAttendance->check_in_time) {
                return back()->withErrors(['type' => 'You need to check in first before checking out.']);
            }

            if ($now->lt($startTime) || $now->gt($endTime->copy()->addHours(2))) {
                return back()->withErrors(['check_out_time' => 'Check-out time is outside allowed working hours.']);
            }

            $previousCheckOut = $todayAttendance->check_out_time;
            $todayAttendance->check_out_time = $now;

            if ($now->lt($endTime)) {
                $todayAttendance->is_early_leave = true;
                $todayAttendance->early_leave_duration = $endTime->diff($now)->format('%H:%I:%S');
            } else {
                $todayAttendance->is_early_leave = false;
                $todayAttendance->early_leave_duration = null;
            }

            if ($previousCheckOut) {
                Log::info("Employee multiple check-out", [
                    'employee_id' => $employee->id,
                    'date' => $today,
                    'previous_check_out' => $previousCheckOut,
                    'new_check_out' => $now,
                ]);
            }
        }

        $todayAttendance->latitude = $request->latitude;
        $todayAttendance->longitude = $request->longitude;
        $todayAttendance->updated_by = auth()->id();

        try {
            $todayAttendance->save();

            try {
                HRMSAttendance::updateOrCreate(
                    [
                        'no_pekerja' => $employee->employee_number,
                        'date' => $today,
                    ],
                    [
                        'day' => $now->format('l'),
                        'time_in' => $todayAttendance->check_in_time,
                        'time_out' => $todayAttendance->check_out_time,
                        'id_bahagian' => $employee->department_id,
                        'terminalDeviceId' => '100',
                    ]
                );

                Log::info("HRMS Attendance synced successfully", [
                    'employee' => $employee->employee_number,
                    'date' => $today,
                ]);
            } catch (\Exception $e) {
                Log::error("HRMS Attendance Sync Failed", [
                    'error' => $e->getMessage(),
                    'employee_id' => $employee->id,
                    'date' => $today,
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        } catch (\Exception $e) {
            return back()->withErrors(['database' => 'Failed to save attendance record.']);
        }

        return redirect()->back()->with('success', ucfirst($request->type) . ' successfully recorded.');
    }
}
