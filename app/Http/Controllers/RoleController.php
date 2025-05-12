<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $roles = Role::with('permissions')
            ->latest()
            ->paginate(10)
            ->through(function ($role) {
                return [
                    'id' => $role->id,
                    'name' => $role->name,
                    'permissions' => $role->permissions->map(function ($permission) {
                        return [
                            'id' => $permission->id,
                            'name' => $permission->name,
                        ];
                    }),
                ];
            });

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'permissions' => Permission::pluck('name'),
            'filters' => request()->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('roles/create', [
            'permissions' => Permission::all()->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        DB::transaction(function () use ($request) {
            $role = Role::create(['name' => $request->name]);
            $role->syncPermissions($request->permissions);
        });

        return redirect()->route('roles.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        // Optional: Jika Anda ingin membuat detail view nanti
        return Inertia::render('roles/show', [
            'role' => $role->load('permissions'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    // public function edit(Role $role)
    // {
    //     return Inertia::render('roles/edit', [
    //         'role' => [
    //             'id' => $role->id,
    //             'name' => $role->name,
    //             'permissions' => $role->permissions->pluck('name'),
    //         ],
    //         'allPermissions' => Permission::all()->map(function ($permission) {
    //             return [
    //                 'id' => $permission->id,
    //                 'name' => $permission->name,
    //             ];
    //         }),
    //     ]);
    // }
    public function edit(Role $role)
    {
        return Inertia::render('roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions->map(function ($permission) {
                    return [
                        'id' => $permission->id,
                        'name' => $permission->name,
                    ];
                }),
            ],
            'allPermissions' => Permission::all()->map(function ($permission) {
                return [
                    'id' => $permission->id,
                    'name' => $permission->name,
                ];
            }),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, Role $role)
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
    //         'permissions' => 'array',
    //         'permissions.*' => 'string|exists:permissions,name',
    //     ]);

    //     DB::transaction(function () use ($request, $role) {
    //         $role->update(['name' => $request->name]);
    //         $role->syncPermissions($request->permissions);
    //     });

    //     return redirect()->route('roles.index')
    //         ->with('success', 'Role updated successfully.');
    // }
    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'array',
            'permissions.*' => 'integer|exists:permissions,id', // Ubah ke integer dan exists by id
        ]);

        DB::transaction(function () use ($request, $role) {
            $role->update(['name' => $request->name]);
            $role->syncPermissions($request->permissions); // Ini akan bekerja dengan ID
        });

        return redirect()->route('roles.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        // Prevent deletion of super admin role
        if ($role->name === 'super admin') {
            return redirect()->back()
                ->with('error', 'Cannot delete super admin role.');
        }

        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Role deleted successfully.');
    }
}