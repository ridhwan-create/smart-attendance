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
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    // public function index(): Response
    // {
    //     $attendances = Attendance::with(['employee', 'company', 'location', 'workScheduleType'])->get();

    //     return Inertia::render('attendances/index', [
    //         'attendances' => $attendances,
    //     ]);
    // }
    public function index(Request $request): Response
    {
        $search = $request->input('search');
    
        $attendances = Attendance::with(['employee', 'company', 'location', 'workScheduleType'])
            ->when($search, fn ($query) =>
                $query->where(function ($q) use ($search) {
                    $q->whereHas('employee', fn ($q2) =>
                        $q2->where('name', 'like', "%{$search}%")
                           ->orWhere('ic_number', 'like', "%{$search}%")
                    )
                    ->orWhereHas('location', fn ($q2) =>
                        $q2->where('name', 'like', "%{$search}%")
                    )
                    ->orWhereHas('company', fn ($q2) =>
                    $q2->where('company_name', 'like', "%{$search}%")
                );
                })
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();
    
        return Inertia::render('attendances/index', [
            'attendances' => $attendances,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }    
    

    // public function create(): Response
    // {
    //     return Inertia::render('attendances/create', [
    //         'employees' => Employee::all(),
    //         'companies' => Company::all(),
    //         'locations' => Location::all(),
    //         'workScheduleTypes' => WorkScheduleType::all(),
    //     ]);
    // }

    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'employee_id' => 'required|exists:employees,id',
    //         'check_in_time' => 'required|date',
    //         'check_out_time' => 'nullable|date|after_or_equal:check_in_time',
    //         'location_id' => 'required|exists:locations,id',
    //         'notes' => 'nullable|string',
    //         'company_id' => 'required|exists:companies,id',
    //         'work_schedule_type_id' => 'required|exists:work_schedule_types,id',
    //     ]);

    //     Attendance::create([
    //         ...$validated,
    //         'created_by' => auth()->id(),
    //         'updated_by' => auth()->id(),
    //     ]);

    //     return redirect()->route('attendances.index')->with('success', 'Attendance created successfully.');
    // }
    public function create(): Response
    {
        $employee = Auth::user()->employee;

        // Get assigned location for the employee
        $assignedLocation = $employee->location;

        return Inertia::render('attendances/create', [
            'location' => $assignedLocation,
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
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'action' => 'required|in:check_in,check_out',
        ]);

        $employee = Auth::user()->employee;
        $location = $employee->location;

        $distance = $this->calculateDistance(
            $validated['latitude'],
            $validated['longitude'],
            $location->latitude,
            $location->longitude
        );

        if ($distance > $location->radius_meters) {
            return back()->withErrors(['location' => 'Anda berada di luar kawasan radius dibenarkan.']);
        }

        Attendance::create([
            'employee_id' => $employee->id,
            'location_id' => $location->id,
            'action' => $validated['action'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'timestamp' => now(),
        ]);

        return redirect()->back()->with('success', 'Kehadiran direkodkan.');
    }

    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $R = 6371000; // Radius of Earth in meters
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $R * $c;
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

// class AttendanceController extends Controller
// {
//     public function create()
//     {
//         $employee = Auth::user()->employee;

//         // Get assigned location for the employee
//         $assignedLocation = $employee->location;

//         return Inertia::render('attendance/create', [
//             'location' => $assignedLocation,
//         ]);
//     }

//     public function store(Request $request)
//     {
//         $validated = $request->validate([
//             'latitude' => 'required|numeric',
//             'longitude' => 'required|numeric',
//             'action' => 'required|in:check_in,check_out',
//         ]);

//         $employee = Auth::user()->employee;
//         $location = $employee->location;

//         $distance = $this->calculateDistance(
//             $validated['latitude'],
//             $validated['longitude'],
//             $location->latitude,
//             $location->longitude
//         );

//         if ($distance > $location->radius_meters) {
//             return back()->withErrors(['location' => 'Anda berada di luar kawasan radius dibenarkan.']);
//         }

//         Attendance::create([
//             'employee_id' => $employee->id,
//             'location_id' => $location->id,
//             'action' => $validated['action'],
//             'latitude' => $validated['latitude'],
//             'longitude' => $validated['longitude'],
//             'timestamp' => now(),
//         ]);

//         return redirect()->back()->with('success', 'Kehadiran direkodkan.');
//     }

//     private function calculateDistance($lat1, $lon1, $lat2, $lon2)
//     {
//         $R = 6371000; // Radius of Earth in meters
//         $dLat = deg2rad($lat2 - $lat1);
//         $dLon = deg2rad($lon2 - $lon1);
//         $a = sin($dLat / 2) * sin($dLat / 2) +
//              cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
//              sin($dLon / 2) * sin($dLon / 2);
//         $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
//         return $R * $c;
//     }
// }
