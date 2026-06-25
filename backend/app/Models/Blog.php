<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

use App\Traits\HasSlug;

class Blog extends Model
{
    use HasSlug;
    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'content',
        'image_path',
        'published_date',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'published_date' => 'date',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
