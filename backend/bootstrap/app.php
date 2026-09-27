<?php

use App\Http\Middleware\EnsurePasswordConfirmed;
use App\Http\Middleware\EnsureRole;
use App\Support\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();
        $middleware->authenticateSessions();
        $middleware->alias([
            'password.recent' => EnsurePasswordConfirmed::class,
            'role' => EnsureRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
        $exceptions->render(fn (AuthenticationException $exception, Request $request) => ApiResponse::error('Sua sessão expirou. Entre novamente.', 401)
        );
        $exceptions->render(fn (AuthorizationException $exception, Request $request) => ApiResponse::error('Você não tem permissão para acessar este recurso.', 403)
        );
        $exceptions->render(fn (ModelNotFoundException $exception, Request $request) => ApiResponse::error('Recurso não encontrado.', 404)
        );
        $exceptions->render(fn (ThrottleRequestsException $exception, Request $request) => ApiResponse::error('Muitas tentativas. Aguarde antes de tentar novamente.', 429)
        );
        $exceptions->render(function (HttpExceptionInterface $exception, Request $request) {
            if (! $request->is('api/*') && ! $request->expectsJson()) {
                return null;
            }

            $status = $exception->getStatusCode();
            $message = $exception->getMessage() ?: match ($status) {
                419 => 'A sessão de segurança expirou. Atualize a página e tente novamente.',
                default => 'Não foi possível concluir a solicitação.',
            };

            return ApiResponse::error($message, $status);
        });
    })->create();
