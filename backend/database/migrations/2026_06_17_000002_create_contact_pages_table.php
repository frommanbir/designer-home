<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contact_pages', function (Blueprint $table) {
            $table->id();
            $table->string('hero_title')->nullable();
            $table->string('hero_image_path')->nullable();
            $table->string('address_title')->nullable();
            $table->text('address_description')->nullable();
            $table->string('phone_title')->nullable();
            $table->text('phone_description')->nullable();
            $table->string('email_title')->nullable();
            $table->text('email_description')->nullable();
            $table->string('form_title')->nullable();
            $table->text('form_description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contact_pages');
    }
};
