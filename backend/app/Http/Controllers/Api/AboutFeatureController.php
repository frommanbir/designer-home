<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AboutFeatureRequest;
use App\Http\Resources\AboutFeatureResource;
use App\Models\AboutFeature;
use App\Services\AboutFeatureService;
use Illuminate\Http\JsonResponse;

class AboutFeatureController extends Controller
{
    public function __construct(
        private readonly AboutFeatureService $aboutFeatureService
    ) {
    }

    public function index(): JsonResponse
    {
        $features = $this->aboutFeatureService->listFeatures();

        return response()->json([
            'success' => true,
            'message' => 'About features fetched successfully.',
            'data' => AboutFeatureResource::collection($features),
        ]);
    }

    public function store(AboutFeatureRequest $request): JsonResponse
    {
        $feature = $this->aboutFeatureService->createFeature(
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'About feature created successfully.',
            'data' => new AboutFeatureResource($feature),
        ], 201);
    }

    public function update(AboutFeatureRequest $request, AboutFeature $aboutFeature): JsonResponse
    {
        $feature = $this->aboutFeatureService->updateFeature(
            $aboutFeature,
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'About feature updated successfully.',
            'data' => new AboutFeatureResource($feature),
        ]);
    }

    public function destroy(AboutFeature $aboutFeature): JsonResponse
    {
        $this->aboutFeatureService->deleteFeature($aboutFeature);

        return response()->json([
            'success' => true,
            'message' => 'About feature deleted successfully.',
            'data' => null,
        ]);
    }
}
