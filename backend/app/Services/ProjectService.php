<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class ProjectService
{
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
            ->orderBy('sort_order')
            ->latest()
            ->get();
    }

    public function listProjects(): Collection
    {
        return Project::query()
            ->with('category')
            ->orderBy('sort_order')
            ->latest()
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
        $data = $this->prepareData($validated, $files);

        return Project::query()
            ->create($data)
            ->load('category');
    }

    public function updateProject(Project $project, array $validated, array $files = []): Project
    {
        $data = $this->prepareData($validated, $files, $project);

        $project->update($data);
        $project->refresh();

        return $project->load('category');
    }

    public function deleteProject(Project $project): void
    {
        $this->deleteProjectImages($project);
        $project->delete();
    }

    private function prepareData(array $validated, array $files = [], ?Project $project = null): array
    {
        $data = Arr::except($validated, [
            'gallery_images',
        ]);

        if (isset($files['gallery_images'])) {
            $this->deleteImages($project?->gallery_images ?? []);

            $data['gallery_images'] = collect($files['gallery_images'])
                ->map(fn ($image): string => $image->store('projects/gallery', 'public'))
                ->values()
                ->all();
        }

        return $data;
    }

    private function deleteProjectImages(Project $project): void
    {
        $this->deleteImages($project->gallery_images ?? []);
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
