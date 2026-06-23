<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PortfolioFilterRequest;
use App\Http\Requests\PortfolioRequest;
use App\Http\Resources\PortfolioResource;
use App\Models\Portfolio;
use App\Services\PortfolioService;
use Illuminate\Http\JsonResponse;

class PortfolioController extends Controller
{
    public function __construct(
        private readonly PortfolioService $portfolioService
    ) {
    }

    public function index(PortfolioFilterRequest $request): JsonResponse
    {
        $portfolios = $this->portfolioService->listPublicPortfolios($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Portfolios fetched successfully.',
            'data' => PortfolioResource::collection($portfolios),
        ]);
    }

    public function adminIndex(): JsonResponse
    {
        $portfolios = $this->portfolioService->listPortfolios();

        return response()->json([
            'success' => true,
            'message' => 'Portfolios fetched successfully.',
            'data' => PortfolioResource::collection($portfolios),
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $portfolio = $this->portfolioService->findActiveBySlug($slug);

        return response()->json([
            'success' => true,
            'message' => 'Portfolio fetched successfully.',
            'data' => new PortfolioResource($portfolio),
        ]);
    }

    public function store(PortfolioRequest $request): JsonResponse
    {
        $portfolio = $this->portfolioService->createPortfolio(
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Portfolio created successfully.',
            'data' => new PortfolioResource($portfolio),
        ], 201);
    }

    public function update(PortfolioRequest $request, Portfolio $portfolio): JsonResponse
    {
        $portfolio = $this->portfolioService->updatePortfolio(
            $portfolio,
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Portfolio updated successfully.',
            'data' => new PortfolioResource($portfolio),
        ]);
    }

    public function destroy(Portfolio $portfolio): JsonResponse
    {
        $this->portfolioService->deletePortfolio($portfolio);

        return response()->json([
            'success' => true,
            'message' => 'Portfolio deleted successfully.',
            'data' => null,
        ]);
    }
}
