<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RatingRequest;
use App\Http\Resources\RatingResource;
use App\Models\Rating;
use App\Services\RatingService;
use Illuminate\Http\JsonResponse;

class RatingController extends Controller
{
    public function __construct(
        private readonly RatingService $ratingService
    ) {
    }

    public function publicIndex(): JsonResponse
    {
        $ratings = $this->ratingService->listActiveRatings();

        return response()->json([
            'success' => true,
            'message' => 'Ratings fetched successfully.',
            'data' => RatingResource::collection($ratings),
        ]);
    }

    public function index(): JsonResponse
    {
        $ratings = $this->ratingService->listRatings();

        return response()->json([
            'success' => true,
            'message' => 'Ratings fetched successfully.',
            'data' => RatingResource::collection($ratings),
        ]);
    }

    public function store(RatingRequest $request): JsonResponse
    {
        $rating = $this->ratingService->createRating($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Rating created successfully.',
            'data' => new RatingResource($rating),
        ], 201);
    }

    public function update(RatingRequest $request, Rating $rating): JsonResponse
    {
        $rating = $this->ratingService->updateRating($rating, $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Rating updated successfully.',
            'data' => new RatingResource($rating),
        ]);
    }

    public function destroy(Rating $rating): JsonResponse
    {
        $this->ratingService->deleteRating($rating);

        return response()->json([
            'success' => true,
            'message' => 'Rating deleted successfully.',
            'data' => null,
        ]);
    }
}
