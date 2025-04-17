<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        Company::create([
            'registration_number' => '20240101',
            'company_name' => 'SmartTech Solutions',
            'created_by' => 1,
            'updated_by' => 1,
        ]);
    }
}
