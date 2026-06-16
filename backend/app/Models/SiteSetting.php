<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class SiteSetting extends Model
{
    protected $table = 'site_settings';

    protected $fillable = [
        'logo_path',
        'favicon_path',
        'website_title',
        'website_slogan',

        'about_us',

        'primary_phone',
        'secondary_phone',
        'email_address',
        'physical_address',
        'google_maps_embed',

        'facebook_title',
        'facebook_url',
        'facebook_icon_path',

        'twitter_title',
        'twitter_url',
        'twitter_icon_path',

        'instagram_title',
        'instagram_url',
        'instagram_icon_path',
    ];

    protected $appends = [
        'logo_url',
        'favicon_url',
        'facebook_icon_url',
        'twitter_icon_url',
        'instagram_icon_url',
    ];

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo_path ? asset(Storage::disk('public')->url($this->logo_path)) : null;
    }

    public function getFaviconUrlAttribute(): ?string
    {
        return $this->favicon_path ? asset(Storage::disk('public')->url($this->favicon_path)) : null;
    }

    public function getFacebookIconUrlAttribute(): ?string
    {
        return $this->facebook_icon_path ? asset(Storage::disk('public')->url($this->facebook_icon_path)) : null;
    }

    public function getTwitterIconUrlAttribute(): ?string
    {
        return $this->twitter_icon_path ? asset(Storage::disk('public')->url($this->twitter_icon_path)) : null;
    }

    public function getInstagramIconUrlAttribute(): ?string
    {
        return $this->instagram_icon_path ? asset(Storage::disk('public')->url($this->instagram_icon_path)) : null;
    }

    public static function instance(): static
    {
        return static::query()->first() ?? static::create([]);
    }
}