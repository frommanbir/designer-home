<?php

use App\Http\Controllers\Api\Admin\SiteSettingController as AdminSiteSettingController;
use App\Http\Controllers\Api\SiteSettingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::get('/site-settings', [SiteSettingController::class, 'index']);

Route::post('/admin/site-settings', [AdminSiteSettingController::class, 'update']);

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