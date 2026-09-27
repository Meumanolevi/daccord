<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use LazilyRefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withHeader('Origin', 'http://localhost:3000');
        $this->seed(RoleSeeder::class);
    }

    public function test_public_registration_creates_a_user_session_and_sends_verification(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Giulia Teste',
            'email' => 'GIULIA@example.com',
            'password' => 'SenhaMuitoForte!42',
            'password_confirmation' => 'SenhaMuitoForte!42',
            'terms' => true,
            'role' => Role::ADMIN,
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.user.email', 'giulia@example.com')
            ->assertJsonPath('data.user.role', Role::USER);

        $user = User::query()->where('email', 'giulia@example.com')->firstOrFail();
        $this->assertAuthenticatedAs($user);
        $this->assertTrue(Hash::check('SenhaMuitoForte!42', $user->password));
        Notification::assertSentTo($user, VerifyEmail::class);
    }

    public function test_registration_returns_422_for_a_duplicate_email(): void
    {
        User::factory()->create(['email' => 'existe@example.com']);

        $this->postJson('/api/v1/auth/register', [
            'name' => 'Nova Pessoa',
            'email' => 'EXISTE@example.com',
            'password' => 'SenhaMuitoForte!42',
            'password_confirmation' => 'SenhaMuitoForte!42',
            'terms' => true,
        ])->assertUnprocessable()
            ->assertJsonPath('success', false)
            ->assertJsonPath('errors.email.0', 'Já existe uma conta com este e-mail.');
    }

    public function test_registration_returns_422_for_a_weak_password(): void
    {
        $this->postJson('/api/v1/auth/register', [
            'name' => 'Nova Pessoa',
            'email' => 'nova@example.com',
            'password' => 'fraca',
            'password_confirmation' => 'fraca',
            'terms' => true,
        ])->assertUnprocessable()
            ->assertJsonPath('success', false)
            ->assertJsonPath('errors.password.0', 'A senha deve ter no mínimo 12 caracteres.');

        $this->assertDatabaseMissing('users', ['email' => 'nova@example.com']);
    }

    public function test_user_can_login_read_session_confirm_password_and_logout(): void
    {
        $user = User::factory()->create(['password' => 'SenhaMuitoForte!42']);

        $this->postJson('/api/v1/auth/login', [
            'email' => $user->email,
            'password' => 'SenhaMuitoForte!42',
            'remember' => true,
        ])->assertOk()->assertJsonPath('data.user.id', $user->id);

        $this->getJson('/api/v1/auth/me')->assertOk()->assertJsonPath('data.user.email', $user->email);
        $this->postJson('/api/v1/auth/confirm-password', ['password' => 'SenhaMuitoForte!42'])->assertOk();
        $this->postJson('/api/v1/auth/logout')->assertOk();
        $this->getJson('/api/v1/auth/me')->assertUnauthorized();
    }

    public function test_signed_verification_link_confirms_email(): void
    {
        $user = User::factory()->unverified()->create();
        $url = URL::temporarySignedRoute('verification.verify', now()->addHour(), [
            'id' => $user->id,
            'hash' => sha1($user->email),
        ]);

        $this->getJson($url)->assertOk()->assertJsonPath('success', true);
        $this->assertNotNull($user->fresh()->email_verified_at);
    }

    public function test_password_recovery_sends_link_and_resets_password(): void
    {
        Notification::fake();
        $user = User::factory()->create();
        $token = null;

        $this->postJson('/api/v1/auth/forgot-password', ['email' => $user->email])
            ->assertAccepted()
            ->assertJsonPath('success', true);

        Notification::assertSentTo($user, ResetPassword::class, function (ResetPassword $notification) use (&$token): bool {
            $token = $notification->token;

            return true;
        });

        $this->postJson('/api/v1/auth/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'OutraSenhaForte!84',
            'password_confirmation' => 'OutraSenhaForte!84',
        ])->assertOk();

        $this->assertTrue(Hash::check('OutraSenhaForte!84', $user->fresh()->password));
    }

    public function test_login_is_rate_limited(): void
    {
        for ($attempt = 0; $attempt < 5; $attempt++) {
            $this->postJson('/api/v1/auth/login', [
                'email' => 'missing@example.com',
                'password' => 'SenhaMuitoForte!42',
            ])->assertUnprocessable();
        }

        $this->postJson('/api/v1/auth/login', [
            'email' => 'missing@example.com',
            'password' => 'SenhaMuitoForte!42',
        ])->assertTooManyRequests()->assertJsonPath('success', false);
    }
}
