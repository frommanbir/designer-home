<?php

namespace App\Services;

use App\Models\ContactPage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class ContactPageService
{
    public function getPage(): ContactPage
    {
        return ContactPage::query()->first() ?? ContactPage::query()->create([]);
    }

    public function updatePage(array $validated, array $files = []): ContactPage
    {
        $contactPage = $this->getPage();

        $data = Arr::except($validated, ['hero_image']);

        if (isset($files['hero_image'])) {
            $newPath = $files['hero_image']->store('contact-page', 'public');

            if ($contactPage->hero_image_path) {
                Storage::disk('public')->delete($contactPage->hero_image_path);
            }

            $data['hero_image_path'] = $newPath;
        }

        $contactPage->update($data);
        $contactPage->refresh();

        return $contactPage;
    }
}
