<?php

namespace App\Services;

use App\Models\AboutPage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class AboutPageService
{
    public function getPage(): AboutPage
    {
        return AboutPage::query()->first() ?? AboutPage::query()->create([]);
    }

    public function updatePage(array $validated, array $files = []): AboutPage
    {
        $aboutPage = $this->getPage();

        $fileFields = [
            'hero_image' => 'hero_image_path',
            'main_image' => 'main_image_path',
        ];

        $data = Arr::except($validated, array_keys($fileFields));

        foreach ($fileFields as $requestField => $databaseColumn) {
            if (isset($files[$requestField])) {
                $newPath = $files[$requestField]->store('about-page', 'public');

                if ($aboutPage->$databaseColumn) {
                    Storage::disk('public')->delete($aboutPage->$databaseColumn);
                }

                $data[$databaseColumn] = $newPath;
            }
        }

        $aboutPage->update($data);
        $aboutPage->refresh();

        return $aboutPage;
    }
}
