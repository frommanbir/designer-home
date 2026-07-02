<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class HomePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hero_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:20480'],
            'intro_title' => ['nullable', 'string', 'max:255'],
            'intro_description' => ['nullable', 'string'],
            'intro_extra_text' => ['nullable', 'string'],
            'intro_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:20480'],
            'inquiry_button_text' => ['nullable', 'string', 'max:255'],
            'inquiry_button_link' => ['nullable', 'string', 'max:1000'],
            'projects_button_text' => ['nullable', 'string', 'max:255'],
            'projects_button_link' => ['nullable', 'string', 'max:1000'],
            'stats_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:20480'],
            'stats_title' => ['nullable', 'string', 'max:255'],
            'stats_description' => ['nullable', 'string'],
            'expert_count' => ['nullable', 'integer', 'min:0'],
            'expert_label' => ['nullable', 'string', 'max:255'],
            'project_count' => ['nullable', 'integer', 'min:0'],
            'project_label' => ['nullable', 'string', 'max:255'],
            'rating_value' => ['nullable', 'numeric', 'min:0'],
            'rating_label' => ['nullable', 'string', 'max:255'],
            'learn_more_button_text' => ['nullable', 'string', 'max:255'],
            'learn_more_button_link' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
