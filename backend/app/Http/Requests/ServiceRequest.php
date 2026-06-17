<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $service = $this->route('service');

        return [
            'service_category_id' => ['nullable', 'exists:service_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('services', 'slug')->ignore($service?->id),
            ],
            'subtitle' => ['nullable', 'string', 'max:255'],
            'short_description' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'thumbnail_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:20480'],
            'hero_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:20480'],
            'why_choose_title' => ['nullable', 'string', 'max:255'],
            'why_choose_description' => ['nullable', 'string'],
            'why_choose_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:20480'],
            'why_choose_points' => ['nullable', 'array'],
            'why_choose_points.*' => ['nullable', 'string'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:20480'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
