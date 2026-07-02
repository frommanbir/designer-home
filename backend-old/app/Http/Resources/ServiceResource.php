<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category ? new ServiceCategoryResource($this->category) : null,
            'title' => $this->title,
            'slug' => $this->slug,
            'subtitle' => $this->subtitle,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'thumbnail_image' => [
                'path' => $this->thumbnail_image_path,
                'url' => $this->imageUrl($this->thumbnail_image_path),
            ],
            'hero_image' => [
                'path' => $this->hero_image_path,
                'url' => $this->imageUrl($this->hero_image_path),
            ],
            'gallery_images' => $this->galleryImages(),
            'why_choose' => $this->whyChooseData(),
            'sort_order' => $this->sort_order,
            'is_active' => $this->is_active,
        ];
    }

    private function whyChooseData(): array
    {
        if (is_array($this->why_choose)) {
            return collect($this->why_choose)->map(function ($block) {
                if (isset($block['image']['path'])) {
                    $block['image']['url'] = $this->imageUrl($block['image']['path']);
                }
                return $block;
            })->all();
        }

        return [
            'title' => $this->why_choose_title,
            'description' => $this->why_choose_description,
            'image' => [
                'path' => $this->why_choose_image_path,
                'url' => $this->imageUrl($this->why_choose_image_path),
            ],
            'points' => $this->why_choose_points ?? [],
        ];
    }

    private function galleryImages(): array
    {
        return collect($this->gallery_images ?? [])
            ->map(fn (string $path): array => [
                'path' => $path,
                'url' => $this->imageUrl($path),
            ])
            ->values()
            ->all();
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? asset(Storage::disk('public')->url($path)) : null;
    }
}
