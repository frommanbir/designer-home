<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BlogRequest;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use App\Services\BlogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function __construct(
        private readonly BlogService $blogService
    ) {
    }

    public function publicIndex(Request $request): JsonResponse
    {
        $blogs = $this->blogService->listActiveBlogs($request->only('search'));

        return response()->json([
            'success' => true,
            'message' => 'Blogs fetched successfully.',
            'data' => BlogResource::collection($blogs),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $blog = $this->blogService->getActiveBlogBySlug($slug);

        return response()->json([
            'success' => true,
            'message' => 'Blog fetched successfully.',
            'data' => new BlogResource($blog),
        ]);
    }

    public function index(): JsonResponse
    {
        $blogs = $this->blogService->listBlogs();

        return response()->json([
            'success' => true,
            'message' => 'Blogs fetched successfully.',
            'data' => BlogResource::collection($blogs),
        ]);
    }

    public function store(BlogRequest $request): JsonResponse
    {
        $blog = $this->blogService->createBlog(
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Blog created successfully.',
            'data' => new BlogResource($blog),
        ], 201);
    }

    public function update(BlogRequest $request, Blog $blog): JsonResponse
    {
        $blog = $this->blogService->updateBlog(
            $blog,
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Blog updated successfully.',
            'data' => new BlogResource($blog),
        ]);
    }

    public function destroy(Blog $blog): JsonResponse
    {
        $this->blogService->deleteBlog($blog);

        return response()->json([
            'success' => true,
            'message' => 'Blog deleted successfully.',
            'data' => null,
        ]);
    }
}
