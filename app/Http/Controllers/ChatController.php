<?php

namespace App\Http\Controllers;

use App\Models\ChatSession;
use App\Services\CohereService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function __construct(private CohereService $cohere) {}

    public function init(Request $request): JsonResponse
    {
        $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'min:3', 'max:1000'],
        ]);

        $message = trim($request->message);
        $session = ChatSession::create(['name' => trim($request->name)]);
        $session->messages()->create(['role' => 'user', 'content' => $message]);

        $result = $this->cohere->chat([['role' => 'user', 'content' => $message]], $session->name);

        $session->messages()->create(['role' => 'model', 'content' => $result['text']]);

        return response()->json(['session_id' => $session->id, 'reply' => $result['text']]);
    }

    public function send(Request $request): JsonResponse
    {
        $request->validate([
            'session_id' => ['required', 'integer', 'exists:chat_sessions,id'],
            'message'    => ['required', 'string', 'min:1', 'max:1000'],
        ]);

        $session = ChatSession::findOrFail($request->session_id);
        $session->messages()->create(['role' => 'user', 'content' => trim($request->message)]);

        $history = $session->messages()
            ->latest()->take(20)->get()
            ->reverse()
            ->map(fn($m) => ['role' => $m->role, 'content' => $m->content])
            ->values()->toArray();

        $result = $this->cohere->chat($history, $session->name);

        $session->messages()->create(['role' => 'model', 'content' => $result['text']]);

        return response()->json(['reply' => $result['text']]);
    }
}
