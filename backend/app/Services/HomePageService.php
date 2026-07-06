<?php

namespace App\Services;

use App\Models\HomePage;
use Illuminate\Support\Arr;
use Throwable;

class HomePageService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {
    }

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
        $newPaths = [];
        $oldPaths = [];

        $imageFields = [
            'hero_image' => ['column' => 'hero_image_path', 'profile' => 'hero'],
            'section2_image' => ['column' => 'section2_image_path', 'profile' => 'large'],
            'section3_image' => ['column' => 'section3_image_path', 'profile' => 'large'],
        ];

        try {
            foreach ($imageFields as $requestField => $settings) {
                if (isset($files[$requestField])) {
                    $databaseColumn = $settings['column'];
                    $newPath = $this->imageUploadService->store(
                        $files[$requestField],
                        'home-page',
                        $settings['profile'],
                    );
                    $newPaths[] = $newPath;

                    if ($page->$databaseColumn) {
                        $oldPaths[] = $page->$databaseColumn;
                    }

                    $data[$databaseColumn] = $newPath;
                }
            }

            $page->update($data);
        } catch (Throwable $exception) {
            $this->imageUploadService->deleteMany($newPaths);

            throw $exception;
        }

        $this->imageUploadService->deleteMany($oldPaths);
        $page->refresh();

        return $page;
    }
}
