<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\HomePageResource;
use App\Services\HomePageService;
use Illuminate\Http\JsonResponse;

class HomePageController extends Controller
{
    public function __construct(
        private readonly HomePageService $homePageService
    ) {
    }

    public function index(): JsonResponse
    {
        $homePage = $this->homePageService->getHomepage();

        return response()->json([
            'success' => true,
            'message' => 'Homepage content fetched successfully.',
            'data' => new HomePageResource($homePage),
        ]);
    }
}
