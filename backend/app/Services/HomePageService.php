<?php

namespace App\Services;

use App\Models\HomePage;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

class HomePageService
{
    public function getPage(): HomePage
    {
        return HomePage::query()->first() ?? HomePage::query()->create([
            'section2_title'             => 'Designing Spaces That inspire Living',
            'section2_description_1'     => 'Transform your vision into reality with innovative interior & architectural design solutions. From concept creation & 3D visualization to project execution & supervision, Designer Home delivers exceptional spaces tailored to your lifestyle and needs.',
            'section2_description_2'     => 'Established in 2016 A.D. Your trusted partner for customized residential, commercial, and hospitality design projects.',
            'section2_btn_inquiry_text'  => 'Click for Inquiry',
            'section2_btn_inquiry_link'  => '/about',
            'section2_btn_projects_text' => 'Explore Our Projects',
            'section2_btn_projects_link' => '/portfolio',
            
            'section3_title'             => 'We bring dreams to life through thoughtful interior & architecture design, creating beautiful, functional spaces that reflect your vision and lifestyle.',
            'section3_stat1_value'       => '200+',
            'section3_stat1_label'       => 'Our Expertise',
            'section3_stat2_value'       => '400+',
            'section3_stat2_label'       => 'Projects',
            'section3_stat3_value'       => '4.5',
            'section3_stat3_label'       => 'Out of 5.0',
            'section3_btn_text'          => 'Learn More',
            'section3_btn_link'          => '/about',
        ]);
    }

    public function updatePage(array $validated, array $files = []): HomePage
    {
        $page = $this->getPage();

        $data = Arr::except($validated, ['hero_image', 'section2_image', 'section3_image']);

        // Handle Hero Image
        if (isset($files['hero_image'])) {
            $newPath = $files['hero_image']->store('home-page', 'public');

            if ($page->hero_image_path) {
                Storage::disk('public')->delete($page->hero_image_path);
            }

            $data['hero_image_path'] = $newPath;
        }

        // Handle Section 2 Image
        if (isset($files['section2_image'])) {
            $newPath = $files['section2_image']->store('home-page', 'public');

            if ($page->section2_image_path) {
                Storage::disk('public')->delete($page->section2_image_path);
            }

            $data['section2_image_path'] = $newPath;
        }

        // Handle Section 3 Image
        if (isset($files['section3_image'])) {
            $newPath = $files['section3_image']->store('home-page', 'public');

            if ($page->section3_image_path) {
                Storage::disk('public')->delete($page->section3_image_path);
            }

            $data['section3_image_path'] = $newPath;
        }

        $page->update($data);
        $page->refresh();

        return $page;
    }
}
