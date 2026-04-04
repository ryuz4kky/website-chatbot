<?php echo '<?xml version="1.0" encoding="UTF-8"?>'; ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

    {{-- Halaman utama --}}
    <url>
        <loc>{{ url('/') }}</loc>
        <lastmod>{{ optional($portfolios->max('updated_at'))->toDateString() ?? now()->toDateString() }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>

    {{-- Portfolio detail --}}
    @foreach($portfolios as $portfolio)
    <url>
        <loc>{{ url('/portfolio/' . ($portfolio->slug ?: $portfolio->id)) }}</loc>
        <lastmod>{{ $portfolio->updated_at->toDateString() }}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    @endforeach

</urlset>
