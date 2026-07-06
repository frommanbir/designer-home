<?php

namespace App\Services;

use App\Http\Requests\SiteSettingRequest;
use App\Models\SiteSetting;
use Illuminate\Support\Arr;
use Throwable;

class SiteSettingService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {
    }

    public function getSettings(): SiteSetting
    {
        return SiteSetting::query()->first() ?? SiteSetting::query()->create([]);
    }

    public function updateSettings(SiteSettingRequest $request): SiteSetting
    {
        $settings = $this->getSettings();

        $validated = $request->validated();

        $fileFields = [
            'logo' => ['column' => 'logo_path', 'profile' => 'logo'],
            'favicon' => ['column' => 'favicon_path', 'profile' => 'icon'],
            'facebook_icon' => ['column' => 'facebook_icon_path', 'profile' => 'icon'],
            'twitter_icon' => ['column' => 'twitter_icon_path', 'profile' => 'icon'],
            'instagram_icon' => ['column' => 'instagram_icon_path', 'profile' => 'icon'],
            'contact_hero' => ['column' => 'contact_hero_image_path', 'profile' => 'hero'],
        ];

        $data = Arr::except($validated, array_keys($fileFields));
        $newPaths = [];
        $oldPaths = [];

        try {
            foreach ($fileFields as $requestField => $settingsMap) {
                if ($request->hasFile($requestField)) {
                    $databaseColumn = $settingsMap['column'];
                    $newPath = $this->imageUploadService->store(
                        $request->file($requestField),
                        'site-settings',
                        $settingsMap['profile'],
                    );
                    $newPaths[] = $newPath;

                    if ($settings->$databaseColumn) {
                        $oldPaths[] = $settings->$databaseColumn;
                    }

                    $data[$databaseColumn] = $newPath;
                }
            }

            $settings->update($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }

        $this->imageUploadService->deleteMany($oldPaths);

        return $settings->fresh();
    }
}
