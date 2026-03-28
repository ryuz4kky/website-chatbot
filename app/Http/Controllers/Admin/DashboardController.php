<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Portfolio;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'portfolios'      => Portfolio::count(),
                'services'        => Service::count(),
                'messages'        => Message::count(),
                'unread_messages' => Message::where('is_read', false)->count(),
            ],
        ]);
    }
}
