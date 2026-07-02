<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use App\Models\ContactInquiry;
use App\Models\Portfolio;
use App\Models\Project;
use App\Models\Rating;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Dashboard statistics fetched successfully.',
            'data' => [
                'services'   => Service::count(),
                'projects'   => Project::count(),
                'portfolios' => Portfolio::count(),
                'blogs'      => Blog::count(),
                'ratings'    => Rating::count(),
                'inquiries'  => [
                    'total'  => ContactInquiry::count(),
                    'new'    => ContactInquiry::where('status', 'new')->count(),
                    'read'   => ContactInquiry::where('status', 'read')->count(),
                    'replied' => ContactInquiry::where('status', 'replied')->count(),
                ],
                'recent_inquiries' => ContactInquiry::latest()->take(5)->get([
                    'id', 'name', 'email', 'subject', 'status', 'created_at',
                ]),
            ],
        ]);
    }
}
