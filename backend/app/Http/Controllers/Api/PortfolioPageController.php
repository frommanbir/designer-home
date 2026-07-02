<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\PortfolioPageRequest;
use App\Http\Resources\PortfolioPageResource;
use App\Services\PortfolioPageService;
use Illuminate\Http\JsonResponse;

class PortfolioPageController extends Controller
{
    public function __construct(
        private readonly PortfolioPageService $portfolioPageService
    ) {}

    public function index(): JsonResponse
    {
        $page = $this->portfolioPageService->getPage();

        return response()->json([
            'success' => true,
            'message' => 'Portfolio page fetched successfully.',
            'data'    => new PortfolioPageResource($page),
        ]);
    }

    public function update(PortfolioPageRequest $request): JsonResponse
    {
        $page = $this->portfolioPageService->updatePage(
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Portfolio page updated successfully.',
            'data'    => new PortfolioPageResource($page),
        ]);
    }
}
