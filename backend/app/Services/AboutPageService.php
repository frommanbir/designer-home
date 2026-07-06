<?php

namespace App\Services;

use App\Models\AboutPage;
use Illuminate\Support\Arr;
use Throwable;

class AboutPageService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {
    }

    public function getPage(): AboutPage
    {
        return AboutPage::query()->first() ?? AboutPage::query()->create([]);
    }

    public function updatePage(array $validated, array $files = []): AboutPage
    {
        $aboutPage = $this->getPage();

        $fileFields = [
            'hero_image' => ['column' => 'hero_image_path', 'profile' => 'hero'],
            'main_image' => ['column' => 'main_image_path', 'profile' => 'large'],
        ];

        $data = Arr::except($validated, array_keys($fileFields));
        $newPaths = [];
        $oldPaths = [];

        try {
            foreach ($fileFields as $requestField => $settings) {
                if (isset($files[$requestField])) {
                    $databaseColumn = $settings['column'];
                    $newPath = $this->imageUploadService->store(
                        $files[$requestField],
                        'about-page',
                        $settings['profile'],
                    );
                    $newPaths[] = $newPath;

                    if ($aboutPage->$databaseColumn) {
                        $oldPaths[] = $aboutPage->$databaseColumn;
                    }

                    $data[$databaseColumn] = $newPath;
                }
            }

            $aboutPage->update($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }

        $this->imageUploadService->deleteMany($oldPaths);
        $aboutPage->refresh();

        return $aboutPage;
    }
}
