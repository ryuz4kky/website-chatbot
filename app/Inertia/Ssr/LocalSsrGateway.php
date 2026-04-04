<?php

namespace App\Inertia\Ssr;

use Exception;
use Illuminate\Foundation\Http\Middleware\Concerns\ExcludesPaths;
use Illuminate\Http\Client\StrayRequestException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Inertia\Ssr\ExcludesSsrPaths;
use Inertia\Ssr\Gateway;
use Inertia\Ssr\HasHealthCheck;
use Inertia\Ssr\Response;
use Inertia\Ssr\SsrErrorType;
use Inertia\Ssr\SsrException;
use Inertia\Ssr\SsrRenderFailed;

class LocalSsrGateway implements ExcludesSsrPaths, Gateway, HasHealthCheck
{
    use ExcludesPaths;

    protected $except = [];

    public function dispatch(array $page, ?Request $request = null): ?Response
    {
        $request ??= request();

        if (! $this->ssrIsEnabled($request)) {
            return null;
        }

        $url = rtrim(config('inertia.ssr.url', 'http://127.0.0.1:13714'), '/').'/render';

        try {
            $response = Http::post($url, $page);

            if ($response->failed()) {
                $this->handleSsrFailure($page, $response->json());

                return null;
            }

            if (! $data = $response->json()) {
                return null;
            }

            return new Response(
                implode("\n", $data['head'] ?? []),
                $data['body'] ?? ''
            );
        } catch (Exception $e) {
            if ($e instanceof StrayRequestException || $e instanceof SsrException) {
                throw $e;
            }

            $this->handleSsrFailure($page, [
                'error' => $e->getMessage(),
                'type' => 'connection',
            ]);

            return null;
        }
    }

    public function except(array|string $paths): void
    {
        $this->except = array_merge($this->except, Arr::wrap($paths));
    }

    public function isHealthy(): bool
    {
        try {
            return Http::get(rtrim(config('inertia.ssr.url', 'http://127.0.0.1:13714'), '/').'/health')->successful();
        } catch (Exception $e) {
            if ($e instanceof StrayRequestException) {
                throw $e;
            }

            return false;
        }
    }

    protected function ssrIsEnabled(Request $request): bool
    {
        return config('inertia.ssr.enabled', true) && ! $this->inExceptArray($request);
    }

    protected function handleSsrFailure(array $page, ?array $error): void
    {
        $event = new SsrRenderFailed(
            page: $page,
            error: $error['error'] ?? 'Unknown SSR error',
            type: SsrErrorType::fromString($error['type'] ?? null),
            hint: $error['hint'] ?? null,
            browserApi: $error['browserApi'] ?? null,
            stack: $error['stack'] ?? null,
            sourceLocation: $error['sourceLocation'] ?? null,
        );

        SsrRenderFailed::dispatch(
            $event->page,
            $event->error,
            $event->type,
            $event->hint,
            $event->browserApi,
            $event->stack,
            $event->sourceLocation,
        );

        if (config('inertia.ssr.throw_on_error', false)) {
            throw SsrException::fromEvent($event);
        }
    }
}
