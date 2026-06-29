<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectFilterRequest;
use App\Http\Requests\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectService $projectService
    ) {
    }

    public function index(ProjectFilterRequest $request): JsonResponse
    {
        $projects = $this->projectService->listPublicProjects($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Projects fetched successfully.',
            'data' => ProjectResource::collection($projects),
        ]);
    }

    public function adminIndex(): JsonResponse
    {
        $projects = $this->projectService->listProjects();

        return response()->json([
            'success' => true,
            'message' => 'Projects fetched successfully.',
            'data' => ProjectResource::collection($projects),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $project = $this->projectService->findActiveBySlug($slug);

        return response()->json([
            'success' => true,
            'message' => 'Project fetched successfully.',
            'data' => new ProjectResource($project),
        ]);
    }

    public function store(ProjectRequest $request): JsonResponse
    {
        $project = $this->projectService->createProject(
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully.',
            'data' => new ProjectResource($project),
        ], 201);
    }

    public function update(ProjectRequest $request, Project $project): JsonResponse
    {
        $project = $this->projectService->updateProject(
            $project,
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully.',
            'data' => new ProjectResource($project),
        ]);
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->projectService->deleteProject($project);

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully.',
            'data' => null,
        ]);
    }
}
