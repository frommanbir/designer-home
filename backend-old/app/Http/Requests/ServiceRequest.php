<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $slugSource = $this->filled('slug')
            ? $this->input('slug')
            : $this->input('title');

        $slug = Str::slug((string) $slugSource);

        if ($slug !== '') {
            $this->merge([
                'slug' => $slug,
            ]);
        }
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
            'thumbnail_image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:20480'],
            'hero_image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:20480'],
            'why_choose' => ['nullable', 'array'],
            'why_choose.*.title' => ['nullable', 'string', 'max:255'],
            'why_choose.*.description' => ['nullable', 'string'],
            'why_choose.*.points' => ['nullable', 'array'],
            'why_choose.*.points.*' => ['nullable', 'string'],
            'why_choose.*.image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:20480'],
            'gallery_images' => ['nullable', 'array'],
            'gallery_images.*' => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,svg', 'max:20480'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
