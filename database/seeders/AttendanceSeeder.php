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

        foreach ($employees->take(1000) as $employee) { // ubah jumlah jika perlu
            $location = $employee->location ?? Location::inRandomOrder()->first();
            $companyId = $employee->company_id;

            // Generate check-in time (antara 7:00 hingga 9:30 pagi)
            $checkIn = Carbon::parse('08:00')->addMinutes(rand(-30, 90)); // simulate awal atau lewat

            // Determine lateness (assume 09:00 is the limit)
            $lateLimit = Carbon::parse('09:00');
            $isLate = $checkIn->gt($lateLimit);
            $lateDuration = $isLate ? $checkIn->diffInMinutes($lateLimit) : 0;

            // Generate check-out time (antara 16:30 hingga 18:00)
            $checkOut = Carbon::parse('17:00')->addMinutes(rand(-30, 60));

            // Determine early leave (assume 17:00 as minimum)
            $earlyLimit = Carbon::parse('17:00');
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
