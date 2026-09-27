<?php

namespace App\Services;

use App\Models\AdminNotification;
use App\Models\Inventory;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class LowStockNotificationService
{
    public function synchronizeCurrentState(): void
    {
        $lowStockIds = Inventory::query()
            ->whereHas('variant.product')
            ->whereColumn('quantity_available', '<=', 'low_stock_threshold')
            ->pluck('id');
        $activeAlertIds = AdminNotification::query()
            ->where('type', AdminNotification::TYPE_LOW_STOCK)
            ->where('subject_type', 'inventory')
            ->whereNull('resolved_at')
            ->pluck('subject_id');

        $lowStockIds->merge($activeAlertIds)
            ->filter(fn (mixed $id): bool => $id !== null)
            ->unique()
            ->each(fn (int $id) => $this->synchronizeInventory($id));
    }

    public function synchronizeInventory(int $inventoryId): void
    {
        DB::transaction(function () use ($inventoryId): void {
            $inventory = Inventory::query()
                ->with(['variant.product'])
                ->whereKey($inventoryId)
                ->lockForUpdate()
                ->first();
            $activeNotifications = AdminNotification::query()
                ->where('type', AdminNotification::TYPE_LOW_STOCK)
                ->where('subject_type', 'inventory')
                ->where('subject_id', $inventoryId)
                ->whereNull('resolved_at')
                ->get();

            if (! $inventory || ! $inventory->variant?->product) {
                $activeNotifications->each(fn (AdminNotification $notification) => $notification->update([
                    'resolved_at' => now(),
                ]));

                return;
            }

            $quantity = $inventory->quantity_available;
            $threshold = $inventory->low_stock_threshold;

            if ($quantity > $threshold) {
                $activeNotifications->each(fn (AdminNotification $notification) => $notification->update([
                    'resolved_at' => now(),
                ]));

                return;
            }

            $admins = User::query()
                ->whereHas('role', fn ($query) => $query->where('slug', Role::ADMIN))
                ->get(['id']);
            $activeByAdmin = $activeNotifications->keyBy('admin_id');
            $product = $inventory->variant->product;
            $title = $quantity === 0 ? 'Produto sem estoque' : 'Estoque baixo';
            $summary = "{$product->name} · {$inventory->variant->name} ({$inventory->variant->sku}) está com {$quantity} unidade(s); limite baixo: {$threshold}.";
            $attributes = [
                'title' => $title,
                'summary' => $summary,
                'target_url' => "/admin/produtos/{$product->id}",
                'data' => [
                    'inventory_id' => $inventory->id,
                    'variant_id' => $inventory->variant->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'variant_name' => $inventory->variant->name,
                    'sku' => $inventory->variant->sku,
                    'quantity_available' => $quantity,
                    'low_stock_threshold' => $threshold,
                ],
            ];

            foreach ($admins as $admin) {
                $notification = $activeByAdmin->get($admin->id);

                if ($notification) {
                    $notification->fill($attributes);
                    if ($notification->isDirty()) {
                        $notification->save();
                    }

                    continue;
                }

                AdminNotification::query()->create($attributes + [
                    'admin_id' => $admin->id,
                    'type' => AdminNotification::TYPE_LOW_STOCK,
                    'subject_type' => 'inventory',
                    'subject_id' => $inventory->id,
                ]);
            }
        });
    }
}
