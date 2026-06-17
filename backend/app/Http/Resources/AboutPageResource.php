<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AboutPageResource extends JsonResource
{
    public function __construct($resource, private readonly mixed $features = [])
    {
        parent::__construct($resource);
    }

    public function toArray(Request $request): array
    {
        return [
            'hero' => [
                'title' => $this->hero_title,
                'image' => [
                    'path' => $this->hero_image_path,
                    'url' => $this->imageUrl($this->hero_image_path),
                ],
            ],
            'welcome' => [
                'title' => $this->welcome_title,
                'description' => $this->welcome_description,
            ],
            'main_about' => [
                'title' => $this->main_title,
                'description' => $this->main_description,
                'image' => [
                    'path' => $this->main_image_path,
                    'url' => $this->imageUrl($this->main_image_path),
                ],
            ],
            'why_choose_us' => [
                'title' => $this->why_choose_title,
                'description' => $this->why_choose_description,
                'features' => AboutFeatureResource::collection($this->features)->resolve($request),
            ],
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? asset(Storage::disk('public')->url($path)) : null;
    }
}
