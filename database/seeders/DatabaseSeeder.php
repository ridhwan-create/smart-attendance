<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\CompanySeeder;
use Database\Seeders\DepartmentSeeder;
use Database\Seeders\LocationSeeder;
use Database\Seeders\WorkScheduleTypeSeeder;
use Database\Seeders\EmployeeSeeder;
use Database\Seeders\AttendanceSeeder;

class DatabaseSeeder extends Seeder
{
    // public function run(): void
    // {
    //     $this->call([
    //         CompanySeeder::class,
    //         DepartmentSeeder::class,
    //         WorkScheduleTypeSeeder::class,
    //         LocationSeeder::class,
    //         EmployeeSeeder::class,
    //         AttendanceSeeder::class,
    //     ]);
    // }
    public function run(): void
    {
        $this->call([
            AttendanceSeeder::class,
        ]);        
    }
}
