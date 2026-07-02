<?php

namespace App\Services;

use App\Models\HomePage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class HomePageService
{
    public function getHomepage(): ?HomePage
    {
        return HomePage::query()->first();
    }

    public function updateHomepage(array $validated, array $files = []): HomePage
    {
        $homePage = HomePage::query()->firstOrNew();

        $fileFields = [
            'hero_image' => 'hero_image_path',
            'intro_image' => 'intro_image_path',
            'stats_image' => 'stats_image_path',
        ];

        $data = Arr::except($validated, array_keys($fileFields));

        foreach ($fileFields as $requestField => $databaseColumn) {
            if (isset($files[$requestField])) {
                $newPath = $files[$requestField]->store('home-pages', 'public');

                if ($homePage->$databaseColumn) {
                    Storage::disk('public')->delete($homePage->$databaseColumn);
                }

                $data[$databaseColumn] = $newPath;
            }
        }

        $homePage->fill($data);
        $homePage->save();
        $homePage->refresh();

        return $homePage;
    }
}
