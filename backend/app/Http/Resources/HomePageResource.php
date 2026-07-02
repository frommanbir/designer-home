<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class HomePageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $homePage = $this->resource;

        return [
            'hero_image_url' => $this->imageUrl($homePage?->hero_image_path),
            'intro_title' => $homePage?->intro_title,
            'intro_description' => $homePage?->intro_description,
            'intro_extra_text' => $homePage?->intro_extra_text,
            'intro_image_url' => $this->imageUrl($homePage?->intro_image_path),
            'inquiry_button_text' => $homePage?->inquiry_button_text,
            'inquiry_button_link' => $homePage?->inquiry_button_link,
            'projects_button_text' => $homePage?->projects_button_text,
            'projects_button_link' => $homePage?->projects_button_link,
            'stats_image_url' => $this->imageUrl($homePage?->stats_image_path),
            'stats_title' => $homePage?->stats_title,
            'stats_description' => $homePage?->stats_description,
            'expert_count' => $homePage?->expert_count,
            'expert_label' => $homePage?->expert_label,
            'project_count' => $homePage?->project_count,
            'project_label' => $homePage?->project_label,
            'rating_value' => $homePage?->rating_value !== null ? (float) $homePage->rating_value : null,
            'rating_label' => $homePage?->rating_label,
            'learn_more_button_text' => $homePage?->learn_more_button_text,
            'learn_more_button_link' => $homePage?->learn_more_button_link,
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? asset(Storage::disk('public')->url($path)) : null;
    }
}
