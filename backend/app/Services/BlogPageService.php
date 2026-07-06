<?php

namespace App\Services;

use App\Models\BlogPage;
use Illuminate\Support\Arr;
use Throwable;

class BlogPageService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {
    }

    public function getPage(): BlogPage
    {
        return BlogPage::query()->first() ?? BlogPage::query()->create([]);
    }

    public function updatePage(array $validated, array $files = []): BlogPage
    {
        $blogPage = $this->getPage();

        $data = Arr::except($validated, ['hero_image']);
        $newPaths = [];
        $oldPaths = [];

        try {
            if (isset($files['hero_image'])) {
                $newPath = $this->imageUploadService->store($files['hero_image'], 'blog-page', 'hero');
                $newPaths[] = $newPath;

                if ($blogPage->hero_image_path) {
                    $oldPaths[] = $blogPage->hero_image_path;
                }

                $data['hero_image_path'] = $newPath;
            }

            $blogPage->update($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }

        $this->imageUploadService->deleteMany($oldPaths);
        $blogPage->refresh();

        return $blogPage;
    }
}
