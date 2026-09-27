<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminNotificationResource;
use App\Models\AdminNotification;
use App\Services\LowStockNotificationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminNotificationController extends Controller
{
    public function index(Request $request, LowStockNotificationService $lowStockNotifications): JsonResponse
    {
        $lowStockNotifications->synchronizeCurrentState();
        $admin = $request->user();
        $notifications = $admin->adminNotifications()
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->paginate(min(max($request->integer('per_page', 8), 1), 25))
            ->through(fn (AdminNotification $notification): array => AdminNotificationResource::make($notification)->resolve());

        return ApiResponse::success([
            'notifications' => $notifications,
            'unread_count' => $admin->adminNotifications()->whereNull('read_at')->count(),
        ], 'Notificações consultadas.');
    }

    public function markAsRead(Request $request, int $notificationId): JsonResponse
    {
        $notification = $request->user()->adminNotifications()->whereKey($notificationId)->firstOrFail();
        $notification->markAsRead();

        return ApiResponse::success([
            'notification' => AdminNotificationResource::make($notification)->resolve(),
        ], 'Notificação marcada como lida.');
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->adminNotifications()->whereNull('read_at')->update([
            'read_at' => now(),
            'updated_at' => now(),
        ]);

        return ApiResponse::success(null, 'Notificações marcadas como lidas.');
    }
}
