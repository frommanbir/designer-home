<?php

namespace App\Services;

use App\Models\ProjectCategory;
use Illuminate\Database\Eloquent\Collection;
use Throwable;

class ProjectCategoryService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {
    }

    public function listCategories(): Collection
    {
        return ProjectCategory::query()
            ->orderBy('name')
            ->get();
    }

    public function createCategory(array $validated, array $files = []): ProjectCategory
    {
        $newPaths = [];

        try {
            if (isset($files['hero_image'])) {
                $newPath = $this->imageUploadService->store($files['hero_image'], 'project-categories', 'hero');
                $newPaths[] = $newPath;
                $validated['hero_image_path'] = $newPath;
            }

            return ProjectCategory::query()->create($validated);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }
    }

    public function updateCategory(ProjectCategory $projectCategory, array $validated, array $files = []): ProjectCategory
    {
        $newPaths = [];
        $oldPaths = [];

        try {
            if (isset($files['hero_image'])) {
                $newPath = $this->imageUploadService->store($files['hero_image'], 'project-categories', 'hero');
                $newPaths[] = $newPath;

                if ($projectCategory->hero_image_path) {
                    $oldPaths[] = $projectCategory->hero_image_path;
                }

                $validated['hero_image_path'] = $newPath;
            }

            $projectCategory->update($validated);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }

        $this->imageUploadService->deleteMany($oldPaths);
        $projectCategory->refresh();

        return $projectCategory;
    }

    public function deleteCategory(ProjectCategory $projectCategory): void
    {
        $projectCategory->delete();
    }
}
