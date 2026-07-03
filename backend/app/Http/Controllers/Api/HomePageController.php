<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\HomePageRequest;
use App\Http\Resources\HomePageResource;
use App\Services\HomePageService;
use Illuminate\Http\JsonResponse;

class HomePageController extends Controller
{
    public function __construct(
        private readonly HomePageService $homePageService
    ) {}

    public function index(): JsonResponse
    {
        $page = $this->homePageService->getPage();

        return response()->json([
            'success' => true,
            'message' => 'Home page fetched successfully.',
            'data'    => new HomePageResource($page),
        ]);
    }

    public function update(HomePageRequest $request): JsonResponse
    {
        $page = $this->homePageService->updatePage(
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Home page updated successfully.',
            'data'    => new HomePageResource($page),
        ]);
    }
}
