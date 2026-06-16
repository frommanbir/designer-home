<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSiteSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Later protect with admin auth/middleware
    }

    public function rules(): array
    {
        return [
            // Branding
            'logo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp,svg', 'max:2048'],
            'favicon' => ['nullable', 'file', 'mimes:jpeg,jpg,png,ico,svg,webp', 'max:512'],
            'website_title' => ['nullable', 'string', 'max:255'],
            'website_slogan' => ['nullable', 'string', 'max:255'],

            // About
            'about_us' => ['nullable', 'string'],

            // Contact Details
            'primary_phone' => ['nullable', 'string', 'max:30'],
            'secondary_phone' => ['nullable', 'string', 'max:30'],
            'email_address' => ['nullable', 'email', 'max:255'],
            'physical_address' => ['nullable', 'string', 'max:1000'],
            'google_maps_embed' => ['nullable', 'string', 'max:5000'],

            // Facebook
            'facebook_title' => ['nullable', 'string', 'max:100'],
            'facebook_url' => ['nullable', 'url', 'max:1000'],
            'facebook_icon' => ['nullable', 'file', 'mimes:jpeg,jpg,png,webp,svg', 'max:512'],

            // X / Twitter
            'twitter_title' => ['nullable', 'string', 'max:100'],
            'twitter_url' => ['nullable', 'url', 'max:1000'],
            'twitter_icon' => ['nullable', 'file', 'mimes:jpeg,jpg,png,webp,svg', 'max:512'],

            // Instagram
            'instagram_title' => ['nullable', 'string', 'max:100'],
            'instagram_url' => ['nullable', 'url', 'max:1000'],
            'instagram_icon' => ['nullable', 'file', 'mimes:jpeg,jpg,png,webp,svg', 'max:512'],
        ];
    }

    public function messages(): array
    {
        return [
            'logo.image' => 'The logo must be a valid image file.',
            'logo.max' => 'The logo may not be greater than 2 MB.',
            'favicon.max' => 'The favicon may not be greater than 512 KB.',
            'email_address.email' => 'Please provide a valid email address.',
            'facebook_url.url' => 'The Facebook link must be a valid URL.',
            'twitter_url.url' => 'The X (Twitter) link must be a valid URL.',
            'instagram_url.url' => 'The Instagram link must be a valid URL.',
        ];
    }
}