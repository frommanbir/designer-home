<?php

namespace App\Services;

use App\Models\PortfolioPage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class PortfolioPageService
{
    public function getPage(): PortfolioPage
    {
        return PortfolioPage::query()->first() ?? PortfolioPage::query()->create([]);
    }

    public function updatePage(array $validated, array $files = []): PortfolioPage
    {
        $portfolioPage = $this->getPage();

        $data = Arr::except($validated, ['hero_image']);

        if (isset($files['hero_image'])) {
            $newPath = $files['hero_image']->store('portfolio-page', 'public');

            if ($portfolioPage->hero_image_path) {
                Storage::disk('public')->delete($portfolioPage->hero_image_path);
            }

            $data['hero_image_path'] = $newPath;
        }

        $portfolioPage->update($data);
        $portfolioPage->refresh();

        return $portfolioPage;
    }
}
