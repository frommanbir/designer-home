<?php

use App\Http\Controllers\Api\AboutFeatureController;
use App\Http\Controllers\Api\AboutPageController;
use App\Http\Controllers\Api\Admin\SiteSettingController as AdminSiteSettingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactInquiryController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\SiteSettingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/site-settings', [SiteSettingController::class, 'index']);

Route::post('/admin/site-settings', [AdminSiteSettingController::class, 'update']);

Route::get('/ratings', [RatingController::class, 'publicIndex']);
Route::get('/admin/ratings', [RatingController::class, 'index']);
Route::post('/admin/ratings', [RatingController::class, 'store']);
Route::put('/admin/ratings/{rating}', [RatingController::class, 'update']);
Route::delete('/admin/ratings/{rating}', [RatingController::class, 'destroy']);

Route::get('/about-page', [AboutPageController::class, 'index']);
Route::post('/admin/about-page', [AboutPageController::class, 'update']);
Route::get('/admin/about-features', [AboutFeatureController::class, 'index']);
Route::post('/admin/about-features', [AboutFeatureController::class, 'store']);
Route::put('/admin/about-features/{aboutFeature}', [AboutFeatureController::class, 'update']);
Route::delete('/admin/about-features/{aboutFeature}', [AboutFeatureController::class, 'destroy']);

Route::post('/contact-inquiries', [ContactInquiryController::class, 'store']);
Route::get('/admin/contact-inquiries', [ContactInquiryController::class, 'index']);
Route::get('/admin/contact-inquiries/{contactInquiry}', [ContactInquiryController::class, 'show']);
Route::put('/admin/contact-inquiries/{contactInquiry}', [ContactInquiryController::class, 'update']);
Route::delete('/admin/contact-inquiries/{contactInquiry}', [ContactInquiryController::class, 'destroy']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/login',    [AuthController::class, 'login'])
    ->middleware('throttle:login'); // Apply rate limiting to login route
    Route::post('/register', [AuthController::class, 'register']);
});

// Protected routes (require Bearer token)
Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::get('/me',           [AuthController::class, 'me']);
    Route::post('/logout',      [AuthController::class, 'logout']);
    Route::post('/logout-all',  [AuthController::class, 'logoutAll']);
});
