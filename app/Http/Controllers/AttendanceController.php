<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Company;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Location;
use App\Models\WorkScheduleType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(): Response
    {
        $attendances = Attendance::with(['employee', 'company', 'location', 'workScheduleType'])->get();

        return Inertia::render('attendances/index', [
            'attendances' => $attendances,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('attendances/create', [
            'employees' => Employee::all(),
            'companies' => Company::all(),
            'locations' => Location::all(),
            'workScheduleTypes' => WorkScheduleType::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'check_in_time' => 'required|date',
            'check_out_time' => 'nullable|date|after_or_equal:check_in_time',
            'location_id' => 'required|exists:locations,id',
            'notes' => 'nullable|string',
            'company_id' => 'required|exists:companies,id',
            'work_schedule_type_id' => 'required|exists:work_schedule_types,id',
        ]);

        Attendance::create([
            ...$validated,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('attendances.index')->with('success', 'Attendance created successfully.');
    }

    public function show(Attendance $attendance): Response
    {
        $attendance->load(['employee', 'company', 'location', 'workScheduleType']);

        return Inertia::render('attendances/show', [
            'attendance' => $attendance,
        ]);
    }

    public function edit(Attendance $attendance): Response
    {
        return Inertia::render('attendances/edit', [
            'attendance' => $attendance->load(['employee', 'company', 'location', 'workScheduleType']),
            'employees' => Employee::all(),
            'companies' => Company::all(),
            'locations' => Location::all(),
            'workScheduleTypes' => WorkScheduleType::all(),
        ]);
    }

    public function update(Request $request, Attendance $attendance)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'check_in_time' => 'required|date',
            'check_out_time' => 'nullable|date|after_or_equal:check_in_time',
            'location_id' => 'required|exists:locations,id',
            'notes' => 'nullable|string',
            'company_id' => 'required|exists:companies,id',
            'work_schedule_type_id' => 'required|exists:work_schedule_types,id',
        ]);

        $attendance->update([
            ...$validated,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('attendances.index')->with('success', 'Attendance updated successfully.');
    }

    public function destroy(Attendance $attendance)
    {
        $attendance->delete();

        return redirect()->route('attendances.index')->with('success', 'Attendance deleted successfully.');
    }

    public function register()
    {
        $locations = Location::all(['id', 'name', 'latitude', 'longitude', 'radius']);
        return Inertia::render('attendances/register', [
            'locations' => $locations,
        ]);
    }

}
