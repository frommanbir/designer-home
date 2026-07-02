<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Traits\HasSlug;

class ProjectCategory extends Model
{
    use HasSlug;

    protected function slugSource(): string
    {
        return 'name';
    }
    protected $fillable = [
        'name',
        'slug',
        'hero_title',
        'hero_image_path',
        'subtitle',
        'description',
    ];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
