<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('work_schedule_types', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // Jenis jadual kerja, contoh: "Shift", "Full-time", "Part-time"
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes(); // Optional, jika ingin menggunakan soft deletes
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_schedule_types');
    }
};
