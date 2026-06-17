<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactPageRequest;
use App\Http\Resources\ContactPageResource;
use App\Services\ContactPageService;
use Illuminate\Http\JsonResponse;

class ContactPageController extends Controller
{
    public function __construct(
        private readonly ContactPageService $contactPageService
    ) {
    }

    public function index(): JsonResponse
    {
        $contactPage = $this->contactPageService->getPage();

        return response()->json([
            'success' => true,
            'message' => 'Contact page fetched successfully.',
            'data' => new ContactPageResource($contactPage),
        ]);
    }

    public function update(ContactPageRequest $request): JsonResponse
    {
        $contactPage = $this->contactPageService->updatePage(
            $request->validated(),
            $request->allFiles()
        );

        return response()->json([
            'success' => true,
            'message' => 'Contact page updated successfully.',
            'data' => new ContactPageResource($contactPage),
        ]);
    }
}
