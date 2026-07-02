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

    public function createCategory(array $validated, array $files = []): ProjectCategory
    {
        if (isset($files['hero_image'])) {
            $validated['hero_image_path'] = $files['hero_image']->store('project-categories', 'public');
        }

        return ProjectCategory::query()->create($validated);
    }

    public function updateCategory(ProjectCategory $projectCategory, array $validated, array $files = []): ProjectCategory
    {
        if (isset($files['hero_image'])) {
            if ($projectCategory->hero_image_path) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($projectCategory->hero_image_path);
            }
            $validated['hero_image_path'] = $files['hero_image']->store('project-categories', 'public');
        }

        $projectCategory->update($validated);
        $projectCategory->refresh();

        return $projectCategory;
    }

    public function deleteCategory(ProjectCategory $projectCategory): void
    {
        $projectCategory->delete();
    }
}
