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
        Schema::create('role-permission', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->index()->constrained('roles')->cascadeOnDelete();
            $table->foreignId('permission_id')->index()->constrained('permissions')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role-permission');
    }
};
