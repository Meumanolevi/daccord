<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\ApiResponse;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    public function verify(Request $request, int $id, string $hash): JsonResponse
    {
        $user = User::query()->findOrFail($id);

        if (! hash_equals($hash, sha1($user->getEmailForVerification()))) {
            return ApiResponse::error('Este link de confirmação é inválido.', 403);
        }

        if (! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            event(new Verified($user));
        }

        return ApiResponse::success(null, 'E-mail confirmado com sucesso.');
    }

    public function resend(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return ApiResponse::error('Este e-mail já foi confirmado.', 409);
        }

        $request->user()->sendEmailVerificationNotification();

        return ApiResponse::success(null, 'Um novo link de confirmação foi enviado.', 202);
    }
}
