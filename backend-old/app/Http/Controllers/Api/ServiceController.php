<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Services\ServiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function __construct(
        private readonly ServiceService $serviceService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $services = $this->serviceService->listServices(
            $request->query('category'),
            activeOnly: true
        );

        return response()->json([
            'success' => true,
            'message' => 'Services fetched successfully.',
            'data' => ServiceResource::collection($services),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $service = $this->serviceService->findActiveBySlug($slug);

        return response()->json([
            'success' => true,
            'message' => 'Service fetched successfully.',
            'data' => new ServiceResource($service),
        ]);
    }

    public function adminIndex(): JsonResponse
    {
        $services = $this->serviceService->listServices();

        return response()->json([
            'success' => true,
            'message' => 'Services fetched successfully.',
            'data' => ServiceResource::collection($services),
        ]);
    }

    public function store(ServiceRequest $request): JsonResponse
    {
        $service = $this->serviceService->createService(
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Service created successfully.',
            'data' => new ServiceResource($service),
        ], 201);
    }

    public function update(ServiceRequest $request, Service $service): JsonResponse
    {
        $service = $this->serviceService->updateService(
            $service,
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Service updated successfully.',
            'data' => new ServiceResource($service),
        ]);
    }

    public function destroy(Service $service): JsonResponse
    {
        $this->serviceService->deleteService($service);

        return response()->json([
            'success' => true,
            'message' => 'Service deleted successfully.',
            'data' => null,
        ]);
    }
}
