<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateSiteSettingRequest;
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
     * Admin API endpoint.
     *
     * POST /api/admin/site-settings
     */
    public function update(UpdateSiteSettingRequest $request): JsonResponse
    {
        $settings = $this->siteSettingService->updateSettings($request);

        return response()->json([
            'success' => true,
            'message' => 'Site settings updated successfully.',
            'data' => new SiteSettingResource($settings),
        ]);
    }
}