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
        Schema::table('attendances', function (Blueprint $table) {
            $table->string('employee_number')
                ->nullable() // remove if field is required
                ->after('employee_id')
                ->before('ic_number');

            // Optional: add index for better performance
            $table->index('employee_number', 'attendances_employee_number_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('attendances', function (Blueprint $table) {
            // Drop index first if created
            $table->dropIndex('attendances_employee_number_index');

            // Then drop the column
            $table->dropColumn('employee_number');
        });
    }
};
