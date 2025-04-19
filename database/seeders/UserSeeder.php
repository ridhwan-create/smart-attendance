<?php

// database/seeders/UserSeeder.php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Optional: Clear previous users except admin (id = 1 maybe)
        User::where('id', '>', 1)->delete();

        // Generate 1000 fake users
        User::factory()->count(1000)->create();
    }
}
