<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactPage extends Model
{
    protected $fillable = [
        'hero_title',
        'hero_image_path',
        'address_title',
        'address_description',
        'phone_title',
        'phone_description',
        'email_title',
        'email_description',
        'form_title',
        'form_description',
    ];
}
