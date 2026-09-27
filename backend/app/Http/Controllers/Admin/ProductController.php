<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductSummaryResource;
use App\Models\Product;
use App\Services\LowStockNotificationService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()->with(['variants.inventory']);

        $query->when($request->filled('search'), function ($query) use ($request): void {
            $search = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $request->string('search')->trim()).'%';
            $query->where(function ($query) use ($search): void {
                $query->where('name', 'like', $search)
                    ->orWhere('base_sku', 'like', $search)
                    ->orWhereHas('variants', fn ($query) => $query->where('sku', 'like', $search));
            });
        });
        $query->when($request->filled('status') && $request->string('status')->toString() !== 'all',
            fn ($query) => $query->where('status', $request->string('status')));
        $query->when($request->filled('ai_status') && $request->string('ai_status')->toString() !== 'all',
            fn ($query) => $query->where('ai_status', $request->string('ai_status')));
        $query->when($request->string('stock')->toString() === 'out',
            fn ($query) => $query->whereHas('variants.inventory', fn ($query) => $query->where('quantity_available', 0)));
        $query->when($request->string('stock')->toString() === 'low',
            fn ($query) => $query->whereHas('variants.inventory', fn ($query) => $query
                ->where('quantity_available', '>', 0)
                ->whereColumn('quantity_available', '<=', 'low_stock_threshold')));

        $products = $query->orderByDesc('updated_at')->orderByDesc('id')->paginate(20)
            ->through(fn (Product $product): array => ProductSummaryResource::make($product)->resolve());

        return ApiResponse::success($products, 'Produtos consultados.');
    }

    public function store(StoreProductRequest $request, LowStockNotificationService $lowStockNotifications): JsonResponse
    {
        $payload = $request->validated();
        $variants = Arr::pull($payload, 'variants');
        $ingredients = Arr::pull($payload, 'ingredients', []);

        if (($payload['ai_status'] ?? 'review') === 'eligible' && ! $this->ingredientsAreVerified($ingredients)) {
            return ApiResponse::error('Para habilitar recomendações, informe uma composição totalmente verificada.', 422, [
                'ai_status' => ['A composição precisa estar totalmente verificada.'],
            ]);
        }

        $product = DB::transaction(function () use ($payload, $variants, $ingredients, $request, $lowStockNotifications): Product {
            $product = Product::query()->create($payload);
            $product->ingredients()->createMany($ingredients);

            foreach ($variants as $variantPayload) {
                $quantity = Arr::pull($variantPayload, 'quantity_available');
                $threshold = Arr::pull($variantPayload, 'low_stock_threshold');
                $variant = $product->variants()->create($variantPayload);
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
                    'reason' => 'Saldo inicial do cadastro do produto.',
                ]);
                $lowStockNotifications->synchronizeInventory($inventory->id);
            }

            return $product;
        });

        return ApiResponse::success([
            'product' => ProductResource::make($product->load(['variants.inventory', 'ingredients']))->resolve(),
        ], 'Produto cadastrado.', 201);
    }

    public function show(Product $product): JsonResponse
    {
        return ApiResponse::success([
            'product' => ProductResource::make($product->load(['variants.inventory', 'ingredients']))->resolve(),
        ], 'Produto consultado.');
    }

    public function update(UpdateProductRequest $request, Product $product): JsonResponse
    {
        $payload = $request->validated();
        $ingredients = Arr::pull($payload, 'ingredients');

        if ($ingredients !== null) {
            $payload['ai_status'] = 'review';
        } elseif (($payload['ai_status'] ?? $product->ai_status) === 'eligible') {
            $product->loadMissing('ingredients');
            if (! $this->ingredientsAreVerified($product->ingredients->toArray())) {
                return ApiResponse::error('Para habilitar recomendações, a composição precisa estar totalmente verificada.', 422, [
                    'ai_status' => ['A composição precisa estar totalmente verificada.'],
                ]);
            }
        }

        DB::transaction(function () use ($product, $payload, $ingredients): void {
            $product->update($payload);
            if ($ingredients !== null) {
                $product->ingredients()->delete();
                $product->ingredients()->createMany($ingredients);
            }
        });

        return ApiResponse::success([
            'product' => ProductResource::make($product->refresh()->load(['variants.inventory', 'ingredients']))->resolve(),
        ], $ingredients !== null
            ? 'Produto atualizado. A recomendação AI foi enviada para revisão.'
            : 'Produto atualizado.');
    }

    public function destroy(Product $product): JsonResponse
    {
        DB::transaction(function () use ($product): void {
            $product->variants()->delete();
            $product->delete();
        });

        return ApiResponse::success(null, 'Produto excluído.');
    }

    private function ingredientsAreVerified(array $ingredients): bool
    {
        return $ingredients !== [] && collect($ingredients)
            ->every(fn (array $ingredient): bool => ($ingredient['review_status'] ?? null) === 'verified');
    }
}
