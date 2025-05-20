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
            $table->unsignedBigInteger('department_id')
                ->nullable()
                ->after('company_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('attendances', function (Blueprint $table) {
            // Then drop the column
            $table->dropColumn('department_id');
        });
    }
};
