<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->boolean('is_late')->default(false)->after('check_in_time');
            $table->time('late_duration')->nullable()->after('is_late');
            $table->boolean('is_early_leave')->default(false)->after('check_out_time');
            $table->time('early_leave_duration')->nullable()->after('is_early_leave');
        });
    }
    
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn([
                'is_late',
                'late_duration',
                'is_early_leave',
                'early_leave_duration',
            ]);
        });
    }
    
};
