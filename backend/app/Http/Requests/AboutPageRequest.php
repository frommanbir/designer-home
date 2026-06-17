<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AboutPageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hero_title' => ['nullable', 'string', 'max:255'],
            'hero_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
            'welcome_title' => ['nullable', 'string', 'max:255'],
            'welcome_description' => ['nullable', 'string'],
            'main_title' => ['nullable', 'string', 'max:255'],
            'main_description' => ['nullable', 'string'],
            'main_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:2048'],
            'why_choose_title' => ['nullable', 'string', 'max:255'],
            'why_choose_description' => ['nullable', 'string'],
        ];
    }
}
