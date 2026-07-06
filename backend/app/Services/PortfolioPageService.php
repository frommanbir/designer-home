<?php

namespace App\Services;

use App\Models\PortfolioPage;
use Illuminate\Support\Arr;
use Throwable;

class PortfolioPageService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {
    }

    public function getPage(): PortfolioPage
    {
        return PortfolioPage::query()->first() ?? PortfolioPage::query()->create([]);
    }

    public function updatePage(array $validated, array $files = []): PortfolioPage
    {
        $portfolioPage = $this->getPage();

        $data = Arr::except($validated, ['hero_image']);
        $newPaths = [];
        $oldPaths = [];

        try {
            if (isset($files['hero_image'])) {
                $newPath = $this->imageUploadService->store($files['hero_image'], 'portfolio-page', 'hero');
                $newPaths[] = $newPath;

                if ($portfolioPage->hero_image_path) {
                    $oldPaths[] = $portfolioPage->hero_image_path;
                }

                $data['hero_image_path'] = $newPath;
            }

            $portfolioPage->update($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }

        $this->imageUploadService->deleteMany($oldPaths);
        $portfolioPage->refresh();

        return $portfolioPage;
    }
}
