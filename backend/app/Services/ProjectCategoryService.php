<?php

namespace App\Services;

use App\Models\ProjectCategory;
use Illuminate\Database\Eloquent\Collection;

class ProjectCategoryService
{
    public function listCategories(): Collection
    {
        return ProjectCategory::query()
            ->orderBy('name')
            ->get();
    }

    public function createCategory(array $validated): ProjectCategory
    {
        return ProjectCategory::query()->create($validated);
    }

    public function updateCategory(ProjectCategory $projectCategory, array $validated): ProjectCategory
    {
        $projectCategory->update($validated);
        $projectCategory->refresh();

        return $projectCategory;
    }

    public function deleteCategory(ProjectCategory $projectCategory): void
    {
        $projectCategory->delete();
    }
}
