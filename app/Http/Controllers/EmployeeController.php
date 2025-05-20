<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Company;
use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\User;
use App\Models\Location;

class EmployeeController extends Controller
{
    // public function index(): Response
    // {
    //     $employees = Employee::with(['company', 'department'])->get();

    //     return Inertia::render('employees/index', [
    //         'employees' => $employees,
    //     ]);
    // }
    public function index(Request $request): Response
    {
        $search = $request->input('search');

        $employees = Employee::with(['company', 'department'])
            ->when($search, fn($query) =>
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('employees/index', [
            'employees' => $employees,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }


    public function create(): Response
    {
        $assignedUserIds = Employee::pluck('user_id')->filter(); // Ambil semua user_id yg telah digunakan
        $users = User::whereNotIn('id', $assignedUserIds)->select('id', 'name', 'email')->get();

        return Inertia::render('employees/create', [
            'companies' => Company::select('id', 'company_name')->get(),
            'departments' => Department::select('id', 'name')->get(),
            'users' => $users,
            'locations' => Location::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_number' => 'required|string|max:255',
            'ic_number' => 'required|string|max:20',
            'name' => 'required|unique:employees,name',
            'email' => 'required|email|max:255|unique:employees,email',
            'phone' => 'required|string|max:20',
            'position' => 'nullable|string|max:100',
            'company_id' => 'required|exists:companies,id',
            'department_id' => 'required|exists:departments,id',
            'user_id' => 'required|unique:employees,user_id',
            'location_id' => 'required|string|max:2',
        ]);

        Employee::create([
            ...$validated,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('employees.index')->with('success', 'Employee created successfully.');
    }

    public function show(Employee $employee): Response
    {
        $employee->load(['company', 'department']);

        return Inertia::render('employees/show', [
            'employee' => $employee,
        ]);
    }

    public function edit(Employee $employee): Response
    {
        $assignedUserIds = Employee::pluck('user_id')->filter(); // Ambil semua user_id yg telah digunakan
        $users = User::whereNotIn('id', $assignedUserIds)->select('id', 'name')->get();

        return Inertia::render('employees/edit', [
            'employee' => $employee,
            'companies' => Company::select('id', 'company_name')->get(),
            'departments' => Department::select('id', 'name')->get(),
            'users' => $users,
            'locations' => Location::select('id', 'name')->get(),
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'employee_number' => 'required|string|max:255',
            'ic_number' => 'required|string|max:20',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:employees,email,' . $employee->id,
            'phone' => 'required|string|max:20',
            'position' => 'nullable|string|max:100',
            'company_id' => 'required|exists:companies,id',
            'department_id' => 'required|exists:departments,id',
            'user_id' => 'required|exists:users,id',
            'location_id' => 'required|exists:locations,id',
        ]);

        $employee->update([
            ...$validated,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('employees.index')->with('success', 'Employee updated successfully.');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return redirect()->route('employees.index')->with('success', 'Employee deleted successfully.');
    }
}
