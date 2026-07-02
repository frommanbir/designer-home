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
        'inquiry_button_text',
        'inquiry_button_link',
        'projects_button_text',
        'projects_button_link',
        'stats_image_path',
        'stats_title',
        'stats_description',
        'expert_count',
        'expert_label',
        'project_count',
        'project_label',
        'rating_value',
        'rating_label',
        'learn_more_button_text',
        'learn_more_button_link',
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
