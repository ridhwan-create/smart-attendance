<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Location;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Carbon;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $employees = Employee::with('location')->get()->shuffle();

        // Ambil 100 pekerja rawak, ubah nilai kalau perlu
        foreach ($employees->take(100) as $employee) {
            $location = $employee->location ?? Location::inRandomOrder()->first();
            $companyId = $employee->company_id;

            $startDate = now()->copy()->subDays(60);
            $endDate = now();

            // Loop setiap hari
            for ($date = $startDate->copy(); $date->lte($endDate); $date->addDay()) {
                // Skip hari Sabtu dan Ahad
                if ($date->isWeekend()) {
                    continue;
                }

                // Cek jika attendance untuk pekerja ini dan tarikh ini sudah wujud
                $existing = Attendance::where('employee_id', $employee->id)
                    ->whereDate('check_in_time', $date->toDateString())
                    ->exists();

                if ($existing) {
                    continue;
                }

                // Generate masa check-in
                $checkIn = $date->copy()->setTime(8, 0)->addMinutes(rand(-30, 90));

                // Logik lewat
                $lateLimit = $date->copy()->setTime(9, 0);
                $isLate = $checkIn->gt($lateLimit);
                $lateDuration = $isLate ? $checkIn->diffInMinutes($lateLimit) : 0;

                // Generate masa check-out
                $checkOut = $date->copy()->setTime(17, 0)->addMinutes(rand(-30, 60));

                // Logik balik awal
                $earlyLimit = $date->copy()->setTime(17, 0);
                $isEarly = $checkOut->lt($earlyLimit);
                $earlyDuration = $isEarly ? $earlyLimit->diffInMinutes($checkOut) : 0;

                Attendance::create([
                    'employee_id'           => $employee->id,
                    'ic_number'             => $employee->ic_number,
                    'name'                  => $employee->name,
                    'check_in_time'         => $checkIn,
                    'is_late'               => $isLate,
                    'late_duration'         => $lateDuration,
                    'check_out_time'        => $checkOut,
                    'is_early_leave'        => $isEarly,
                    'early_leave_duration'  => $earlyDuration,
                    'location_id'           => $location->id,
                    'notes'                 => $faker->optional()->sentence(),
                    'company_id'            => $companyId,
                    'work_schedule_type_id' => $location->work_schedule_type_id,
                    'created_by'            => $employee->user_id,
                    'updated_by'            => $employee->user_id,
                    'latitude'              => $location->latitude,
                    'longitude'             => $location->longitude,
                ]);
            }
        }
    }
}
