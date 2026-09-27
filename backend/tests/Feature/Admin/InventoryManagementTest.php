<?php

namespace Tests\Feature\Admin;

use App\Models\Inventory;
use App\Models\ProductVariant;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class InventoryManagementTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withHeader('Origin', 'http://localhost:3000');
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_filter_and_adjust_inventory_with_a_movement_record(): void
    {
        $role = Role::query()->where('slug', Role::ADMIN)->firstOrFail();
        $admin = User::factory()->create(['role_id' => $role->id]);
        $variant = ProductVariant::factory()->create();
        Inventory::query()->create([
            'product_variant_id' => $variant->id,
            'quantity_available' => 3,
            'low_stock_threshold' => 5,
        ]);

        $this->actingAs($admin)
            ->getJson('/api/v1/admin/inventory?status=low')
            ->assertOk()
            ->assertJsonCount(1, 'data.data');

        $this->patchJson("/api/v1/admin/inventory/{$variant->id}", [
            'quantity_available' => 18,
            'low_stock_threshold' => 6,
            'reason' => 'Entrada recebida do fornecedor.',
        ])->assertOk()
            ->assertJsonPath('data.inventory.quantity_available', 18)
            ->assertJsonPath('data.inventory.status', 'available');

        $this->assertDatabaseHas('inventory_movements', [
            'inventory_id' => $variant->inventory->id,
            'user_id' => $admin->id,
            'quantity_before' => 3,
            'adjustment' => 15,
            'quantity_after' => 18,
        ]);
    }
}
