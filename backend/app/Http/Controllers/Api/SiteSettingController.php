<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\SiteSettingResource;
use App\Services\SiteSettingService;
use Illuminate\Http\JsonResponse;

class SiteSettingController extends Controller
{
    public function __construct(
        private readonly SiteSettingService $siteSettingService
    ) {
    }

    /**
     * Public API endpoint for frontend.
     *
     * GET /api/site-settings
     */
    public function index(): JsonResponse
    {
        $settings = $this->siteSettingService->getSettings();

        return response()->json([
            'success' => true,
            'message' => 'Site settings fetched successfully.',
            'data' => new SiteSettingResource($settings),
        ]);
    }
}