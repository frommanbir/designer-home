<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomePage extends Model
{
    protected $fillable = [
        'hero_image_path',
        'intro_title',
        'intro_description',
        'intro_extra_text',
        'intro_image_path',
        'stats_image_path',
        'stats_title',
        'stats_description',
        'expert_count',
        'project_count',
        'rating_value',
    ];

    protected function casts(): array
    {
        return [
            'expert_count' => 'integer',
            'project_count' => 'integer',
            'rating_value' => 'decimal:2',
        ];
    }
}
