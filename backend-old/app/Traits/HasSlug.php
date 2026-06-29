<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasSlug
{
    /**
     * The attribute to use for slug generation.
     */
    protected function slugSource(): string
    {
        return 'title';
    }

    /**
     * Boot the trait.
     */
    protected static function bootHasSlug(): void
    {
        static::creating(function ($model) {
            if (!$model->slug) {
                $source = $model->slugSource();
                $model->slug = Str::slug($model->$source);
                
                // Ensure uniqueness
                $count = 1;
                $originalSlug = $model->slug;
                while (static::where('slug', $model->slug)->exists()) {
                    $model->slug = $originalSlug . '-' . $count++;
                }
            }
        });

        static::updating(function ($model) {
            // Only regenerate if the source field changed and slug matches the old title
            // Usually, we don't change slugs after creation for SEO, so we leave it as is 
            // unless it's explicitly empty.
            if (!$model->slug) {
                $source = $model->slugSource();
                $model->slug = Str::slug($model->$source);
                
                $count = 1;
                $originalSlug = $model->slug;
                while (static::where('slug', $model->slug)->where('id', '!=', $model->id)->exists()) {
                    $model->slug = $originalSlug . '-' . $count++;
                }
            }
        });
    }
}
