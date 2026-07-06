<?php

namespace App\Services;

use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class ServiceService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {
    }

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
        $newPaths = [];

        try {
            $data = $this->prepareData($validated, $files, newPaths: $newPaths);

            return Service::query()
                ->create($data)
                ->load('category');
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }
    }

    public function updateService(Service $service, array $validated, array $files = []): Service
    {
        $newPaths = [];
        $oldPaths = [];

        try {
            $data = $this->prepareData($validated, $files, $service, $newPaths, $oldPaths);

            $service->update($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }

        $this->imageUploadService->deleteMany($oldPaths);
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
            ->latest()
            ->orderBy('sort_order');
    }

    private function prepareData(
        array $validated,
        array $files = [],
        ?Service $service = null,
        array &$newPaths = [],
        array &$oldPaths = [],
    ): array {
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
            'thumbnail_image' => ['column' => 'thumbnail_image_path', 'profile' => 'card'],
            'hero_image' => ['column' => 'hero_image_path', 'profile' => 'hero'],
        ];

        foreach ($imageFields as $requestField => $settings) {
            if (isset($files[$requestField])) {
                $databaseColumn = $settings['column'];
                $newPath = $this->imageUploadService->store($files[$requestField], 'services', $settings['profile']);
                $newPaths[] = $newPath;

                if ($service?->$databaseColumn) {
                    $oldPaths[] = $service->$databaseColumn;
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
                    $imagePath = $this->imageUploadService->store(
                        $files['why_choose'][$index]['image'],
                        'services/why-choose',
                        'card',
                    );
                    $newPaths[] = $imagePath;
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

            $keptWhyChoosePaths = collect($whyChooseData)
                ->pluck('image.path')
                ->filter()
                ->all();

            foreach ($existingWhyChoose as $block) {
                $oldPath = $block['image']['path'] ?? null;

                if ($oldPath && ! in_array($oldPath, $keptWhyChoosePaths, true)) {
                    $oldPaths[] = $oldPath;
                }
            }
        }

        if (isset($files['gallery_images'])) {
            $newGalleryImages = $this->imageUploadService->storeMany(
                $files['gallery_images'],
                'services/gallery',
                'gallery',
            );
            $newPaths = array_merge($newPaths, $newGalleryImages);
            $oldPaths = array_merge($oldPaths, $service?->gallery_images ?? []);

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
            $this->imageUploadService->delete($path);
        }

        // Delete images in multi-block why_choose
        foreach ($service->why_choose ?? [] as $block) {
            if (!empty($block['image']['path'])) {
                $this->imageUploadService->delete($block['image']['path']);
            }
        }

        $this->deleteGalleryImages($service);
    }

    private function deleteGalleryImages(?Service $service): void
    {
        $this->imageUploadService->deleteMany($service?->gallery_images ?? []);
    }
}
