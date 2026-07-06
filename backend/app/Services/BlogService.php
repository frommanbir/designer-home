<?php

namespace App\Services;

use App\Models\Blog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Throwable;

class BlogService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {
    }

    public function listActiveBlogs(array $filters = []): Collection
    {
        return $this->orderedQuery()
            ->active()
            ->when($filters['search'] ?? null, function ($query, string $search) {
                $query->where('title', 'like', '%' . $search . '%');
            })
            ->get();
    }

    public function listBlogs(): Collection
    {
        return $this->orderedQuery()->get();
    }

    public function getActiveBlogBySlug(string $slug): Blog
    {
        return Blog::query()
            ->active()
            ->where('slug', $slug)
            ->firstOrFail();
    }

    public function createBlog(array $validated, array $files = []): Blog
    {
        $newPaths = [];

        try {
            $data = $this->prepareData($validated, $files, newPaths: $newPaths);

            return Blog::query()->create($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }
    }

    public function updateBlog(Blog $blog, array $validated, array $files = []): Blog
    {
        $newPaths = [];
        $oldPaths = [];

        try {
            $data = $this->prepareData($validated, $files, $blog, $newPaths, $oldPaths);

            $blog->update($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }

        $this->imageUploadService->deleteMany($oldPaths);
        $blog->refresh();

        return $blog;
    }

    public function deleteBlog(Blog $blog): void
    {
        $this->imageUploadService->delete($blog->image_path);

        $blog->delete();
    }

    private function orderedQuery()
    {
        return Blog::query()
            ->latest()
            ->orderBy('sort_order');
    }

    private function prepareData(
        array $validated,
        array $files = [],
        ?Blog $blog = null,
        array &$newPaths = [],
        array &$oldPaths = [],
    ): array {
        $data = Arr::except($validated, ['image']);

        if (isset($files['image'])) {
            $newPath = $this->imageUploadService->store($files['image'], 'blogs', 'blog');
            $newPaths[] = $newPath;

            if ($blog?->image_path) {
                $oldPaths[] = $blog->image_path;
            }

            $data['image_path'] = $newPath;
        }

        return $data;
    }
}
