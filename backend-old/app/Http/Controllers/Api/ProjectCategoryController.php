<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectCategoryRequest;
use App\Http\Resources\ProjectCategoryResource;
use App\Models\ProjectCategory;
use App\Services\ProjectCategoryService;
use Illuminate\Http\JsonResponse;

class ProjectCategoryController extends Controller
{
    public function __construct(
        private readonly ProjectCategoryService $projectCategoryService
    ) {
    }

    public function index(): JsonResponse
    {
        $categories = $this->projectCategoryService->listCategories();

        return response()->json([
            'success' => true,
            'message' => 'Project categories fetched successfully.',
            'data' => ProjectCategoryResource::collection($categories),
        ]);
    }

    public function store(ProjectCategoryRequest $request): JsonResponse
    {
        $category = $this->projectCategoryService->createCategory(
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Project category created successfully.',
            'data' => new ProjectCategoryResource($category),
        ], 201);
    }

    public function update(ProjectCategoryRequest $request, ProjectCategory $projectCategory): JsonResponse
    {
        $category = $this->projectCategoryService->updateCategory(
            $projectCategory,
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Project category updated successfully.',
            'data' => new ProjectCategoryResource($category),
        ]);
    }

    public function destroy(ProjectCategory $projectCategory): JsonResponse
    {
        $this->projectCategoryService->deleteCategory($projectCategory);

        return response()->json([
            'success' => true,
            'message' => 'Project category deleted successfully.',
            'data' => null,
        ]);
    }
}
