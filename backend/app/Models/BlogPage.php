<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlogPage extends Model
{
    protected $fillable = [
        'hero_title',
        'hero_image_path',
    ];
}
