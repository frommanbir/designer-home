<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AboutPageRequest;
use App\Http\Resources\AboutPageResource;
use App\Services\AboutFeatureService;
use App\Services\AboutPageService;
use Illuminate\Http\JsonResponse;

class AboutPageController extends Controller
{
    public function __construct(
        private readonly AboutPageService $aboutPageService,
        private readonly AboutFeatureService $aboutFeatureService
    ) {
    }

    public function index(): JsonResponse
    {
        $aboutPage = $this->aboutPageService->getPage();
        $features = $this->aboutFeatureService->listActiveFeatures();

        return response()->json([
            'success' => true,
            'message' => 'About page fetched successfully.',
            'data' => new AboutPageResource($aboutPage, $features),
        ]);
    }

    public function update(AboutPageRequest $request): JsonResponse
    {
        $aboutPage = $this->aboutPageService->updatePage(
            $request->validated(),
            $request->allFiles()
        );
        $features = $this->aboutFeatureService->listActiveFeatures();

        return response()->json([
            'success' => true,
            'message' => 'About page updated successfully.',
            'data' => new AboutPageResource($aboutPage, $features),
        ]);
    }
}
