<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('home_pages', function (Blueprint $table) {
            $table->id();
            $table->string('hero_image_path')->nullable();

            $table->string('intro_title')->nullable();
            $table->longText('intro_description')->nullable();
            $table->text('intro_extra_text')->nullable();
            $table->string('intro_image_path')->nullable();
            $table->string('inquiry_button_text')->nullable();
            $table->string('inquiry_button_link')->nullable();
            $table->string('projects_button_text')->nullable();
            $table->string('projects_button_link')->nullable();

            $table->string('stats_image_path')->nullable();
            $table->string('stats_title')->nullable();
            $table->longText('stats_description')->nullable();
            $table->unsignedInteger('expert_count')->nullable();
            $table->string('expert_label')->nullable();
            $table->unsignedInteger('project_count')->nullable();
            $table->string('project_label')->nullable();
            $table->decimal('rating_value', 8, 2)->nullable();
            $table->string('rating_label')->nullable();
            $table->string('learn_more_button_text')->nullable();
            $table->string('learn_more_button_link')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_pages');
    }
};
