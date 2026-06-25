<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

use App\Traits\HasSlug;

class Project extends Model
{
    use HasSlug;
    protected $fillable = [
        'project_category_id',
        'title',
        'slug',
        'subtitle',
        'description',
        'gallery_images',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'gallery_images' => 'array',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProjectCategory::class, 'project_category_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
