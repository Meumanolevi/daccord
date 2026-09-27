<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdjustInventoryRequest;
use App\Http\Resources\InventoryResource;
use App\Models\Inventory;
use App\Models\ProductVariant;
use App\Services\LowStockNotificationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Inventory::query()->whereHas('variant.product')->with(['variant.product', 'updatedBy']);
        $query->when($request->filled('search'), function ($query) use ($request): void {
            $search = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $request->string('search')->trim()).'%';
            $query->whereHas('variant', fn ($query) => $query
                ->where('sku', 'like', $search)
                ->orWhereHas('product', fn ($query) => $query->where('name', 'like', $search)));
        });
        $query->when($request->string('status')->toString() === 'out', fn ($query) => $query->where('quantity_available', 0));
        $query->when($request->string('status')->toString() === 'low', fn ($query) => $query
            ->where('quantity_available', '>', 0)
            ->whereColumn('quantity_available', '<=', 'low_stock_threshold'));
        $query->when($request->string('status')->toString() === 'available', fn ($query) => $query
            ->whereColumn('quantity_available', '>', 'low_stock_threshold'));

        $inventories = $query->orderBy('quantity_available')->orderBy('id')->paginate(25)
            ->through(fn (Inventory $inventory): array => InventoryResource::make($inventory)->resolve());

        return ApiResponse::success($inventories, 'Estoque consultado.');
    }

    public function show(ProductVariant $variant): JsonResponse
    {
        $inventory = $variant->inventory()->with([
            'variant.product',
            'updatedBy',
            'movements' => fn ($query) => $query->with('user')->limit(20),
        ])->firstOrFail();

        return ApiResponse::success([
            'inventory' => InventoryResource::make($inventory)->resolve(),
        ], 'Saldo consultado.');
    }

    public function update(AdjustInventoryRequest $request, LowStockNotificationService $lowStockNotifications, ProductVariant $variant): JsonResponse
    {
        $inventory = DB::transaction(function () use ($variant, $request, $lowStockNotifications): Inventory {
            $inventory = Inventory::query()->where('product_variant_id', $variant->id)->lockForUpdate()->firstOrFail();
            $before = $inventory->quantity_available;
            $after = $request->integer('quantity_available');
            $inventory->update([
                'quantity_available' => $after,
                'low_stock_threshold' => $request->integer('low_stock_threshold', $inventory->low_stock_threshold),
                'updated_by' => $request->user()->id,
            ]);
            $inventory->movements()->create([
                'user_id' => $request->user()->id,
                'quantity_before' => $before,
                'adjustment' => $after - $before,
                'quantity_after' => $after,
                'reason' => $request->string('reason')->trim(),
            ]);
            $lowStockNotifications->synchronizeInventory($inventory->id);

            return $inventory;
        });

        return ApiResponse::success([
            'inventory' => InventoryResource::make($inventory->load(['variant.product', 'updatedBy']))->resolve(),
        ], 'Estoque atualizado.');
    }
}
