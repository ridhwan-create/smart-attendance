<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Attendance;


class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        Attendance::create([
            'employee_id' => 1,
            'ic_number' => '900101-01-1234',
            'name' => 'Ahmad Bin Ali',
            'check_in_time' => now()->subHours(8),
            'check_out_time' => now(),
            'location_id' => 1,
            'notes' => 'On time',
            'company_id' => 1,
            'work_schedule_type_id' => 1,
            'created_by' => 1,
            'updated_by' => 1,
        ]);
    }
}
