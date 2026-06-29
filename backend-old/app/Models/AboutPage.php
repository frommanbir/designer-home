<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AboutPage extends Model
{
    protected $fillable = [
        'hero_title',
        'hero_image_path',
        'welcome_title',
        'welcome_description',
        'main_title',
        'main_description',
        'main_image_path',
        'why_choose_title',
        'why_choose_description',
    ];
}
