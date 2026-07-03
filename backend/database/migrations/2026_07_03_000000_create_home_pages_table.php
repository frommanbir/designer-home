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
            
            // Section 2: Designing Spaces
            $table->string('section2_title')->nullable();
            $table->longText('section2_description_1')->nullable();
            $table->longText('section2_description_2')->nullable();
            $table->string('section2_btn_inquiry_text')->nullable();
            $table->string('section2_btn_inquiry_link')->nullable();
            $table->string('section2_btn_projects_text')->nullable();
            $table->string('section2_btn_projects_link')->nullable();
            $table->string('section2_image_path')->nullable();
            
            // Section 3: Value Proposition
            $table->longText('section3_title')->nullable();
            $table->string('section3_image_path')->nullable();
            $table->string('section3_stat1_value')->nullable();
            $table->string('section3_stat1_label')->nullable();
            $table->string('section3_stat2_value')->nullable();
            $table->string('section3_stat2_label')->nullable();
            $table->string('section3_stat3_value')->nullable();
            $table->string('section3_stat3_label')->nullable();
            $table->string('section3_btn_text')->nullable();
            $table->string('section3_btn_link')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('home_pages');
    }
};
