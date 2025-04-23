<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    // public function index(): Response
    // {
    //     $departments = Department::with('company')->get();

    //     return Inertia::render('departments/index', [
    //         'departments' => $departments,
    //     ]);
    // }
    public function index(Request $request): \Inertia\Response
    {
        $search = $request->input('search');

        $departments = Department::with('company')
            ->when($search, fn ($query) =>
                $query->where('name', 'like', '%' . $search . '%')
            )
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('departments/index', [
            'departments' => $departments,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }


    public function create(): Response
    {
        //return Inertia::render('departments/create');
        return Inertia::render('departments/create', [
            'companies' => Company::all(),
        ]);
        
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company_id' => 'required|exists:companies,id',
        ]);

        Department::create([
            ...$validated,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('departments.index')->with('success', 'Department created successfully.');
    }

    public function show(Department $department): Response
    {
        $department->load('company');

        return Inertia::render('departments/show', [
            'department' => $department,
        ]);
    }

    public function edit(Department $department): Response
    {
        return Inertia::render('departments/edit', [
            'department' => $department,
            'companies' => Company::select('id', 'company_name')->get(),
        ]);
    }

    public function update(Request $request, Department $department)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'company_id' => 'required|exists:companies,id',
        ]);

        $department->update([
            ...$validated,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('departments.index')->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return redirect()->route('departments.index')->with('success', 'Department deleted successfully.');
    }
}
