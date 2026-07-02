<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_pages', function (Blueprint $table) {
            $table->id();
            $table->string('hero_title')->nullable();
            $table->string('hero_image_path')->nullable();
            $table->string('welcome_title')->nullable();
            $table->longText('welcome_description')->nullable();
            $table->string('main_title')->nullable();
            $table->longText('main_description')->nullable();
            $table->string('main_image_path')->nullable();
            $table->string('why_choose_title')->nullable();
            $table->longText('why_choose_description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_pages');
    }
};
