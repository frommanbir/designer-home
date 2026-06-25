<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Traits\HasSlug;

class ServiceCategory extends Model
{
    use HasSlug;

    protected function slugSource(): string
    {
        return 'name';
    }
    protected $fillable = [
        'name',
        'slug',
    ];

    public function services(): HasMany
    {
        return $this->hasMany(Service::class);
    }
}
