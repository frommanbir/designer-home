<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ContactPageResource extends JsonResource
{
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
            'contact_info' => [
                'address' => [
                    'title' => $this->address_title,
                    'description' => $this->address_description,
                ],
                'phone' => [
                    'title' => $this->phone_title,
                    'description' => $this->phone_description,
                ],
                'email' => [
                    'title' => $this->email_title,
                    'description' => $this->email_description,
                ],
            ],
            'form' => [
                'title' => $this->form_title,
                'description' => $this->form_description,
            ],
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? asset(Storage::disk('public')->url($path)) : null;
    }
}
