<?php

namespace App\Services;

use App\Models\Blog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class BlogService
{
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
        $data = $this->prepareData($validated, $files);

        return Blog::query()->create($data);
    }

    public function updateBlog(Blog $blog, array $validated, array $files = []): Blog
    {
        $data = $this->prepareData($validated, $files, $blog);

        $blog->update($data);
        $blog->refresh();

        return $blog;
    }

    public function deleteBlog(Blog $blog): void
    {
        if ($blog->image_path) {
            Storage::disk('public')->delete($blog->image_path);
        }

        $blog->delete();
    }

    private function orderedQuery()
    {
        return Blog::query()
            ->orderBy('sort_order')
            ->latest();
    }

    private function prepareData(array $validated, array $files = [], ?Blog $blog = null): array
    {
        $data = Arr::except($validated, ['image']);

        if (isset($files['image'])) {
            $newPath = $files['image']->store('blogs', 'public');

            if ($blog?->image_path) {
                Storage::disk('public')->delete($blog->image_path);
            }

            $data['image_path'] = $newPath;
        }

        return $data;
    }
}
