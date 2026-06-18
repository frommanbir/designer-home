<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class PortfolioRequest extends FormRequest
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
        $portfolio = $this->route('portfolio');
        $isUpdating = $this->isMethod('put');
        $requiredOnCreate = $isUpdating ? 'sometimes' : 'required';
        $optionalOnUpdate = $isUpdating ? 'sometimes' : 'nullable';

        return [
            'portfolio_category_id' => [$optionalOnUpdate, 'nullable', 'integer', Rule::exists('portfolio_categories', 'id')],
            'title' => [$requiredOnCreate, 'string', 'max:255'],
            'slug' => [
                $requiredOnCreate,
                'string',
                'max:255',
                Rule::unique('portfolios', 'slug')->ignore($portfolio?->id),
            ],
            'short_description' => [$optionalOnUpdate, 'nullable', 'string'],
            'description' => [$optionalOnUpdate, 'nullable', 'string'],
            'main_image' => [$optionalOnUpdate, 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:20480'],
            'gallery_images' => [$optionalOnUpdate, 'nullable', 'array'],
            'gallery_images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:20480'],
            'sort_order' => [$optionalOnUpdate, 'nullable', 'integer', 'min:0'],
            'is_active' => [$optionalOnUpdate, 'nullable', 'boolean'],
            'is_featured' => [$optionalOnUpdate, 'nullable', 'boolean'],
        ];
    }
}
