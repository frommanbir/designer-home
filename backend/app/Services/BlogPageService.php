<?php

namespace App\Services;

use App\Models\BlogPage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class BlogPageService
{
    public function getPage(): BlogPage
    {
        return BlogPage::query()->first() ?? BlogPage::query()->create([]);
    }

    public function updatePage(array $validated, array $files = []): BlogPage
    {
        $blogPage = $this->getPage();

        $data = Arr::except($validated, ['hero_image']);

        if (isset($files['hero_image'])) {
            $newPath = $files['hero_image']->store('blog-page', 'public');

            if ($blogPage->hero_image_path) {
                Storage::disk('public')->delete($blogPage->hero_image_path);
            }

            $data['hero_image_path'] = $newPath;
        }

        $blogPage->update($data);
        $blogPage->refresh();

        return $blogPage;
    }
}
