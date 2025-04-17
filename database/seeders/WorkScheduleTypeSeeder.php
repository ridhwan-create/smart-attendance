<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\WorkScheduleType;

class WorkScheduleTypeSeeder extends Seeder
{
    public function run(): void
    {
        WorkScheduleType::insert([
            ['type' => 'Normal Shift', 'created_by' => 1, 'updated_by' => 1],
            ['type' => 'Night Shift', 'created_by' => 1, 'updated_by' => 1],
        ]);
    }
}
