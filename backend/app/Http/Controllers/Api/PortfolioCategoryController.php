<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PortfolioCategoryRequest;
use App\Http\Resources\PortfolioCategoryResource;
use App\Models\PortfolioCategory;
use App\Services\PortfolioCategoryService;
use Illuminate\Http\JsonResponse;

class PortfolioCategoryController extends Controller
{
    public function __construct(
        private readonly PortfolioCategoryService $portfolioCategoryService
    ) {
    }

    public function index(): JsonResponse
    {
        $categories = $this->portfolioCategoryService->listCategories();

        return response()->json([
            'success' => true,
            'message' => 'Portfolio categories fetched successfully.',
            'data' => PortfolioCategoryResource::collection($categories),
        ]);
    }

    public function store(PortfolioCategoryRequest $request): JsonResponse
    {
        $category = $this->portfolioCategoryService->createCategory($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Portfolio category created successfully.',
            'data' => new PortfolioCategoryResource($category),
        ], 201);
    }

    public function update(PortfolioCategoryRequest $request, PortfolioCategory $portfolioCategory): JsonResponse
    {
        $category = $this->portfolioCategoryService->updateCategory(
            $portfolioCategory,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Portfolio category updated successfully.',
            'data' => new PortfolioCategoryResource($category),
        ]);
    }

    public function destroy(PortfolioCategory $portfolioCategory): JsonResponse
    {
        $this->portfolioCategoryService->deleteCategory($portfolioCategory);

        return response()->json([
            'success' => true,
            'message' => 'Portfolio category deleted successfully.',
            'data' => null,
        ]);
    }
}
