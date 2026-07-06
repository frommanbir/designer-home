<?php

namespace App\Services;

use App\Models\Portfolio;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Throwable;

class PortfolioService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {
    }

    public function listPublicPortfolios(array $filters = []): Collection
    {
        return Portfolio::query()
            ->with('category')
            ->active()
            ->when($filters['category'] ?? null, function ($query, string $category): void {
                $query->whereHas('category', function ($query) use ($category): void {
                    $query->where('slug', $category);
                });
            })
            ->when($filters['search'] ?? null, function ($query, string $search): void {
                $query->where('title', 'like', "%{$search}%");
            })
            ->latest()
            ->orderBy('sort_order')
            ->get();
    }

    public function listPortfolios(): Collection
    {
        return Portfolio::query()
            ->with('category')
            ->latest()
            ->orderBy('sort_order')
            ->get();
    }

    public function findActiveBySlug(string $slug): Portfolio
    {
        return Portfolio::query()
            ->with('category')
            ->active()
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function createPortfolio(array $validated, array $files = []): Portfolio
    {
        $newPaths = [];

        try {
            $data = $this->prepareData($validated, $files, newPaths: $newPaths);

            return Portfolio::query()
                ->create($data)
                ->load('category');
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }
    }

    public function updatePortfolio(Portfolio $portfolio, array $validated, array $files = []): Portfolio
    {
        $newPaths = [];
        $oldPaths = [];

        try {
            $data = $this->prepareData($validated, $files, $portfolio, $newPaths, $oldPaths);

            $portfolio->update($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }

        $this->imageUploadService->deleteMany($oldPaths);
        $portfolio->refresh();

        return $portfolio->load('category');
    }

    public function deletePortfolio(Portfolio $portfolio): void
    {
        $this->deletePortfolioImages($portfolio);
        $portfolio->delete();
    }

    private function prepareData(
        array $validated,
        array $files = [],
        ?Portfolio $portfolio = null,
        array &$newPaths = [],
        array &$oldPaths = [],
    ): array {
        $data = Arr::except($validated, [
            'main_image',
            'gallery_images',
        ]);

        if (isset($files['main_image'])) {
            $newPath = $this->imageUploadService->store($files['main_image'], 'portfolios', 'portfolio');
            $newPaths[] = $newPath;

            if ($portfolio?->main_image_path) {
                $oldPaths[] = $portfolio->main_image_path;
            }

            $data['main_image_path'] = $newPath;
        }

        if (isset($files['gallery_images'])) {
            $oldPaths = array_merge($oldPaths, $portfolio?->gallery_images ?? []);

            $data['gallery_images'] = $this->imageUploadService->storeMany(
                $files['gallery_images'],
                'portfolios/gallery',
                'gallery',
            );
            $newPaths = array_merge($newPaths, $data['gallery_images']);
        }

        return $data;
    }

    private function deletePortfolioImages(Portfolio $portfolio): void
    {
        $this->imageUploadService->deleteMany([
            $portfolio->main_image_path,
        ]);

        $this->imageUploadService->deleteMany($portfolio->gallery_images ?? []);
    }
}
