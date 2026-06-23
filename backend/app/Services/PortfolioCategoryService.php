<?php

namespace App\Services;

use App\Models\PortfolioCategory;
use Illuminate\Database\Eloquent\Collection;

class PortfolioCategoryService
{
    public function listCategories(): Collection
    {
        return PortfolioCategory::query()
            ->orderBy('name')
            ->get();
    }

    public function createCategory(array $validated): PortfolioCategory
    {
        return PortfolioCategory::query()->create($validated);
    }

    public function updateCategory(PortfolioCategory $portfolioCategory, array $validated): PortfolioCategory
    {
        $portfolioCategory->update($validated);
        $portfolioCategory->refresh();

        return $portfolioCategory;
    }

    public function deleteCategory(PortfolioCategory $portfolioCategory): void
    {
        $portfolioCategory->delete();
    }
}
