<?php

namespace App\Services;

use App\Http\Requests\SiteSettingRequest;
use App\Models\SiteSetting;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class SiteSettingService
{
    public function getSettings(): SiteSetting
    {
        return SiteSetting::query()->first() ?? SiteSetting::query()->create([]);
    }

    public function updateSettings(SiteSettingRequest $request): SiteSetting
    {
        $settings = $this->getSettings();

        $validated = $request->validated();

        $fileFields = [
            'logo' => 'logo_path',
            'favicon' => 'favicon_path',
            'facebook_icon' => 'facebook_icon_path',
            'twitter_icon' => 'twitter_icon_path',
            'instagram_icon' => 'instagram_icon_path',
        ];

        $data = Arr::except($validated, array_keys($fileFields));

        foreach ($fileFields as $requestField => $databaseColumn) {
            if ($request->hasFile($requestField)) {
                if ($settings->$databaseColumn) {
                    Storage::disk('public')->delete($settings->$databaseColumn);
                }

                $data[$databaseColumn] = $request
                    ->file($requestField)
                    ->store('site-settings', 'public');
            }
        }

        $settings->update($data);

        return $settings->fresh();
    }
}
