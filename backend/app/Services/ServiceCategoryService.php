<?php

namespace App\Services;

use App\Models\ServiceCategory;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class ServiceCategoryService
{
    public function listCategories(): Collection
    {
        return ServiceCategory::query()
            ->orderBy('name')
            ->get();
    }

    public function createCategory(array $validated): ServiceCategory
    {
        $validated['slug'] = $this->slugFrom($validated['slug'] ?? $validated['name']);

        return ServiceCategory::query()->create($validated);
    }

    public function updateCategory(ServiceCategory $serviceCategory, array $validated): ServiceCategory
    {
        $validated['slug'] = $this->slugFrom(
            $validated['slug'] ?? $validated['name'],
        );

        $serviceCategory->update($validated);
        $serviceCategory->refresh();

        return $serviceCategory;
    }

    public function deleteCategory(ServiceCategory $serviceCategory): void
    {
        $serviceCategory->delete();
    }

    private function slugFrom(string $value): string
    {
        $slug = Str::slug($value);

        return $slug !== '' ? $slug : Str::random(8);
    }
}
