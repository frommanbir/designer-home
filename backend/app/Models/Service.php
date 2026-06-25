<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\HasSlug;

class Service extends Model
{
    use HasSlug;
    protected $fillable = [
        'service_category_id',
        'title',
        'slug',
        'subtitle',
        'short_description',
        'description',
        'thumbnail_image_path',
        'hero_image_path',
        'why_choose_title',
        'why_choose_description',
        'why_choose_image_path',
        'why_choose_points',
        'gallery_images',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'why_choose_points' => 'array',
        'gallery_images' => 'array',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ServiceCategory::class, 'service_category_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
