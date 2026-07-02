<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\HomePageRequest;
use App\Http\Resources\HomePageResource;
use App\Services\HomePageService;
use Illuminate\Http\JsonResponse;

class HomePageController extends Controller
{
    public function __construct(
        private readonly HomePageService $homePageService
    ) {
    }

    public function update(HomePageRequest $request): JsonResponse
    {
        $homePage = $this->homePageService->updateHomepage(
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Homepage content updated successfully.',
            'data' => new HomePageResource($homePage),
        ]);
    }
}
