<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CompanyController extends Controller
{
    // public function index()
    // {
    //     $companies = Company::latest()->paginate(10);

    //     return Inertia::render('companies/index', [
    //         'companies' => $companies,
    //     ]);
    // }

    public function index()
    {
        $companies = Company::all();

        return Inertia::render('companies/index', [
            'companies' => $companies,
        ]);
    }

    public function create()
    {
        return Inertia::render('companies/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'registration_number' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
        ]);

        Company::create([
            ...$validated,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('companies.index')->with('success', 'Company created.');
    }

    public function edit(Company $company)
    {
        return Inertia::render('companies/edit', [
            'company' => $company,
        ]);
    }

    public function update(Request $request, Company $company)
    {
        $validated = $request->validate([
            'registration_number' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
        ]);

        $company->update([
            ...$validated,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('companies.index')->with('success', 'Company updated.');
    }

    public function show(Company $company)
    {
        return Inertia::render('companies/show', [
            'company' => $company,
        ]);
    }

    // public function destroy(Company $company)
    // {
    //     $company->delete();

    //     return redirect()->route('companies.index')->with('success', 'Company deleted.');
    // }
    public function destroy(Company $company)
    {
        $company->delete();

        return redirect()->route('companies.index')->with('success', 'Company deleted successfully.');
    }

}

