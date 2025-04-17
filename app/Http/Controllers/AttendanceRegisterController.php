<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Location;
use App\Models\Attendance;

class AttendanceRegisterController extends Controller
{
    public function mapCheck()
    {
        $locations = \App\Models\Location::select('id', 'name', 'latitude', 'longitude', 'radius_meters')->get();

        return view('attendances-registration.map-check', compact('locations'));
    }

    /**
     * Papar borang daftar kehadiran (untuk user).
     */
    public function register()
    {
        $locations = Location::all();

        return view('attendances-registration.register', compact('locations'));
    }

    /**
     * Proses daftar masuk atau daftar keluar.
     */
    public function record(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'location_id' => 'required|exists:locations,id',
            'action' => 'required|in:check_in,check_out',
        ]);

        $user = $request->user();

        $attendance = new Attendance();
        $attendance->user_id = $user->id;
        $attendance->location_id = $request->location_id;
        $attendance->latitude = $request->latitude;
        $attendance->longitude = $request->longitude;
        $attendance->action = $request->action;
        $attendance->recorded_at = now();
        $attendance->save();

        return redirect()->back()->with('success', 'Kehadiran berjaya direkod.');
    }
}
