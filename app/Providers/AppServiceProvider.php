<?php

namespace App\Providers;

use App\Inertia\Ssr\LocalSsrGateway;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Inertia\Ssr\Gateway;
use Inertia\Ssr\SsrRenderFailed;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        if ($this->app->environment('local')) {
            $this->app->bind(Gateway::class, LocalSsrGateway::class);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Event::listen(SsrRenderFailed::class, function (SsrRenderFailed $event): void {
            Log::error('Inertia SSR render failed', [
                'component' => $event->page['component'] ?? null,
                'url' => $event->page['url'] ?? null,
                'type' => $event->type?->value,
                'error' => $event->error,
                'hint' => $event->hint,
                'browserApi' => $event->browserApi,
                'sourceLocation' => $event->sourceLocation,
                'stack' => $event->stack,
            ]);
        });
    }
}
