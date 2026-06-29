<?php

use App\Http\Controllers\Api\AboutFeatureController;
use App\Http\Controllers\Api\AboutPageController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\SiteSettingController as AdminSiteSettingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceCategoryController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\ContactInquiryController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\PortfolioCategoryController;
use App\Http\Controllers\Api\PortfolioController;
use App\Http\Controllers\Api\ProjectCategoryController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SiteSettingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// =========================================================
// PUBLIC ROUTES — No authentication required (storefront)
// =========================================================
Route::get('/site-settings', [SiteSettingController::class, 'index']);

Route::get('/ratings', [RatingController::class, 'publicIndex']);

Route::get('/blogs', [BlogController::class, 'publicIndex']);
Route::get('/blogs/{slug}', [BlogController::class, 'show']);

Route::get('/about-page', [AboutPageController::class, 'index']);

Route::get('/service-categories', [ServiceCategoryController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{slug}', [ServiceController::class, 'show']);

Route::post('/contact-inquiries', [ContactInquiryController::class, 'store']);

Route::get('/project-categories', [ProjectCategoryController::class, 'index']);
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{slug}', [ProjectController::class, 'show']);

Route::get('/portfolio-categories', [PortfolioCategoryController::class, 'index']);
Route::get('/portfolios', [PortfolioController::class, 'index']);
Route::get('/portfolios/{slug}', [PortfolioController::class, 'show']);

// =========================================================
// AUTH ROUTES — Login / Register (rate-limited)
// =========================================================
Route::prefix('auth')->group(function () {
    Route::post('/login',    [AuthController::class, 'login'])->middleware('throttle:login');
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:login');
});

// =========================================================
// PROTECTED ROUTES — Require valid Bearer token (auth:sanctum)
// =========================================================
Route::middleware('auth:sanctum')->group(function () {

    // Current user info & session management
    Route::get('/user', fn (Request $r) => $r->user());
    Route::prefix('auth')->group(function () {
        Route::get('/me',          [AuthController::class, 'me']);
        Route::post('/logout',     [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
    });

    // ── Admin: Dashboard ──────────────────────────────────
    Route::get('/admin/dashboard', [DashboardController::class, 'index']);

    // ── Admin: Site Settings ──────────────────────────────
    Route::post('/admin/site-settings', [AdminSiteSettingController::class, 'update']);

    // ── Admin: Ratings ────────────────────────────────────
    Route::get('/admin/ratings',             [RatingController::class, 'index']);
    Route::post('/admin/ratings',            [RatingController::class, 'store']);
    Route::put('/admin/ratings/{rating}',    [RatingController::class, 'update']);
    Route::delete('/admin/ratings/{rating}', [RatingController::class, 'destroy']);

    // ── Admin: Blogs ──────────────────────────────────────
    Route::get('/admin/blogs',            [BlogController::class, 'index']);
    Route::post('/admin/blogs',           [BlogController::class, 'store']);
    Route::put('/admin/blogs/{blog}',     [BlogController::class, 'update']);
    Route::delete('/admin/blogs/{blog}',  [BlogController::class, 'destroy']);

    // ── Admin: About Page ─────────────────────────────────
    Route::post('/admin/about-page',                              [AboutPageController::class, 'update']);
    Route::get('/admin/about-features',                           [AboutFeatureController::class, 'index']);
    Route::post('/admin/about-features',                          [AboutFeatureController::class, 'store']);
    Route::put('/admin/about-features/{aboutFeature}',            [AboutFeatureController::class, 'update']);
    Route::delete('/admin/about-features/{aboutFeature}',         [AboutFeatureController::class, 'destroy']);

    // ── Admin: Services ───────────────────────────────────
    Route::get('/admin/service-categories',                       [ServiceCategoryController::class, 'index']);
    Route::post('/admin/service-categories',                      [ServiceCategoryController::class, 'store']);
    Route::put('/admin/service-categories/{serviceCategory}',     [ServiceCategoryController::class, 'update']);
    Route::delete('/admin/service-categories/{serviceCategory}',  [ServiceCategoryController::class, 'destroy']);
    Route::get('/admin/services',                                 [ServiceController::class, 'adminIndex']);
    Route::post('/admin/services',                                [ServiceController::class, 'store']);
    Route::put('/admin/services/{service}',                       [ServiceController::class, 'update']);
    Route::delete('/admin/services/{service}',                    [ServiceController::class, 'destroy']);

    // ── Admin: Contact Inquiries ──────────────────────────
    Route::get('/admin/contact-inquiries',                        [ContactInquiryController::class, 'index']);
    Route::get('/admin/contact-inquiries/{contactInquiry}',       [ContactInquiryController::class, 'show']);
    Route::put('/admin/contact-inquiries/{contactInquiry}',       [ContactInquiryController::class, 'update']);
    Route::delete('/admin/contact-inquiries/{contactInquiry}',    [ContactInquiryController::class, 'destroy']);

    // ── Admin: Projects ───────────────────────────────────
    Route::get('/admin/project-categories',                       [ProjectCategoryController::class, 'index']);
    Route::post('/admin/project-categories',                      [ProjectCategoryController::class, 'store']);
    Route::put('/admin/project-categories/{projectCategory}',     [ProjectCategoryController::class, 'update']);
    Route::delete('/admin/project-categories/{projectCategory}',  [ProjectCategoryController::class, 'destroy']);
    Route::get('/admin/projects',                                 [ProjectController::class, 'adminIndex']);
    Route::post('/admin/projects',                                [ProjectController::class, 'store']);
    Route::put('/admin/projects/{project}',                       [ProjectController::class, 'update']);
    Route::delete('/admin/projects/{project}',                    [ProjectController::class, 'destroy']);

    // ── Admin: Portfolios ─────────────────────────────────
    Route::get('/admin/portfolio-categories',                     [PortfolioCategoryController::class, 'index']);
    Route::post('/admin/portfolio-categories',                    [PortfolioCategoryController::class, 'store']);
    Route::put('/admin/portfolio-categories/{portfolioCategory}', [PortfolioCategoryController::class, 'update']);
    Route::delete('/admin/portfolio-categories/{portfolioCategory}', [PortfolioCategoryController::class, 'destroy']);
    Route::get('/admin/portfolios',                               [PortfolioController::class, 'adminIndex']);
    Route::post('/admin/portfolios',                              [PortfolioController::class, 'store']);
    Route::put('/admin/portfolios/{portfolio}',                   [PortfolioController::class, 'update']);
    Route::delete('/admin/portfolios/{portfolio}',                [PortfolioController::class, 'destroy']);
});
