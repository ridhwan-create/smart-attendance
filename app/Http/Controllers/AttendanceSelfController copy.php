<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceSelfController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $employee = $user->employee;

        $userLocation = $employee?->location;

        return Inertia::render('attendances/self', [
            'userLocation' => $userLocation,
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

        // Validate location radius
        if ($request->distance > $location->radius_meters) {
            return back()->withErrors(['location' => 'You are outside the allowed radius.']);
        }

        // Cari rekod kehadiran hari ini
        $todayAttendance = Attendance::whereDate('created_at', now()->toDateString())
            ->where('employee_id', $employee->id)
            ->first();

        if ($request->type === 'check_in') {
            if ($todayAttendance && $todayAttendance->check_in_time) {
                return back()->withErrors(['type' => 'You have already checked in today.']);
            }

            if (!$todayAttendance) {
                $todayAttendance = new Attendance();
                $todayAttendance->employee_id = $employee->id;
                $todayAttendance->ic_number = $employee->ic_number;
                $todayAttendance->name = $employee->name;
                $todayAttendance->location_id = $location->id;
                $todayAttendance->company_id = $employee->company_id ?? auth()->user()->company_id ?? null;
                $todayAttendance->work_schedule_type_id = $employee->work_schedule_type_id ?? null;
                $todayAttendance->created_by = auth()->id();
            }            

            $todayAttendance->check_in_time = now();
        }

        if ($request->type === 'check_out') {
            if (!$todayAttendance || $todayAttendance->check_out_time) {
                return back()->withErrors(['type' => 'You have already checked out or haven\'t checked in yet.']);
            }

            $todayAttendance->check_out_time = now();
        }

        $todayAttendance->check_in_time = Carbon::now();
        $todayAttendance->latitude = $request->latitude;
        $todayAttendance->longitude = $request->longitude;
        $todayAttendance->updated_by = auth()->id();
        $todayAttendance->save();
        

        return redirect()->back()->with('success', ucfirst($request->type) . ' successfully recorded.');
    }
}
