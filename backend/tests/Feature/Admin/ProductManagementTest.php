<?php

namespace Tests\Feature\Admin;

use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class ProductManagementTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withHeader('Origin', 'http://localhost:3000');
        $this->seed(RoleSeeder::class);
    }

    public function test_only_admins_can_access_product_management(): void
    {
        $this->getJson('/api/v1/admin/products')->assertUnauthorized();

        $this->actingAs(User::factory()->create())
            ->getJson('/api/v1/admin/products')
            ->assertForbidden();
    }

    public function test_admin_can_create_view_and_update_a_product_with_stock(): void
    {
        $admin = $this->admin();

        $created = $this->actingAs($admin)
            ->postJson('/api/v1/admin/products', $this->payload())
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.product.base_sku', 'DA-TEST-001')
            ->assertJsonPath('data.product.variants.0.inventory.quantity_available', 15);

        $productId = $created->json('data.product.id');

        $this->getJson("/api/v1/admin/products/{$productId}")
            ->assertOk()
            ->assertJsonPath('data.product.name', 'Produto de teste');

        $this->patchJson("/api/v1/admin/products/{$productId}", [
            'name' => 'Produto atualizado',
            'ingredients' => [[
                'name' => 'Pantenol',
                'concentration' => '2%',
                'source' => 'Ficha v2',
                'review_status' => 'verified',
                'is_allergen' => false,
            ]],
        ])->assertOk()
            ->assertJsonPath('data.product.name', 'Produto atualizado')
            ->assertJsonPath('data.product.ai_status', 'review');

        $this->assertDatabaseHas('products', ['id' => $productId, 'name' => 'Produto atualizado']);
        $this->assertDatabaseHas('inventories', ['quantity_available' => 15]);
        $this->assertDatabaseHas('inventory_movements', ['quantity_before' => 0, 'quantity_after' => 15]);
    }

    public function test_product_deletion_requires_recent_password_confirmation(): void
    {
        $admin = $this->admin();
        $product = Product::factory()->create();

        $this->actingAs($admin)
            ->deleteJson("/api/v1/admin/products/{$product->id}")
            ->assertStatus(423);

        $this->withSession(['auth.password_confirmed_at' => time()])
            ->deleteJson("/api/v1/admin/products/{$product->id}")
            ->assertOk();

        $this->assertSoftDeleted($product);
    }

    private function admin(): User
    {
        $role = Role::query()->where('slug', Role::ADMIN)->firstOrFail();

        return User::factory()->create(['role_id' => $role->id]);
    }

    /** @return array<string, mixed> */
    private function payload(): array
    {
        return [
            'base_sku' => 'da-test-001',
            'name' => 'Produto de teste',
            'eyebrow' => 'Sérum',
            'description' => 'Descrição funcional do produto.',
            'status' => 'active',
            'category' => 'serum',
            'needs' => ['hidratacao'],
            'skin_types' => ['mista'],
            'preferences' => ['sem-fragrancia'],
            'textures' => ['leve'],
            'reasons' => ['Textura leve'],
            'tone' => '#8f3a66',
            'tone_soft' => '#ead0dc',
            'shape' => 'dropper',
            'featured' => true,
            'ai_status' => 'eligible',
            'ai_goals' => 'Hidratação',
            'ai_restrictions' => 'Alergia conhecida.',
            'ingredients' => [[
                'name' => 'Niacinamida',
                'concentration' => '4%',
                'source' => 'Ficha v1',
                'review_status' => 'verified',
                'is_allergen' => false,
            ]],
            'variants' => [[
                'sku' => 'da-test-001-30',
                'name' => '30 ml',
                'price_cents' => 12990,
                'active' => true,
                'position' => 0,
                'quantity_available' => 15,
                'low_stock_threshold' => 5,
            ]],
        ];
    }
}
