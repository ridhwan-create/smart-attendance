<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Employee;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        Employee::create([
            'ic_number' => '900101-01-1234',
            'name' => 'Ahmad Bin Ali',
            'email' => 'ahmad@example.com',
            'phone' => '0123456789',
            'company_id' => 1,
            'department_id' => 1,
            'position' => 'Admin Executive',
        ]);
    }
}
