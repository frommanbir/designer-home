<?php

use App\Http\Controllers\Api\AboutFeatureController;
use App\Http\Controllers\Api\AboutPageController;
use App\Http\Controllers\Api\Admin\SiteSettingController as AdminSiteSettingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceCategoryController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\SiteSettingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/site-settings', [SiteSettingController::class, 'index']);

Route::post('/admin/site-settings', [AdminSiteSettingController::class, 'update']);

Route::get('/about-page', [AboutPageController::class, 'index']);
Route::post('/admin/about-page', [AboutPageController::class, 'update']);
Route::get('/admin/about-features', [AboutFeatureController::class, 'index']);
Route::post('/admin/about-features', [AboutFeatureController::class, 'store']);
Route::put('/admin/about-features/{aboutFeature}', [AboutFeatureController::class, 'update']);
Route::delete('/admin/about-features/{aboutFeature}', [AboutFeatureController::class, 'destroy']);

Route::get('/service-categories', [ServiceCategoryController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{slug}', [ServiceController::class, 'show']);
Route::get('/admin/service-categories', [ServiceCategoryController::class, 'index']);
Route::post('/admin/service-categories', [ServiceCategoryController::class, 'store']);
Route::put('/admin/service-categories/{serviceCategory}', [ServiceCategoryController::class, 'update']);
Route::delete('/admin/service-categories/{serviceCategory}', [ServiceCategoryController::class, 'destroy']);
Route::get('/admin/services', [ServiceController::class, 'adminIndex']);
Route::post('/admin/services', [ServiceController::class, 'store']);
Route::put('/admin/services/{service}', [ServiceController::class, 'update']);
Route::delete('/admin/services/{service}', [ServiceController::class, 'destroy']);

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
