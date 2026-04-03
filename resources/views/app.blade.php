<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#4f46e5" />
    <link rel="canonical" href="{{ url()->current() }}" />

    {{-- Favicon --}}
    @php $favicon = \App\Models\Setting::get('favicon'); @endphp
    @if($favicon)
        <link rel="icon" type="image/png" href="{{ asset('storage/' . $favicon) }}" />
    @else
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    @endif

    {{-- Preconnect untuk performa --}}
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="dns-prefetch" href="https://generativelanguage.googleapis.com" />

    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased bg-gray-50">
    @inertia
</body>
</html>
