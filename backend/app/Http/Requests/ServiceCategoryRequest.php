<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ServiceCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $slugSource = $this->filled('slug')
            ? $this->input('slug')
            : $this->input('name');

        $slug = Str::slug((string) $slugSource);

        if ($slug !== '') {
            $this->merge([
                'slug' => $slug,
            ]);
        }
    }

    public function rules(): array
    {
        $serviceCategory = $this->route('serviceCategory');

        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('service_categories', 'slug')->ignore($serviceCategory?->id),
            ],
        ];
    }
}
