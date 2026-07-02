<?php

namespace App\Services;

use App\Models\AboutFeature;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class AboutFeatureService
{
    public function listFeatures(): Collection
    {
        return AboutFeature::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    public function listActiveFeatures(): Collection
    {
        return AboutFeature::query()
            ->active()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();
    }

    public function createFeature(array $validated, array $files = []): AboutFeature
    {
        $data = $this->prepareData($validated, $files);

        return AboutFeature::query()->create($data);
    }

    public function updateFeature(AboutFeature $aboutFeature, array $validated, array $files = []): AboutFeature
    {
        $data = $this->prepareData($validated, $files, $aboutFeature);

        $aboutFeature->update($data);
        $aboutFeature->refresh();

        return $aboutFeature;
    }

    public function deleteFeature(AboutFeature $aboutFeature): void
    {
        if ($aboutFeature->icon_path) {
            Storage::disk('public')->delete($aboutFeature->icon_path);
        }

        $aboutFeature->delete();
    }

    private function prepareData(array $validated, array $files = [], ?AboutFeature $aboutFeature = null): array
    {
        $data = Arr::except($validated, ['icon']);

        if (isset($files['icon'])) {
            $newPath = $files['icon']->store('about-features', 'public');

            if ($aboutFeature?->icon_path) {
                Storage::disk('public')->delete($aboutFeature->icon_path);
            }

            $data['icon_path'] = $newPath;
        }

        return $data;
    }
}
