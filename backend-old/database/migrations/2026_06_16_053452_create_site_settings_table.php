<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();

            // Branding
            $table->string('logo_path')->nullable();
            $table->string('favicon_path')->nullable();
            $table->string('website_title')->nullable();
            $table->string('website_slogan')->nullable();

            // About
            $table->longText('about_us')->nullable();

            // Contact Details
            $table->string('primary_phone')->nullable();
            $table->string('secondary_phone')->nullable();
            $table->string('email_address')->nullable();
            $table->text('physical_address')->nullable();
            $table->text('google_maps_embed')->nullable();

            // Facebook
            $table->string('facebook_title')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('facebook_icon_path')->nullable();

            // X / Twitter
            $table->string('twitter_title')->nullable();
            $table->string('twitter_url')->nullable();
            $table->string('twitter_icon_path')->nullable();

            // Instagram
            $table->string('instagram_title')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('instagram_icon_path')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};