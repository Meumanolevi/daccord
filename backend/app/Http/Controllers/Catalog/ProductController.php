<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->where('status', Product::STATUS_ACTIVE)
            ->whereHas('variants', fn ($query) => $query->where('active', true))
            ->with([
                'variants' => fn ($query) => $query->where('active', true)->with('inventory'),
                'ingredients',
            ]);

        $query->when($request->filled('search'), function ($query) use ($request): void {
            $search = '%'.str_replace(['%', '_'], ['\\%', '\\_'], $request->string('search')->trim()).'%';
            $query->where(fn ($query) => $query->where('name', 'like', $search)->orWhere('description', 'like', $search));
        });
        foreach (['category', 'needs', 'skin_types', 'preferences', 'textures'] as $filter) {
            $query->when($request->filled($filter), fn ($query) => $query->whereJsonContains($filter, $request->string($filter)->toString()));
        }

        $products = $query->orderByDesc('featured')->orderBy('name')->paginate(24)
            ->through(fn (Product $product): array => ProductResource::make($product)->resolve());

        return ApiResponse::success($products, 'Catálogo consultado.');
    }

    public function show(Product $product): JsonResponse
    {
        abort_unless($product->status === Product::STATUS_ACTIVE, 404);
        $product->load([
            'variants' => fn ($query) => $query->where('active', true)->with('inventory'),
            'ingredients',
        ]);

        return ApiResponse::success([
            'product' => ProductResource::make($product)->resolve(),
        ], 'Produto consultado.');
    }
}
