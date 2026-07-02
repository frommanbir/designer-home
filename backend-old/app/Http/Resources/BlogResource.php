<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class BlogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $imageUrl = $this->imageUrl($this->image_path);

        return [
            'id'                => $this->id,
            'title'             => $this->title,
            'slug'              => $this->slug,
            'short_description' => $this->short_description,
            'content'           => $this->content,
            // Both field names — image_url (original) and featured_image_url (expected by storefront)
            'image_url'         => $imageUrl,
            'featured_image_url' => $imageUrl,
            'published_date'    => $this->published_date?->toDateString(),
            'sort_order'        => $this->sort_order,
            'is_active'         => $this->is_active,
            'created_at'        => $this->created_at?->toISOString(),
            'updated_at'        => $this->updated_at?->toISOString(),
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? asset(Storage::disk('public')->url($path)) : null;
    }
}
