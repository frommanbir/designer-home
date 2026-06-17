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
        $validated['slug'] = $this->uniqueSlug($validated['slug'] ?? $validated['name']);

        return ServiceCategory::query()->create($validated);
    }

    public function updateCategory(ServiceCategory $serviceCategory, array $validated): ServiceCategory
    {
        $validated['slug'] = $this->uniqueSlug(
            $validated['slug'] ?? $validated['name'],
            $serviceCategory
        );

        $serviceCategory->update($validated);
        $serviceCategory->refresh();

        return $serviceCategory;
    }

    public function deleteCategory(ServiceCategory $serviceCategory): void
    {
        $serviceCategory->delete();
    }

    private function uniqueSlug(string $value, ?ServiceCategory $serviceCategory = null): string
    {
        $slug = Str::slug($value);
        $slug = $slug !== '' ? $slug : Str::random(8);
        $baseSlug = $slug;
        $counter = 1;

        while (
            ServiceCategory::query()
                ->where('slug', $slug)
                ->when($serviceCategory, fn ($query) => $query->where('id', '!=', $serviceCategory->id))
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
