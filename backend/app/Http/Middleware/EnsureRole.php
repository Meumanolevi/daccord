<?php

namespace App\Http\Middleware;

use App\Support\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        $user?->loadMissing('role');

        if (! $user || ! in_array($user->role?->slug, $roles, true)) {
            return ApiResponse::error('Você não tem permissão para acessar este recurso.', 403);
        }

        return $next($request);
    }
}
