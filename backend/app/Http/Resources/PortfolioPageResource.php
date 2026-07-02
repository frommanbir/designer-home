<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PortfolioPageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'hero' => [
                'title' => $this->hero_title,
                'image' => [
                    'path' => $this->hero_image_path,
                    'url'  => $this->imageUrl($this->hero_image_path),
                ],
            ],
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? asset(Storage::disk('public')->url($path)) : null;
    }
}
