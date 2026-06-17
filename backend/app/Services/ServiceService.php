<?php

namespace App\Services;

use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ServiceService
{
    public function listServices(?string $categorySlug = null, bool $activeOnly = false): Collection
    {
        return $this->serviceQuery($categorySlug, $activeOnly)->get();
    }

    public function findActiveBySlug(string $slug): Service
    {
        return $this->serviceQuery(activeOnly: true)
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function createService(array $validated, array $files = []): Service
    {
        $data = $this->prepareData($validated, $files);

        return Service::query()
            ->create($data)
            ->load('category');
    }

    public function updateService(Service $service, array $validated, array $files = []): Service
    {
        $data = $this->prepareData($validated, $files, $service);

        $service->update($data);
        $service->refresh();

        return $service->load('category');
    }

    public function deleteService(Service $service): void
    {
        $this->deleteServiceImages($service);

        $service->delete();
    }

    private function serviceQuery(?string $categorySlug = null, bool $activeOnly = false): Builder
    {
        return Service::query()
            ->with('category')
            ->when($activeOnly, fn (Builder $query) => $query->active())
            ->when($categorySlug, function (Builder $query) use ($categorySlug) {
                $query->whereHas('category', fn (Builder $categoryQuery) => $categoryQuery->where('slug', $categorySlug));
            })
            ->orderBy('sort_order')
            ->orderBy('id');
    }

    private function prepareData(array $validated, array $files = [], ?Service $service = null): array
    {
        $data = Arr::except($validated, [
            'thumbnail_image',
            'hero_image',
            'why_choose_image',
            'gallery_images',
        ]);

        $data['slug'] = $this->uniqueSlug($validated['slug'] ?? $validated['title'], $service);

        if (! $service) {
            $data['sort_order'] = $data['sort_order'] ?? 0;
            $data['is_active'] = $data['is_active'] ?? true;
        }

        $imageFields = [
            'thumbnail_image' => 'thumbnail_image_path',
            'hero_image' => 'hero_image_path',
            'why_choose_image' => 'why_choose_image_path',
        ];

        foreach ($imageFields as $requestField => $databaseColumn) {
            if (isset($files[$requestField])) {
                $newPath = $files[$requestField]->store('services', 'public');

                if ($service?->$databaseColumn) {
                    Storage::disk('public')->delete($service->$databaseColumn);
                }

                $data[$databaseColumn] = $newPath;
            }
        }

        if (isset($files['gallery_images'])) {
            $newGalleryImages = collect($files['gallery_images'])
                ->map(fn ($image): string => $image->store('services/gallery', 'public'))
                ->values()
                ->all();

            $this->deleteGalleryImages($service);

            $data['gallery_images'] = $newGalleryImages;
        }

        return $data;
    }

    private function uniqueSlug(string $value, ?Service $service = null): string
    {
        $slug = Str::slug($value);
        $slug = $slug !== '' ? $slug : Str::random(8);
        $baseSlug = $slug;
        $counter = 1;

        while (
            Service::query()
                ->where('slug', $slug)
                ->when($service, fn ($query) => $query->where('id', '!=', $service->id))
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    private function deleteServiceImages(Service $service): void
    {
        foreach ([
            $service->thumbnail_image_path,
            $service->hero_image_path,
            $service->why_choose_image_path,
        ] as $path) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }
        }

        $this->deleteGalleryImages($service);
    }

    private function deleteGalleryImages(?Service $service): void
    {
        foreach ($service?->gallery_images ?? [] as $path) {
            Storage::disk('public')->delete($path);
        }
    }
}
