<?php

namespace Tests\Feature\Admin;

use App\Models\AdminNotification;
use App\Models\Inventory;
use App\Models\ProductVariant;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Testing\TestResponse;
use Tests\TestCase;

class AdminNotificationsTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withHeader('Origin', 'http://localhost:3000');
        $this->seed(RoleSeeder::class);
    }

    public function test_low_stock_notifications_are_deduplicated_resolved_and_kept_as_history(): void
    {
        $admin = $this->createAdmin();
        $regularUser = User::factory()->create();
        $variant = ProductVariant::factory()->create();
        Inventory::query()->create([
            'product_variant_id' => $variant->id,
            'quantity_available' => 3,
            'low_stock_threshold' => 5,
        ]);

        $this->actingAs($admin)
            ->getJson('/api/v1/admin/notifications')
            ->assertOk()
            ->assertJsonPath('data.unread_count', 1)
            ->assertJsonPath('data.notifications.data.0.type', AdminNotification::TYPE_LOW_STOCK)
            ->assertJsonPath('data.notifications.data.0.target_url', "/admin/produtos/{$variant->product_id}");

        $this->assertDatabaseCount('admin_notifications', 1);
        $this->assertDatabaseHas('admin_notifications', ['admin_id' => $admin->id]);
        $this->assertDatabaseMissing('admin_notifications', ['admin_id' => $regularUser->id]);

        $this->adjustInventory($variant, $admin, 2)
            ->assertOk();
        $this->assertDatabaseCount('admin_notifications', 1);

        $this->adjustInventory($variant, $admin, 8)
            ->assertOk();
        $this->assertNotNull(AdminNotification::query()->where('admin_id', $admin->id)->firstOrFail()->resolved_at);

        $this->adjustInventory($variant, $admin, 5)
            ->assertOk();
        $this->adjustInventory($variant, $admin, 4)
            ->assertOk();
        $this->assertDatabaseCount('admin_notifications', 2);
        $this->assertSame(1, AdminNotification::query()->whereNull('resolved_at')->count());
        $this->assertSame(1, AdminNotification::query()->whereNotNull('resolved_at')->count());
    }

    public function test_admin_can_mark_only_their_notifications_as_read(): void
    {
        $firstAdmin = $this->createAdmin();
        $secondAdmin = $this->createAdmin();
        $variants = ProductVariant::factory()->count(2)->create();
        foreach ($variants as $variant) {
            Inventory::query()->create([
                'product_variant_id' => $variant->id,
                'quantity_available' => 1,
                'low_stock_threshold' => 5,
            ]);
        }

        $this->actingAs($firstAdmin)->getJson('/api/v1/admin/notifications')->assertOk();
        $firstNotification = AdminNotification::query()->where('admin_id', $firstAdmin->id)->firstOrFail();
        $secondNotification = AdminNotification::query()->where('admin_id', $secondAdmin->id)->firstOrFail();

        $this->actingAs($firstAdmin)
            ->patchJson("/api/v1/admin/notifications/{$secondNotification->id}/read")
            ->assertNotFound();

        $this->patchJson("/api/v1/admin/notifications/{$firstNotification->id}/read")
            ->assertOk()
            ->assertJsonPath('data.notification.id', $firstNotification->id)
            ->assertJsonStructure(['data' => ['notification' => ['read_at']]]);

        $this->patchJson('/api/v1/admin/notifications/read-all')->assertOk();
        $this->assertSame(0, AdminNotification::query()->where('admin_id', $firstAdmin->id)->whereNull('read_at')->count());
        $this->assertSame(2, AdminNotification::query()->where('admin_id', $secondAdmin->id)->whereNull('read_at')->count());
        $this->assertNotNull($firstNotification->fresh()->read_at);
        $this->assertNull($secondNotification->fresh()->read_at);
    }

    private function createAdmin(): User
    {
        $role = Role::query()->where('slug', Role::ADMIN)->firstOrFail();

        return User::factory()->create(['role_id' => $role->id]);
    }

    private function adjustInventory(ProductVariant $variant, User $admin, int $quantity): TestResponse
    {
        return $this->actingAs($admin)->patchJson("/api/v1/admin/inventory/{$variant->id}", [
            'quantity_available' => $quantity,
            'low_stock_threshold' => 5,
            'reason' => 'Ajuste de teste.',
        ]);
    }
}
