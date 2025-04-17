<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('ic_number')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone');
            $table->foreignId('company_id')->constrained()->cascadeOnDelete();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->string('position');
            $table->timestamps();
            $table->softDeletes(); // Optional, if you want to use soft deletes
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
