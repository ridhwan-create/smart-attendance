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

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view attendances')->only(['index', 'show']);
        $this->middleware('permission:create attendances')->only(['create', 'store']);
        $this->middleware('permission:edit attendances')->only(['edit', 'update']);
        $this->middleware('permission:delete attendances')->only(['destroy']);
    }

    // Fungsi ini dipanggil oleh scheduler pada 1hb setiap bulan
    // public function generateMonthlyAttendance()
    // {
    //     $today = Carbon::now();
    //     $firstDayOfMonth = $today->copy()->startOfMonth();
    //     $lastDayOfMonth = $today->copy()->endOfMonth();

    //     $employees = Employee::all();

    //     DB::beginTransaction();

    //     try {
    //         foreach ($employees as $employee) {
    //             // Loop setiap hari dalam bulan
    //             for ($date = $firstDayOfMonth->copy(); $date->lte($lastDayOfMonth); $date->addDay()) {
    //                 Attendance::firstOrCreate([
    //                     'employee_id' => $employee->id,
    //                     'company_id' => $employee->company_id,
    //                     'work_schedule_type_id' => $employee->work_schedule_type_id ?? null,
    //                     'name' => $employee->name,
    //                     'ic_number' => $employee->ic_number,
    //                     'notes' => null,
    //                     'status' => 'absent', // Default absent
    //                     'check_in_time' => null,
    //                     'check_out_time' => null,
    //                     'location_id' => null,
    //                     'latitude' => null,
    //                     'longitude' => null,
    //                     'created_by' => Auth::id() ?? 1, // fallback admin ID
    //                     'updated_by' => Auth::id() ?? 1,
    //                     'created_at' => $date,
    //                     'updated_at' => $date,
    //                 ]);
    //             }
    //         }

    //         DB::commit();
    //         return response()->json(['message' => 'Monthly attendances generated successfully.']);
    //     } catch (\Exception $e) {
    //         DB::rollBack();
    //         return response()->json(['message' => 'Failed to generate attendances.', 'error' => $e->getMessage()], 500);
    //     }
    // }
    public function generateMonthlyAttendance()
    {
        $today = Carbon::now();
        $firstDayOfMonth = $today->copy()->startOfMonth();
        $lastDayOfMonth = $today->copy()->endOfMonth();

        $month = $today->format('Y-m'); // Format sebagai '2025-04'

        $employees = Employee::all();

        DB::beginTransaction();

        try {
            // foreach ($employees as $employee) {
            //     // Semak jika rekod sudah wujud untuk bulan ini bagi pekerja
            //     $attendanceExists = Attendance::where('employee_id', $employee->id)
            //         ->whereBetween('date_of_month', [$firstDayOfMonth, $lastDayOfMonth])
            //         ->exists();

            //     if ($attendanceExists) {
            //         // Jika rekod sudah wujud, langkau pekerja ini
            //         continue;
            //     }

            //     for ($date = $firstDayOfMonth->copy(); $date->lte($lastDayOfMonth); $date->addDay()) {
            //         Attendance::create([
            //             'employee_id' => $employee->id,
            //             'company_id' => $employee->company_id,
            //             'work_schedule_type_id' => $employee->work_schedule_type_id ?? null,
            //             'name' => $employee->name,
            //             'ic_number' => $employee->ic_number,
            //             'notes' => null,
            //             'status' => 'absent',
            //             'date_of_month' => $date->toDateString(),
            //             'check_in_time' => null,
            //             'check_out_time' => null,
            //             'location_id' => null,
            //             'latitude' => null,
            //             'longitude' => null,
            //             'created_by' => 1,
            //             'updated_by' => 1,
            //             'created_at' => $date,
            //             'updated_at' => $date,
            //         ]);
            //     }
            // }
            foreach ($employees as $employee) {
                // Ambil semua rekod kehadiran sedia ada untuk bulan ini
                $existingDates = Attendance::where('employee_id', $employee->id)
                    ->whereBetween('date_of_month', [$firstDayOfMonth, $lastDayOfMonth])
                    ->pluck('date_of_month')
                    ->map(fn($d) => Carbon::parse($d)->toDateString())
                    ->toArray();

                for ($date = $firstDayOfMonth->copy(); $date->lte($lastDayOfMonth); $date->addDay()) {
                    if (in_array($date->toDateString(), $existingDates)) {
                        continue; // Hari ini sudah wujud
                    }

                    Attendance::create([
                        'employee_id' => $employee->id,
                        'company_id' => $employee->company_id,
                        'department_id' => $employee->department_id,
                        'work_schedule_type_id' => $employee->work_schedule_type_id ?? null,
                        'name' => $employee->name,
                        'employee_number' => $employee->employee_number,
                        'ic_number' => $employee->ic_number,
                        'notes' => null,
                        'status' => 'absent',
                        'date_of_month' => $date->toDateString(),
                        'check_in_time' => null,
                        'check_out_time' => null,
                        'location_id' => $employee->location_id,
                        'latitude' => null,
                        'longitude' => null,
                        'created_by' => 1,
                        'updated_by' => 1,
                        'created_at' => $date,
                        'updated_at' => $date,
                    ]);
                }
            }


            DB::commit();
            return response()->json(['message' => 'Monthly attendances generated successfully.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to generate attendances.', 'error' => $e->getMessage()], 500);
        }
    }


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
            ->when(
                $search,
                fn($query) =>
                $query->where(function ($q) use ($search) {
                    $q->whereHas(
                        'employee',
                        fn($q2) =>
                        $q2->where('name', 'like', "%{$search}%")
                            ->orWhere('ic_number', 'like', "%{$search}%")
                    )
                        ->orWhereHas(
                            'location',
                            fn($q2) =>
                            $q2->where('name', 'like', "%{$search}%")
                        )
                        ->orWhereHas(
                            'company',
                            fn($q2) =>
                            $q2->where('company_name', 'like', "%{$search}%")
                        );
                })
            )
            ->orderBy('date_of_month', 'asc')
            ->paginate(30)
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
