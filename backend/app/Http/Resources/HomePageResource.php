<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class HomePageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'hero_image' => [
                'path' => $this->hero_image_path,
                'url'  => $this->imageUrl($this->hero_image_path),
            ],
            'section2_title' => $this->section2_title,
            'section2_description_1' => $this->section2_description_1,
            'section2_description_2' => $this->section2_description_2,
            'section2_btn_inquiry_text' => $this->section2_btn_inquiry_text,
            'section2_btn_inquiry_link' => $this->section2_btn_inquiry_link,
            'section2_btn_projects_text' => $this->section2_btn_projects_text,
            'section2_btn_projects_link' => $this->section2_btn_projects_link,
            'section2_image' => [
                'path' => $this->section2_image_path,
                'url'  => $this->imageUrl($this->section2_image_path),
            ],
            
            'section3_title' => $this->section3_title,
            'section3_image' => [
                'path' => $this->section3_image_path,
                'url'  => $this->imageUrl($this->section3_image_path),
            ],
            'section3_stat1_value' => $this->section3_stat1_value,
            'section3_stat1_label' => $this->section3_stat1_label,
            'section3_stat2_value' => $this->section3_stat2_value,
            'section3_stat2_label' => $this->section3_stat2_label,
            'section3_stat3_value' => $this->section3_stat3_value,
            'section3_stat3_label' => $this->section3_stat3_label,
            'section3_btn_text' => $this->section3_btn_text,
            'section3_btn_link' => $this->section3_btn_link,
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? asset(Storage::disk('public')->url($path)) : null;
    }
}
