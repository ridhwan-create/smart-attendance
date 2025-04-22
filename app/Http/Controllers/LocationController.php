<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    // public function checkLocation()
    // {
    //     $locations = Location::all(); // Gantikan dengan model dan query anda
        
    //     return Inertia::render('LocationCheck', [
    //         'locations' => $locations,
    //     ]);
    // }
    public function checkLocation(Request $request): Response
    {
        $search = $request->query('search');
    
        $locations = Location::query()
            ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();
    
        return Inertia::render('LocationCheck', [
            'locations' => $locations,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    // public function index(): Response
    // {
    //     $locations = Location::all();

    //     return Inertia::render('locations/index', [
    //         'locations' => $locations,
    //     ]);
    // }
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $locations = Location::query()
            ->when($search, fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('locations/index', [
            'locations' => $locations,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('locations/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'address'        => 'nullable|string|max:500',
            'latitude'       => 'nullable|numeric',
            'longitude'      => 'nullable|numeric',
            'radius_meters'  => 'nullable|numeric|min:0',
        ]);

        Location::create([
            ...$validated,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('locations.index')->with('success', 'Location created successfully.');
    }

    public function show(Location $location): Response
    {
        return Inertia::render('locations/show', [
            'location' => $location,
        ]);
    }

    public function edit(Location $location): Response
    {
        return Inertia::render('locations/edit', [
            'location' => $location,
        ]);
    }

    public function update(Request $request, Location $location)
    {
        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'address'        => 'nullable|string|max:500',
            'latitude'       => 'nullable|numeric',
            'longitude'      => 'nullable|numeric',
            'radius_meters'  => 'nullable|numeric|min:0',
        ]);

        $location->update([
            ...$validated,
            'updated_by' => auth()->id(),
        ]);

        return redirect()->route('locations.index')->with('success', 'Location updated successfully.');
    }

    public function destroy(Location $location)
    {
        $location->delete();

        return redirect()->route('locations.index')->with('success', 'Location deleted successfully.');
    }
}
