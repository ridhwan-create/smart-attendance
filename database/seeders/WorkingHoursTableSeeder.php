<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WorkingHour;
use App\Models\Location;

class WorkingHoursTableSeeder extends Seeder
{
    public function run(): void
    {
        $locations = Location::all();

        $days = [
            'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
        ];

        foreach ($locations as $location) {
            foreach ($days as $day) {
                WorkingHour::create([
                    'location_id' => $location->id,
                    'day_of_week' => $day,
                    'start_time' => '08:00:00',
                    'end_time' => '17:00:00',
                    'grace_period_minutes' => 15,
                    'early_leave_margin_minutes' => 10,
                ]);
            }
        }
    }
}
