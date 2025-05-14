<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Modular permissions grouped by feature/module
        $modules = [
            'companies' => ['create', 'edit', 'delete', 'view'],
            'departments' => ['create', 'edit', 'delete', 'view'],
            'locations' => ['create', 'edit', 'delete', 'view'],
            'work schedule types' => ['create', 'edit', 'delete', 'view'],
            'employees' => ['create', 'edit', 'delete', 'view'],
            'attendances' => ['create', 'edit', 'delete', 'view'],
            'attendance reports' => ['view', 'export'],
            'working hours' => ['create', 'edit', 'delete', 'view'],
            'users' => ['create', 'edit', 'delete', 'view'],
            'roles' => ['create', 'edit', 'delete', 'view'],
            'self attendance' => ['view', 'create'],
            'dashboard' => ['view'],
            'dashboard super' => ['view'],
            'dashboard manager' => ['view'],
        ];

        $extraPermissions = [
            'assign roles', // Special/custom permission
        ];

        // Generate all permission strings
        $permissions = [];

        foreach ($modules as $module => $actions) {
            foreach ($actions as $action) {
                $permissions[] = "$action $module";
            }
        }

        $permissions = array_merge($permissions, $extraPermissions);

        // Insert permissions into database
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Define roles and assign permissions
        $rolesPermissions = [
            'Super Admin' => Permission::all()->pluck('name')->toArray(),

            'Manager' => [
                'view departments',
                'create departments',
                'view locations',
                'create locations',
                'view work schedule types',
                'create work schedule types',
                'view employees',
                'create employees',
                'view attendances',
                'create attendances',
                'view working hours',
                'create working hours',
                'view attendance reports',
                'view dashboard manager',
                'export attendance reports',
            ],

            'Employee' => [
                'view attendance reports',
                'export attendance reports',
                'view self attendance',
                'create self attendance',
            ],
        ];

        // Assign permissions to each role
        foreach ($rolesPermissions as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);
            $role->syncPermissions($rolePermissions);
        }
    }
}
