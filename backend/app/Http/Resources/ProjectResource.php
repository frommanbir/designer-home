<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'subtitle' => $this->subtitle,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'thumbnail_image_url' => $this->imageUrl($this->thumbnail_image_path),
            'hero_image_url' => $this->imageUrl($this->hero_image_path),
            'gallery_image_urls' => collect($this->gallery_images ?? [])
                ->map(fn (string $path): string => $this->imageUrl($path))
                ->values()
                ->all(),
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'category' => $this->category ? new ProjectCategoryResource($this->category) : null,
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? asset(Storage::disk('public')->url($path)) : null;
    }
}
