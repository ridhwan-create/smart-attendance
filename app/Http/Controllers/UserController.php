<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:view users')->only(['index', 'show']);
        $this->middleware('permission:create users')->only(['create', 'store']);
        $this->middleware('permission:edit users')->only(['edit', 'update']);
        $this->middleware('permission:delete users')->only('destroy');
        $this->middleware('permission:assign roles')->only(['showAssignRoleForm', 'assignRole']);
    }

    public function index()
    {
        $users = User::with('roles')
            ->latest()
            ->paginate(10)
            ->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->map(function ($role) {
                        return [
                            'id' => $role->id,
                            'name' => $role->name,
                        ];
                    }),
                    'created_at' => $user->created_at->format('d M Y'),
                ];
            });

        return Inertia::render('users/index', [
            'users' => $users,
            'roles' => Role::pluck('name', 'id'),
            'filters' => request()->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('users/create', [
            'roles' => Role::all()->map(fn($role) => [
                'id' => $role->id,
                'name' => $role->name,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            if ($request->has('roles')) {
                $user->roles()->sync($request->roles);
            }
        });

        return redirect()->route('users.index')
            ->with('success', 'User created successfully.');
    }

    public function show(User $user)
    {
        return Inertia::render('users/show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->map(fn($role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                ]),
                'created_at' => $user->created_at->format('d M Y H:i'),
                'updated_at' => $user->updated_at->format('d M Y H:i'),
            ],
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('id'),
            ],
            'allRoles' => Role::all()->map(fn($role) => [
                'id' => $role->id,
                'name' => $role->name,
            ]),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'roles' => 'nullable|array',
            'roles.*' => 'exists:roles,id',
        ]);

        DB::transaction(function () use ($request, $user) {
            $updateData = [
                'name' => $request->name,
                'email' => $request->email,
            ];

            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);
            }

            $user->update($updateData);

            if ($request->has('roles')) {
                $user->roles()->sync($request->roles);
            }
        });

        return redirect()->route('users.index')
            ->with('success', 'User updated successfully.');
    }

    public function destroy(User $user)
    {
        if ($user->hasRole('super admin')) {
            return redirect()->back()
                ->with('error', 'Cannot delete super admin user.');
        }

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'User deleted successfully.');
    }

    public function showAssignRoleForm(User $user)
    {
        return Inertia::render('users/AssignRole', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'current_roles' => $user->roles->pluck('name'),
            ],
            'roles' => Role::all()->map(fn($role) => [
                'id' => $role->id,
                'name' => $role->name,
            ]),
        ]);
    }

    public function assignRole(Request $request, User $user)
    {
        $request->validate([
            'roles' => 'required|array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user->roles()->sync($request->roles);

        return redirect()->route('users.index')
            ->with('success', 'Roles assigned successfully.');
    }
}
