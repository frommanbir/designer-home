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
            'stats_image_url' => $this->imageUrl($homePage?->stats_image_path),
            'stats_title' => $homePage?->stats_title,
            'stats_description' => $homePage?->stats_description,
            'expert_count' => $homePage?->expert_count,
            'project_count' => $homePage?->project_count,
            'rating_value' => $homePage?->rating_value !== null ? (float) $homePage->rating_value : null,
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? asset(Storage::disk('public')->url($path)) : null;
    }
}
