<?php

use App\Http\Controllers\Admin\AdminNotificationController;
use App\Http\Controllers\Admin\InventoryController as AdminInventoryController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Admin\ProductVariantController as AdminProductVariantController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\EmailVerificationController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\Catalog\ProductController as CatalogProductController;
use App\Support\ApiResponse;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('/health', fn () => ApiResponse::success([
        'service' => 'daccord-api',
        'timestamp' => now()->toISOString(),
    ], 'API disponível.'));

    Route::prefix('auth')->group(function (): void {
        Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:auth.register');
        Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth.login');
        Route::post('/forgot-password', [PasswordResetController::class, 'forgot'])->middleware('throttle:auth.password');
        Route::post('/reset-password', [PasswordResetController::class, 'reset'])->middleware('throttle:auth.password');

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/confirm-password', [AuthController::class, 'confirmPassword'])->middleware('throttle:auth.login');
            Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
                ->middleware('throttle:auth.verify');
        });

        Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
            ->middleware(['signed', 'throttle:auth.verify'])
            ->name('verification.verify');
    });

    Route::get('/products', [CatalogProductController::class, 'index']);
    Route::get('/products/{product:slug}', [CatalogProductController::class, 'show']);

    Route::prefix('admin')
        ->middleware(['auth:sanctum', 'verified', 'role:admin'])
        ->group(function (): void {
            Route::apiResource('products', AdminProductController::class)->except('destroy');
            Route::delete('/products/{product}', [AdminProductController::class, 'destroy'])
                ->middleware('password.recent');
            Route::scopeBindings()->group(function (): void {
                Route::post('/products/{product}/variants', [AdminProductVariantController::class, 'store']);
                Route::patch('/products/{product}/variants/{variant}', [AdminProductVariantController::class, 'update']);
                Route::delete('/products/{product}/variants/{variant}', [AdminProductVariantController::class, 'destroy'])
                    ->middleware('password.recent');
            });
            Route::get('/inventory', [AdminInventoryController::class, 'index']);
            Route::get('/inventory/{variant}', [AdminInventoryController::class, 'show']);
            Route::patch('/inventory/{variant}', [AdminInventoryController::class, 'update']);
            Route::get('/notifications', [AdminNotificationController::class, 'index']);
            Route::patch('/notifications/read-all', [AdminNotificationController::class, 'markAllAsRead']);
            Route::patch('/notifications/{notificationId}/read', [AdminNotificationController::class, 'markAsRead']);
            Route::get('/users', [AdminUserController::class, 'index']);
            Route::patch('/users/{user}/role', [AdminUserController::class, 'updateRole'])
                ->middleware('password.recent');
        });
});
