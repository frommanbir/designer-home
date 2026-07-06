<?php

namespace App\Services;

use App\Models\ServicesPage;
use Illuminate\Support\Arr;
use Throwable;

class ServicesPageService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {
    }

    public function getPage(): ServicesPage
    {
        return ServicesPage::query()->first() ?? ServicesPage::query()->create([]);
    }

    public function updatePage(array $validated, array $files = []): ServicesPage
    {
        $servicesPage = $this->getPage();

        $data = Arr::except($validated, ['hero_image']);
        $newPaths = [];
        $oldPaths = [];

        try {
            if (isset($files['hero_image'])) {
                $newPath = $this->imageUploadService->store($files['hero_image'], 'services-page', 'hero');
                $newPaths[] = $newPath;

                if ($servicesPage->hero_image_path) {
                    $oldPaths[] = $servicesPage->hero_image_path;
                }

                $data['hero_image_path'] = $newPath;
            }

            $servicesPage->update($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }

        $this->imageUploadService->deleteMany($oldPaths);
        $servicesPage->refresh();

        return $servicesPage;
    }
}
