<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ChatSession;
use Inertia\Inertia;
use Inertia\Response;

class ChatSessionController extends Controller
{
    public function index(): Response
    {
        $sessions = ChatSession::withCount('messages')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Chat/Index', [
            'sessions' => $sessions,
        ]);
    }

    public function show(ChatSession $chatSession): Response
    {
        return Inertia::render('Admin/Chat/Show', [
            'session'  => $chatSession,
            'messages' => $chatSession->messages()->orderBy('created_at')->get(),
        ]);
    }

    public function destroy(ChatSession $chatSession)
    {
        $chatSession->delete();
        return back()->with('success', 'Sesi chat dihapus.');
    }
}
