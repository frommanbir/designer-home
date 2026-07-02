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
            'why_choose',
            'gallery_images',
        ]);

        $data['slug'] = $this->slugFrom($validated['slug'] ?? $validated['title']);

        if (! $service) {
            $data['sort_order'] = $data['sort_order'] ?? 0;
            $data['is_active'] = $data['is_active'] ?? true;
        }

        // Standard image fields
        $imageFields = [
            'thumbnail_image' => 'thumbnail_image_path',
            'hero_image' => 'hero_image_path',
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

        // Multi-block why_choose processing
        if (isset($validated['why_choose']) && is_array($validated['why_choose'])) {
            $whyChooseData = [];
            $existingWhyChoose = $service?->why_choose ?? [];

            foreach ($validated['why_choose'] as $index => $block) {
                $blockData = [
                    'title' => $block['title'] ?? '',
                    'description' => $block['description'] ?? '',
                    'points' => $block['points'] ?? [],
                    'image' => null,
                ];

                // Check if a new file was uploaded for this block
                if (isset($files['why_choose'][$index]['image'])) {
                    $imagePath = $files['why_choose'][$index]['image']->store('services/why-choose', 'public');
                    $blockData['image'] = [
                        'url' => Storage::url($imagePath),
                        'path' => $imagePath,
                    ];
                } 
                // Keep existing image if no new one provided
                elseif (!empty($existingWhyChoose[$index]['image'])) {
                    $blockData['image'] = $existingWhyChoose[$index]['image'];
                }

                $whyChooseData[] = $blockData;
            }

            $data['why_choose'] = $whyChooseData;
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

    private function slugFrom(string $value): string
    {
        $slug = Str::slug($value);

        return $slug !== '' ? $slug : Str::random(8);
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

        // Delete images in multi-block why_choose
        foreach ($service->why_choose ?? [] as $block) {
            if (!empty($block['image']['path'])) {
                Storage::disk('public')->delete($block['image']['path']);
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
