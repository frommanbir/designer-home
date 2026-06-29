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
        Schema::table('project_categories', function (Blueprint $table) {
            $table->string('hero_title')->nullable();
            $table->string('hero_image_path')->nullable();
            $table->string('subtitle')->nullable();
            $table->text('description')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('project_categories', function (Blueprint $table) {
            $table->dropColumn(['hero_title', 'hero_image_path', 'subtitle', 'description']);
        });
    }
};
