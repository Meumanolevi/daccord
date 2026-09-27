<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductVariantRequest;
use App\Http\Requests\UpdateProductVariantRequest;
use App\Http\Resources\ProductVariantResource;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\LowStockNotificationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ProductVariantController extends Controller
{
    public function store(StoreProductVariantRequest $request, LowStockNotificationService $lowStockNotifications, Product $product): JsonResponse
    {
        $payload = $request->validated();
        $quantity = Arr::pull($payload, 'quantity_available');
        $threshold = Arr::pull($payload, 'low_stock_threshold');

        $variant = DB::transaction(function () use ($product, $payload, $quantity, $threshold, $request, $lowStockNotifications): ProductVariant {
            $variant = $product->variants()->create($payload);
            $inventory = $variant->inventory()->create([
                'quantity_available' => $quantity,
                'low_stock_threshold' => $threshold,
                'updated_by' => $request->user()->id,
            ]);
            $inventory->movements()->create([
                'user_id' => $request->user()->id,
                'quantity_before' => 0,
                'adjustment' => $quantity,
                'quantity_after' => $quantity,
                'reason' => 'Saldo inicial da nova variação.',
            ]);
            $lowStockNotifications->synchronizeInventory($inventory->id);

            return $variant;
        });

        return ApiResponse::success([
            'variant' => ProductVariantResource::make($variant->load('inventory'))->resolve(),
        ], 'Variação cadastrada.', 201);
    }

    public function update(UpdateProductVariantRequest $request, Product $product, ProductVariant $variant): JsonResponse
    {
        abort_unless($variant->product_id === $product->id, 404);
        $variant->update($request->validated());

        return ApiResponse::success([
            'variant' => ProductVariantResource::make($variant->refresh()->load('inventory'))->resolve(),
        ], 'Variação atualizada.');
    }

    public function destroy(Product $product, ProductVariant $variant): JsonResponse
    {
        abort_unless($variant->product_id === $product->id, 404);
        if ($product->variants()->count() <= 1) {
            return ApiResponse::error('O produto precisa manter pelo menos uma variação.', 409);
        }

        $variant->delete();

        return ApiResponse::success(null, 'Variação excluída.');
    }
}
