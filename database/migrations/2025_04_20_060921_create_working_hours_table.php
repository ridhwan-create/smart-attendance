<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('working_hours', function (Blueprint $table) {
            $table->id();
            $table->foreignId('location_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('day_of_week'); // e.g. Monday, Tuesday, etc.
            $table->time('start_time');
            $table->time('end_time');
            $table->unsignedTinyInteger('grace_period_minutes')->default(0);
            $table->unsignedTinyInteger('early_leave_margin_minutes')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('working_hours');
    }
};
