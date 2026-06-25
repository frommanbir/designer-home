<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'hero_title' => $this->hero_title,
            'hero_image' => [
                'path' => $this->hero_image_path,
                'url' => $this->imageUrl($this->hero_image_path),
            ],
            'subtitle' => $this->subtitle,
            'description' => $this->description,
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? asset(\Illuminate\Support\Facades\Storage::disk('public')->url($path)) : null;
    }
}
