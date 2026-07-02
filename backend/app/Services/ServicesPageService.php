<?php

namespace App\Services;

use App\Models\ServicesPage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class ServicesPageService
{
    public function getPage(): ServicesPage
    {
        return ServicesPage::query()->first() ?? ServicesPage::query()->create([]);
    }

    public function updatePage(array $validated, array $files = []): ServicesPage
    {
        $servicesPage = $this->getPage();

        $data = Arr::except($validated, ['hero_image']);

        if (isset($files['hero_image'])) {
            $newPath = $files['hero_image']->store('services-page', 'public');

            if ($servicesPage->hero_image_path) {
                Storage::disk('public')->delete($servicesPage->hero_image_path);
            }

            $data['hero_image_path'] = $newPath;
        }

        $servicesPage->update($data);
        $servicesPage->refresh();

        return $servicesPage;
    }
}
