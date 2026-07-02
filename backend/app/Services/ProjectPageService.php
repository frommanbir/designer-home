<?php

namespace App\Services;

use App\Models\ProjectPage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class ProjectPageService
{
    public function getPage(): ProjectPage
    {
        return ProjectPage::query()->first() ?? ProjectPage::query()->create([]);
    }

    public function updatePage(array $validated, array $files = []): ProjectPage
    {
        $projectPage = $this->getPage();

        $data = Arr::except($validated, ['hero_image']);

        if (isset($files['hero_image'])) {
            $newPath = $files['hero_image']->store('project-page', 'public');

            if ($projectPage->hero_image_path) {
                Storage::disk('public')->delete($projectPage->hero_image_path);
            }

            $data['hero_image_path'] = $newPath;
        }

        $projectPage->update($data);
        $projectPage->refresh();

        return $projectPage;
    }
}
