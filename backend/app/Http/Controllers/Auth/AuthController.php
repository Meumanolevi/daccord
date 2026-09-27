<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConfirmPasswordRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $role = Role::query()->where('slug', Role::USER)->firstOrFail();
        $user = User::query()->create([
            ...$request->safe()->only(['name', 'email', 'password']),
            'role_id' => $role->id,
        ]);

        event(new Registered($user));
        Auth::login($user);
        $request->session()->regenerate();

        return ApiResponse::success(
            ['user' => UserResource::make($user->load('role'))->resolve()],
            'Conta criada. Enviamos um link de confirmação para o seu e-mail.',
            201,
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->safe()->only(['email', 'password']);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return ApiResponse::error('E-mail ou senha incorretos.', 422, [
                'email' => ['E-mail ou senha incorretos.'],
            ]);
        }

        $request->session()->regenerate();
        $user = $request->user()->load('role');

        return ApiResponse::success(['user' => UserResource::make($user)->resolve()], 'Acesso realizado com sucesso.');
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        Auth::forgetGuards();

        return ApiResponse::success(null, 'Sessão encerrada com segurança.');
    }

    public function me(Request $request): JsonResponse
    {
        return ApiResponse::success([
            'user' => UserResource::make($request->user()->load('role'))->resolve(),
        ], 'Sessão ativa.');
    }

    public function confirmPassword(ConfirmPasswordRequest $request): JsonResponse
    {
        if (! Hash::check($request->string('password'), $request->user()->password)) {
            return ApiResponse::error('A senha informada não confere.', 422, [
                'password' => ['A senha informada não confere.'],
            ]);
        }

        $request->session()->passwordConfirmed();

        return ApiResponse::success(null, 'Senha confirmada.');
    }
}
