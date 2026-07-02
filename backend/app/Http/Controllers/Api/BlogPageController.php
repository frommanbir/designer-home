<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BlogPageRequest;
use App\Http\Resources\BlogPageResource;
use App\Services\BlogPageService;
use Illuminate\Http\JsonResponse;

class BlogPageController extends Controller
{
    public function __construct(
        private readonly BlogPageService $blogPageService
    ) {}

    public function index(): JsonResponse
    {
        $page = $this->blogPageService->getPage();

        return response()->json([
            'success' => true,
            'message' => 'Blog page fetched successfully.',
            'data'    => new BlogPageResource($page),
        ]);
    }

    public function update(BlogPageRequest $request): JsonResponse
    {
        $page = $this->blogPageService->updatePage(
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Blog page updated successfully.',
            'data'    => new BlogPageResource($page),
        ]);
    }
}
