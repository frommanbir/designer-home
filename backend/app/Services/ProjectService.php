<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Throwable;

class ProjectService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {
    }

    public function listPublicProjects(array $filters = []): Collection
    {
        return Project::query()
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

    public function listProjects(): Collection
    {
        return Project::query()
            ->with('category')
            ->latest()
            ->orderBy('sort_order')
            ->get();
    }

    public function findActiveBySlug(string $slug): Project
    {
        return Project::query()
            ->with('category')
            ->active()
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function createProject(array $validated, array $files = []): Project
    {
        $newPaths = [];

        try {
            $data = $this->prepareData($validated, $files, newPaths: $newPaths);

            return Project::query()
                ->create($data)
                ->load('category');
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }
    }

    public function updateProject(Project $project, array $validated, array $files = []): Project
    {
        $newPaths = [];
        $oldPaths = [];

        try {
            $data = $this->prepareData($validated, $files, $project, $newPaths, $oldPaths);

            $project->update($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }

        $this->imageUploadService->deleteMany($oldPaths);
        $project->refresh();

        return $project->load('category');
    }

    public function deleteProject(Project $project): void
    {
        $this->deleteProjectImages($project);
        $project->delete();
    }

    private function prepareData(
        array $validated,
        array $files = [],
        ?Project $project = null,
        array &$newPaths = [],
        array &$oldPaths = [],
    ): array {
        $data = Arr::except($validated, [
            'gallery_images',
        ]);

        if (isset($files['gallery_images'])) {
            $oldPaths = array_merge($oldPaths, $project?->gallery_images ?? []);

            $data['gallery_images'] = $this->imageUploadService->storeMany(
                $files['gallery_images'],
                'projects/gallery',
                'project',
            );
            $newPaths = array_merge($newPaths, $data['gallery_images']);
        }

        return $data;
    }

    private function deleteProjectImages(Project $project): void
    {
        $this->imageUploadService->deleteMany($project->gallery_images ?? []);
    }
}
