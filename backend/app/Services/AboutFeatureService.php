<?php

namespace App\Services;

use App\Models\AboutFeature;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Throwable;

class AboutFeatureService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {
    }

    public function listFeatures(): Collection
    {
        return AboutFeature::query()
            ->latest()
            ->orderBy('sort_order')
            ->get();
    }

    public function listActiveFeatures(): Collection
    {
        return AboutFeature::query()
            ->active()
            ->latest()
            ->orderBy('sort_order')
            ->get();
    }

    public function createFeature(array $validated, array $files = []): AboutFeature
    {
        $newPaths = [];

        try {
            $data = $this->prepareData($validated, $files, newPaths: $newPaths);

            return AboutFeature::query()->create($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }
    }

    public function updateFeature(AboutFeature $aboutFeature, array $validated, array $files = []): AboutFeature
    {
        $newPaths = [];
        $oldPaths = [];

        try {
            $data = $this->prepareData($validated, $files, $aboutFeature, $newPaths, $oldPaths);

            $aboutFeature->update($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }

        $this->imageUploadService->deleteMany($oldPaths);
        $aboutFeature->refresh();

        return $aboutFeature;
    }

    public function deleteFeature(AboutFeature $aboutFeature): void
    {
        $this->imageUploadService->delete($aboutFeature->icon_path);

        $aboutFeature->delete();
    }

    private function prepareData(
        array $validated,
        array $files = [],
        ?AboutFeature $aboutFeature = null,
        array &$newPaths = [],
        array &$oldPaths = [],
    ): array {
        $data = Arr::except($validated, ['icon']);

        if (isset($files['icon'])) {
            $newPath = $this->imageUploadService->store($files['icon'], 'about-features', 'icon');
            $newPaths[] = $newPath;

            if ($aboutFeature?->icon_path) {
                $oldPaths[] = $aboutFeature->icon_path;
            }

            $data['icon_path'] = $newPath;
        }

        return $data;
    }
}
