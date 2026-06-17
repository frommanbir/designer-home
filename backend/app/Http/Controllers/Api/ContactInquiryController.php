<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContactInquiryRequest;
use App\Http\Requests\UpdateContactInquiryStatusRequest;
use App\Http\Resources\ContactInquiryResource;
use App\Models\ContactInquiry;
use App\Services\ContactInquiryService;
use Illuminate\Http\JsonResponse;

class ContactInquiryController extends Controller
{
    public function __construct(
        private readonly ContactInquiryService $contactInquiryService
    ) {
    }

    public function store(ContactInquiryRequest $request): JsonResponse
    {
        $contactInquiry = $this->contactInquiryService->createInquiry($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Contact inquiry submitted successfully.',
            'data' => new ContactInquiryResource($contactInquiry),
        ], 201);
    }

    public function index(): JsonResponse
    {
        $contactInquiries = $this->contactInquiryService->listInquiries();

        return response()->json([
            'success' => true,
            'message' => 'Contact inquiries fetched successfully.',
            'data' => ContactInquiryResource::collection($contactInquiries),
        ]);
    }

    public function show(ContactInquiry $contactInquiry): JsonResponse
    {
        $contactInquiry = $this->contactInquiryService->showInquiry($contactInquiry);

        return response()->json([
            'success' => true,
            'message' => 'Contact inquiry fetched successfully.',
            'data' => new ContactInquiryResource($contactInquiry),
        ]);
    }

    public function update(UpdateContactInquiryStatusRequest $request, ContactInquiry $contactInquiry): JsonResponse
    {
        $contactInquiry = $this->contactInquiryService->updateStatus(
            $contactInquiry,
            $request->validated()['status']
        );

        return response()->json([
            'success' => true,
            'message' => 'Contact inquiry status updated successfully.',
            'data' => new ContactInquiryResource($contactInquiry),
        ]);
    }

    public function destroy(ContactInquiry $contactInquiry): JsonResponse
    {
        $this->contactInquiryService->deleteInquiry($contactInquiry);

        return response()->json([
            'success' => true,
            'message' => 'Contact inquiry deleted successfully.',
            'data' => null,
        ]);
    }
}
