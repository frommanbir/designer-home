<?php

namespace App\Services;

use App\Models\ProjectPage;
use Illuminate\Support\Arr;
use Throwable;

class ProjectPageService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {
    }

    public function getPage(): ProjectPage
    {
        return ProjectPage::query()->first() ?? ProjectPage::query()->create([]);
    }

    public function updatePage(array $validated, array $files = []): ProjectPage
    {
        $projectPage = $this->getPage();

        $data = Arr::except($validated, ['hero_image']);
        $newPaths = [];
        $oldPaths = [];

        try {
            if (isset($files['hero_image'])) {
                $newPath = $this->imageUploadService->store($files['hero_image'], 'project-page', 'hero');
                $newPaths[] = $newPath;

                if ($projectPage->hero_image_path) {
                    $oldPaths[] = $projectPage->hero_image_path;
                }

                $data['hero_image_path'] = $newPath;
            }

            $projectPage->update($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }

        $this->imageUploadService->deleteMany($oldPaths);
        $projectPage->refresh();

        return $projectPage;
    }
}
