<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Location;

class LocationSeeder extends Seeder
{
    public function run(): void
    {
        Location::create([
            'name' => 'HQ Office',
            'address' => '123, Jalan Smart, Cyberjaya',
            'latitude' => '2.9264',
            'longitude' => '101.6424',
            'radius_meters' => 100,
            'created_by' => 1,
            'updated_by' => 1,
        ]);
    }
}
