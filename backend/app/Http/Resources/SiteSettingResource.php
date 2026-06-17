<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SiteSettingResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'branding' => [
                'logo' => [
                    'path' => $this->logo_path,
                    'url' => $this->imageUrl($this->logo_path),
                ],
                'favicon' => [
                    'path' => $this->favicon_path,
                    'url' => $this->imageUrl($this->favicon_path),
                ],
                'website_title' => $this->website_title,
                'website_slogan' => $this->website_slogan,
            ],

            'about' => [
                'about_us' => $this->about_us,
            ],

            'contact_details' => [
                'primary_phone' => $this->primary_phone,
                'secondary_phone' => $this->secondary_phone,
                'email_address' => $this->email_address,
                'physical_address' => $this->physical_address,
                'google_maps_embed' => $this->google_maps_embed,
            ],

            'social_media' => [
                'facebook' => [
                    'title' => $this->facebook_title,
                    'url' => $this->facebook_url,
                    'icon' => [
                        'path' => $this->facebook_icon_path,
                        'url' => $this->imageUrl($this->facebook_icon_path),
                    ],
                ],

                'x' => [
                    'title' => $this->twitter_title,
                    'url' => $this->twitter_url,
                    'icon' => [
                        'path' => $this->twitter_icon_path,
                        'url' => $this->imageUrl($this->twitter_icon_path),
                    ],
                ],

                'instagram' => [
                    'title' => $this->instagram_title,
                    'url' => $this->instagram_url,
                    'icon' => [
                        'path' => $this->instagram_icon_path,
                        'url' => $this->imageUrl($this->instagram_icon_path),
                    ],
                ],
            ],
        ];
    }

    private function imageUrl(?string $path): ?string
    {
        return $path ? asset(Storage::disk('public')->url($path)) : null;
    }
}
