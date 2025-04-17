<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('address');
            $table->decimal('latitude', 10, 7); // Untuk koordinat geografi
            $table->decimal('longitude', 10, 7); // Untuk koordinat geografi
            $table->integer('radius_meters')->default(0); // Radius dalam meter
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes(); // Optional, jika ingin menggunakan soft deletes
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};
