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
        // Senarai kebenaran
        // $permissions = [
        //     // Companies
        //     'create companies',
        //     'edit companies',
        //     'delete companies',
        //     'view companies',

        //     // Departments
        //     'create departments',
        //     'edit departments',
        //     'delete departments',
        //     'view departments',

        //     // Locations
        //     'create locations',
        //     'edit locations',
        //     'delete locations',
        //     'view locations',

        //     // Work Schedule Types
        //     'create work schedule types',
        //     'edit work schedule types',
        //     'delete work schedule types',
        //     'view work schedule types',

        //     // Employees
        //     'create employees',
        //     'edit employees',
        //     'delete employees',
        //     'view employees',

        //     // Attendances
        //     'create attendances',
        //     'edit attendances',
        //     'delete attendances',
        //     'view attendances',

        //     // Working Hours
        //     'create working hours',
        //     'edit working hours',
        //     'delete working hours',
        //     'view working hours',
        // ];
        $permissions = [
            // Companies
            'create companies',
            'edit companies',
            'delete companies',
            'view companies',
        
            // Departments
            'create departments',
            'edit departments',
            'delete departments',
            'view departments',
        
            // Locations
            'create locations',
            'edit locations',
            'delete locations',
            'view locations',
        
            // Work Schedule Types
            'create work schedule types',
            'edit work schedule types',
            'delete work schedule types',
            'view work schedule types',
        
            // Employees
            'create employees',
            'edit employees',
            'delete employees',
            'view employees',
        
            // Attendances
            'create attendances',
            'edit attendances',
            'delete attendances',
            'view attendances',

            // Attendance Reports
            'view attendance reports',
            'export attendance reports',

            // Self Attendance (Employee)
            'view self attendance',
            'create self attendance',
        
            // Working Hours
            'create working hours',
            'edit working hours',
            'delete working hours',
            'view working hours',
        
            // Users
            'create users',
            'edit users',
            'delete users',
            'view users',
        
            // Roles
            'create roles',
            'edit roles',
            'delete roles',
            'view roles',
        
            // Tambahan (khusus)
            'assign roles', // contoh: penetapan khas selain CRUD
        ];
        

        // Tambah kebenaran ke dalam database
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Tambah peranan
        $admin = Role::firstOrCreate(['name' => 'Super Admin']);
        $manager = Role::firstOrCreate(['name' => 'Manager']);
        $employee = Role::firstOrCreate(['name' => 'Employee']);

        // Beri semua kebenaran kepada Super Admin
        $admin->givePermissionTo(Permission::all());

        // Kebenaran untuk Manager (boleh lihat dan cipta)
        $manager->givePermissionTo([
            'view companies', 'create companies',
            'view departments', 'create departments',
            'view locations', 'create locations',
            'view work schedule types', 'create work schedule types',
            'view employees', 'create employees',
            'view attendances', 'create attendances',
            'view working hours', 'create working hours',
            'view attendance reports',
            'export attendance reports'
        ]);

        // Kebenaran untuk User (boleh lihat sahaja)
        $employee->givePermissionTo([
            'view companies',
            'view departments',
            'view locations',
            'view work schedule types',
            'view employees',
            'view attendances',
            'view working hours',
            'view attendance reports',
            'export attendance reports',
            'view self attendance',
            'create self attendance',
        ]);
    }
}
