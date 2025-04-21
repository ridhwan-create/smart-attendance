<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // Ambil users yang belum lagi ada dalam employees
        $availableUsers = User::whereNotIn('id', Employee::pluck('user_id'))->get()->shuffle();

        // Hadkan bilangan employee berdasarkan user yang tersedia
        $count = min(1000, $availableUsers->count());

        foreach ($availableUsers->take($count) as $user) {
            Employee::create([
                'ic_number'      => $faker->unique()->numerify('############'), // 12 digit
                'name'           => $user->name,
                'email'          => $user->email,
                'phone'          => $faker->phoneNumber,
                'company_id'     => rand(1, 3),
                'department_id'  => rand(1, 3),
                'position'       => $faker->jobTitle,
                'user_id'        => $user->id,
                'location_id'    => rand(1, 68),
            ]);
        }
    }
}
