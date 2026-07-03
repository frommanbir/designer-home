<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomePage extends Model
{
    protected $table = 'home_pages';

    protected $fillable = [
        'hero_image_path',
        'section2_title',
        'section2_description_1',
        'section2_description_2',
        'section2_btn_inquiry_text',
        'section2_btn_inquiry_link',
        'section2_btn_projects_text',
        'section2_btn_projects_link',
        'section2_image_path',
        
        'section3_title',
        'section3_image_path',
        'section3_stat1_value',
        'section3_stat1_label',
        'section3_stat2_value',
        'section3_stat2_label',
        'section3_stat3_value',
        'section3_stat3_label',
        'section3_btn_text',
        'section3_btn_link',
    ];
}
