<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        Department::create([
            'name' => 'Human Resources',
            'company_id' => 1,
            'created_by' => 1,
            'updated_by' => 1,
        ]);
    }
}
