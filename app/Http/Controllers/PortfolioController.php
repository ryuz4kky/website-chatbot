<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    public function show(Portfolio $portfolio): Response
    {
        abort_if($portfolio->status !== 'published', 404);

        $related = Portfolio::published()
            ->where('id', '!=', $portfolio->id)
            ->latest()
            ->take(3)
            ->get(['id', 'slug', 'title', 'image', 'technologies', 'date', 'demo_link']);

        return Inertia::render('Portfolio/Show', [
            'portfolio' => $portfolio,
            'related'   => $related,
        ]);
    }
}
