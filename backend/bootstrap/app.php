<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
    })
    ->booted(function () {
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->ip());
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
        return response()->json(['message' => 'Unauthenticated.'], 401);
    });

    $exceptions->render(function (\Illuminate\Validation\ValidationException $e, Request $request) {
        return response()->json([
            'message' => 'Validation failed',
            'errors'  => $e->errors(),
        ], 422);
    });

    $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\NotFoundHttpException $e) {
        return response()->json(['message' => 'Not found.'], 404);
    });
})->create();
