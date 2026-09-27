<?php

namespace Tests\Feature\Catalog;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class ProductCatalogTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_public_catalog_only_returns_active_products_with_active_variants(): void
    {
        $active = Product::factory()->create(['status' => Product::STATUS_ACTIVE, 'name' => 'Íris 01']);
        $variant = ProductVariant::factory()->create(['product_id' => $active->id, 'active' => true]);
        Inventory::query()->create([
            'product_variant_id' => $variant->id,
            'quantity_available' => 9,
            'low_stock_threshold' => 10,
        ]);
        Product::factory()->create(['status' => Product::STATUS_DRAFT, 'name' => 'Rascunho invisível']);

        $this->getJson('/api/v1/products')
            ->assertOk()
            ->assertJsonCount(1, 'data.data')
            ->assertJsonPath('data.data.0.name', 'Íris 01')
            ->assertJsonPath('data.data.0.total_stock', 9);
    }
}
