<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProjectRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if (! $this->filled('slug') && $this->filled('title')) {
            $this->merge([
                'slug' => Str::slug($this->input('title')),
            ]);
        }
    }

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $project = $this->route('project');
        $isUpdating = $this->isMethod('put');
        $requiredOnCreate = $isUpdating ? 'sometimes' : 'required';
        $optionalOnUpdate = $isUpdating ? 'sometimes' : 'nullable';

        return [
            'project_category_id' => [$optionalOnUpdate, 'nullable', 'integer', Rule::exists('project_categories', 'id')],
            'title' => [$requiredOnCreate, 'string', 'max:255'],
            'slug' => [
                $requiredOnCreate,
                'string',
                'max:255',
                Rule::unique('projects', 'slug')->ignore($project?->id),
            ],
            'subtitle' => [$optionalOnUpdate, 'nullable', 'string', 'max:255'],
            'short_description' => [$optionalOnUpdate, 'nullable', 'string'],
            'description' => [$optionalOnUpdate, 'nullable', 'string'],
            'thumbnail_image' => [$optionalOnUpdate, 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:20480'],
            'hero_image' => [$optionalOnUpdate, 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:20480'],
            'gallery_images' => [$optionalOnUpdate, 'nullable', 'array'],
            'gallery_images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:20480'],
            'sort_order' => [$optionalOnUpdate, 'nullable', 'integer', 'min:0'],
            'is_active' => [$optionalOnUpdate, 'nullable', 'boolean'],
        ];
    }
}
