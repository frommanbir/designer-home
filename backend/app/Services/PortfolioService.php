<?php

namespace App\Services;

use App\Models\Portfolio;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class PortfolioService
{
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
            ->orderBy('sort_order')
            ->latest()
            ->get();
    }

    public function listPortfolios(): Collection
    {
        return Portfolio::query()
            ->with('category')
            ->orderBy('sort_order')
            ->latest()
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
        $data = $this->prepareData($validated, $files);

        return Portfolio::query()
            ->create($data)
            ->load('category');
    }

    public function updatePortfolio(Portfolio $portfolio, array $validated, array $files = []): Portfolio
    {
        $data = $this->prepareData($validated, $files, $portfolio);

        $portfolio->update($data);
        $portfolio->refresh();

        return $portfolio->load('category');
    }

    public function deletePortfolio(Portfolio $portfolio): void
    {
        $this->deletePortfolioImages($portfolio);
        $portfolio->delete();
    }

    private function prepareData(array $validated, array $files = [], ?Portfolio $portfolio = null): array
    {
        $data = Arr::except($validated, [
            'main_image',
            'gallery_images',
        ]);

        if (isset($files['main_image'])) {
            $newPath = $files['main_image']->store('portfolios', 'public');

            if ($portfolio?->main_image_path) {
                Storage::disk('public')->delete($portfolio->main_image_path);
            }

            $data['main_image_path'] = $newPath;
        }

        if (isset($files['gallery_images'])) {
            $this->deleteImages($portfolio?->gallery_images ?? []);

            $data['gallery_images'] = collect($files['gallery_images'])
                ->map(fn ($image): string => $image->store('portfolios/gallery', 'public'))
                ->values()
                ->all();
        }

        return $data;
    }

    private function deletePortfolioImages(Portfolio $portfolio): void
    {
        $this->deleteImages([
            $portfolio->main_image_path,
        ]);

        $this->deleteImages($portfolio->gallery_images ?? []);
    }

    private function deleteImages(array $paths): void
    {
        collect($paths)
            ->filter()
            ->each(function (string $path): void {
                Storage::disk('public')->delete($path);
            });
    }
}
