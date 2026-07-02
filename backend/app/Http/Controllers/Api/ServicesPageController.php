<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServicesPageRequest;
use App\Http\Resources\ServicesPageResource;
use App\Services\ServicesPageService;
use Illuminate\Http\JsonResponse;

class ServicesPageController extends Controller
{
    public function __construct(
        private readonly ServicesPageService $servicesPageService
    ) {}

    public function index(): JsonResponse
    {
        $page = $this->servicesPageService->getPage();

        return response()->json([
            'success' => true,
            'message' => 'Services page fetched successfully.',
            'data'    => new ServicesPageResource($page),
        ]);
    }

    public function update(ServicesPageRequest $request): JsonResponse
    {
        $page = $this->servicesPageService->updatePage(
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Services page updated successfully.',
            'data'    => new ServicesPageResource($page),
        ]);
    }
}
