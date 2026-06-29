<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceCategoryRequest;
use App\Http\Resources\ServiceCategoryResource;
use App\Models\ServiceCategory;
use App\Services\ServiceCategoryService;
use Illuminate\Http\JsonResponse;

class ServiceCategoryController extends Controller
{
    public function __construct(
        private readonly ServiceCategoryService $serviceCategoryService
    ) {
    }

    public function index(): JsonResponse
    {
        $categories = $this->serviceCategoryService->listCategories();

        return response()->json([
            'success' => true,
            'message' => 'Service categories fetched successfully.',
            'data' => ServiceCategoryResource::collection($categories),
        ]);
    }

    public function store(ServiceCategoryRequest $request): JsonResponse
    {
        $category = $this->serviceCategoryService->createCategory($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Service category created successfully.',
            'data' => new ServiceCategoryResource($category),
        ], 201);
    }

    public function update(ServiceCategoryRequest $request, ServiceCategory $serviceCategory): JsonResponse
    {
        $category = $this->serviceCategoryService->updateCategory(
            $serviceCategory,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Service category updated successfully.',
            'data' => new ServiceCategoryResource($category),
        ]);
    }

    public function destroy(ServiceCategory $serviceCategory): JsonResponse
    {
        $this->serviceCategoryService->deleteCategory($serviceCategory);

        return response()->json([
            'success' => true,
            'message' => 'Service category deleted successfully.',
            'data' => null,
        ]);
    }
}
