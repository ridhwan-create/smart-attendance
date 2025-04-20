<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddWorkScheduleTypeIdToLocationsTable extends Migration
{
    /**
     * Jalankan migrasi.
     *
     * @return void
     */
    public function up()
    {
        // First migration: add the column nullable
        Schema::table('locations', function (Blueprint $table) {
            $table->unsignedBigInteger('work_schedule_type_id')->nullable();
        });
    
        // Second migration: clean data and add constraint
        // Run data cleanup commands here
        
        // Third migration: add the foreign key constraint
        Schema::table('locations', function (Blueprint $table) {
            $table->foreign('work_schedule_type_id')
                  ->references('id')
                  ->on('work_schedule_types')
                  ->onDelete('cascade');
        });
    }

    /**
     * Balikkan migrasi.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropForeign(['work_schedule_type_id']); // Menyahkan foreign key
            $table->dropColumn('work_schedule_type_id'); // Menyahkan kolum
        });
    }
}
