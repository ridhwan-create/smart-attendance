<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // PERMISSIONS
        $permissions = [
            // Companies
            'view companies', 'create companies', 'edit companies', 'delete companies',

            // Departments
            'view departments', 'create departments', 'edit departments', 'delete departments',

            // Locations
            'view locations', 'create locations', 'edit locations', 'delete locations',

            // Work Schedule Types
            'view work schedule types', 'create work schedule types', 'edit work schedule types', 'delete work schedule types',

            // Employees
            'view employees', 'create employees', 'edit employees', 'delete employees',

            // Attendances (Admin)
            'view attendances', 'create attendances', 'edit attendances', 'delete attendances',
            'generate attendance', 'view attendance report', 'export attendance report',

            // Self Attendance (Employee)
            'view self attendance', 'create self attendance',

            // Users
            'view users', 'create users', 'edit users', 'delete users', 'assign role',

            // Roles
            'view roles', 'create roles', 'edit roles', 'delete roles',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // ROLES
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $employee = Role::firstOrCreate(['name' => 'employee']);

        // Assign all permissions to Super Admin
        $superAdmin->syncPermissions(Permission::all());

        // Assign limited permissions to Employee
        $employee->syncPermissions([
            'view self attendance',
            'create self attendance',
        ]);

        // Optional: assign Super Admin role to first user
        $user = User::first();
        if ($user) {
            $user->assignRole('Super Admin');
        }
    }
}
