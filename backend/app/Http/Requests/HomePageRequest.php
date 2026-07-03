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
            'hero_image'                 => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:10240'],
            'section2_title'             => ['nullable', 'string', 'max:255'],
            'section2_description_1'     => ['nullable', 'string'],
            'section2_description_2'     => ['nullable', 'string'],
            'section2_btn_inquiry_text'  => ['nullable', 'string', 'max:255'],
            'section2_btn_inquiry_link'  => ['nullable', 'string', 'max:255'],
            'section2_btn_projects_text' => ['nullable', 'string', 'max:255'],
            'section2_btn_projects_link' => ['nullable', 'string', 'max:255'],
            'section2_image'             => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:10240'],
            
            'section3_title'             => ['nullable', 'string'],
            'section3_image'             => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp,svg', 'max:10240'],
            'section3_stat1_value'       => ['nullable', 'string', 'max:50'],
            'section3_stat1_label'       => ['nullable', 'string', 'max:255'],
            'section3_stat2_value'       => ['nullable', 'string', 'max:50'],
            'section3_stat2_label'       => ['nullable', 'string', 'max:255'],
            'section3_stat3_value'       => ['nullable', 'string', 'max:50'],
            'section3_stat3_label'       => ['nullable', 'string', 'max:255'],
            'section3_btn_text'          => ['nullable', 'string', 'max:255'],
            'section3_btn_link'          => ['nullable', 'string', 'max:255'],
        ];
    }
}
