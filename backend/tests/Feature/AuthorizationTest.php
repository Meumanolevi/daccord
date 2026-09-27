<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withHeader('Origin', 'http://localhost:3000');
        $this->seed(RoleSeeder::class);
    }

    public function test_guest_and_regular_user_cannot_access_admin_routes(): void
    {
        $this->getJson('/api/v1/admin/users')->assertUnauthorized();

        $user = User::factory()->create();
        $this->actingAs($user)->getJson('/api/v1/admin/users')->assertForbidden();
    }

    public function test_admin_can_list_users_and_change_a_role_after_password_confirmation(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create();

        $this->actingAs($admin)
            ->getJson('/api/v1/admin/users')
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->withSession(['auth.password_confirmed_at' => time()])
            ->patchJson("/api/v1/admin/users/{$user->id}/role", ['role' => Role::ADMIN])
            ->assertOk()
            ->assertJsonPath('data.user.role', Role::ADMIN);

        $this->assertTrue($user->fresh()->hasRole(Role::ADMIN));
    }

    public function test_role_change_requires_recent_password_confirmation(): void
    {
        $admin = $this->admin();
        $user = User::factory()->create();

        $this->actingAs($admin)
            ->patchJson("/api/v1/admin/users/{$user->id}/role", ['role' => Role::ADMIN])
            ->assertStatus(423)
            ->assertJsonPath('success', false);
    }

    public function test_admin_cannot_remove_own_privileges(): void
    {
        $admin = $this->admin();

        $this->actingAs($admin)
            ->withSession(['auth.password_confirmed_at' => time()])
            ->patchJson("/api/v1/admin/users/{$admin->id}/role", ['role' => Role::USER])
            ->assertConflict();

        $this->assertTrue($admin->fresh()->hasRole(Role::ADMIN));
    }

    public function test_first_admin_can_be_created_by_the_interactive_command(): void
    {
        $this->artisan('admin:create', ['email' => 'admin@example.com'])
            ->expectsQuestion('Nome', 'Admin Principal')
            ->expectsQuestion('Senha (mínimo 12 caracteres, maiúscula, minúscula, número e símbolo)', 'SenhaAdminForte!42')
            ->expectsQuestion('Confirme a senha', 'SenhaAdminForte!42')
            ->expectsOutput('Administrador criado com sucesso.')
            ->assertSuccessful();

        $admin = User::query()->where('email', 'admin@example.com')->firstOrFail();
        $this->assertTrue($admin->hasRole(Role::ADMIN));
        $this->assertNotNull($admin->email_verified_at);
    }

    private function admin(): User
    {
        $role = Role::query()->where('slug', Role::ADMIN)->firstOrFail();

        return User::factory()->create(['role_id' => $role->id]);
    }
}
