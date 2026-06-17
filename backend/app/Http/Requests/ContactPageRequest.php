<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactPageRequest extends FormRequest
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
            'address_title' => ['nullable', 'string', 'max:255'],
            'address_description' => ['nullable', 'string'],
            'phone_title' => ['nullable', 'string', 'max:255'],
            'phone_description' => ['nullable', 'string'],
            'email_title' => ['nullable', 'string', 'max:255'],
            'email_description' => ['nullable', 'string'],
            'form_title' => ['nullable', 'string', 'max:255'],
            'form_description' => ['nullable', 'string'],
        ];
    }
}
