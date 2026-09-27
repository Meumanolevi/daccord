<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    public function forgot(ForgotPasswordRequest $request): JsonResponse
    {
        Password::sendResetLink($request->safe()->only('email'));

        return ApiResponse::success(
            null,
            'Se a conta existir, enviaremos um link de recuperação.',
            202,
        );
    }

    public function reset(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->safe()->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                DB::table('sessions')->where('user_id', $user->id)->delete();
                event(new PasswordReset($user));
            },
        );

        if ($status !== Password::PasswordReset) {
            return ApiResponse::error('O link é inválido ou expirou.', 422, [
                'email' => ['Solicite um novo link de recuperação.'],
            ]);
        }

        return ApiResponse::success(null, 'Senha redefinida. Entre novamente com a nova senha.');
    }
}
