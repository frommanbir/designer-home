<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PortfolioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'main_image_url' => $this->imageUrl($this->main_image_path),
            'gallery_image_urls' => collect($this->gallery_images ?? [])
                ->map(fn (string $path): string => $this->imageUrl($path))
                ->values()
                ->all(),
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
            'category' => $this->category ? new PortfolioCategoryResource($this->category) : null,
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? asset(Storage::disk('public')->url($path)) : null;
    }
}
