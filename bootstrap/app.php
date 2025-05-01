<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        apiPrefix: '/api',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Global HTTP middleware:
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        // Apply API rate-limiting (see below)
        $middleware->throttleApi('60,1');
        // Enable route-model bindings
        $middleware->append(\Illuminate\Routing\Middleware\SubstituteBindings::class);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

