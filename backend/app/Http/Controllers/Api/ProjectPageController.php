<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectPageRequest;
use App\Http\Resources\ProjectPageResource;
use App\Services\ProjectPageService;
use Illuminate\Http\JsonResponse;

class ProjectPageController extends Controller
{
    public function __construct(
        private readonly ProjectPageService $projectPageService
    ) {}

    public function index(): JsonResponse
    {
        $page = $this->projectPageService->getPage();

        return response()->json([
            'success' => true,
            'message' => 'Project page fetched successfully.',
            'data'    => new ProjectPageResource($page),
        ]);
    }

    public function update(ProjectPageRequest $request): JsonResponse
    {
        $page = $this->projectPageService->updatePage(
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Project page updated successfully.',
            'data'    => new ProjectPageResource($page),
        ]);
    }
}
