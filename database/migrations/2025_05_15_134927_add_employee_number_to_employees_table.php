<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->string('employee_number')
                ->nullable() // only if you want to allow null values
                ->before('ic_number');
        });

        // Add unique index separately for better control
        Schema::table('employees', function (Blueprint $table) {
            $table->unique('employee_number', 'employees_employee_number_unique');
        });
    }

    public function down()
    {
        Schema::table('employees', function (Blueprint $table) {
            // Drop the index first
            $table->dropUnique('employees_employee_number_unique');
            // Then drop the column
            $table->dropColumn('employee_number');
        });
    }
};
