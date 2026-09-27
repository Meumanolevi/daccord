<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::preventLazyLoading(! app()->isProduction());

        Password::defaults(fn () => Password::min(12)
            ->letters()
            ->mixedCase()
            ->numbers()
            ->symbols());

        RateLimiter::for('auth.login', fn (Request $request) => Limit::perMinute(5)->by(
            mb_strtolower((string) $request->input('email')).'|'.$request->ip(),
        ));
        RateLimiter::for('auth.register', fn (Request $request) => Limit::perMinute(3)->by($request->ip()));
        RateLimiter::for('auth.password', fn (Request $request) => Limit::perMinute(3)->by(
            mb_strtolower((string) $request->input('email')).'|'.$request->ip(),
        ));
        RateLimiter::for('auth.verify', fn (Request $request) => Limit::perMinute(6)->by(
            (string) ($request->user()?->id ?? $request->ip()),
        ));

        VerifyEmail::createUrlUsing(function (object $notifiable): string {
            $backendUrl = URL::temporarySignedRoute(
                'verification.verify',
                now()->addMinutes((int) config('auth.verification.expire', 60)),
                ['id' => $notifiable->getKey(), 'hash' => sha1($notifiable->getEmailForVerification())],
            );

            return rtrim((string) config('app.frontend_url'), '/')
                .'/verificar-email?verification_url='.rawurlencode($backendUrl);
        });

        ResetPassword::createUrlUsing(fn (object $notifiable, string $token): string => rtrim((string) config('app.frontend_url'), '/')
            .'/redefinir-senha?token='.rawurlencode($token)
            .'&email='.rawurlencode($notifiable->getEmailForPasswordReset())
        );
    }
}
