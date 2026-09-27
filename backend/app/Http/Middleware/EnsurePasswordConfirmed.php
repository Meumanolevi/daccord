<?php

namespace App\Http\Middleware;

use App\Support\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsurePasswordConfirmed
{
    public function handle(Request $request, Closure $next): Response
    {
        $confirmedAt = (int) $request->session()->get('auth.password_confirmed_at', 0);
        $timeout = (int) config('auth.password_timeout', 10800);

        if (now()->timestamp - $confirmedAt > $timeout) {
            return ApiResponse::error('Confirme sua senha antes de realizar esta ação.', 423);
        }

        return $next($request);
    }
}
