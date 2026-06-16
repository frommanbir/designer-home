<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
