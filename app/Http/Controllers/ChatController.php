<?php

namespace App\Http\Controllers;

use App\Models\ChatSession;
use App\Services\GeminiService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function __construct(private GeminiService $gemini) {}

    public function init(Request $request): JsonResponse
    {
        $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'phone'   => ['required', 'string', 'max:20'],
            'message' => ['required', 'string', 'min:3', 'max:1000'],
        ]);

        // Simpan sesi user ke database
        $session = ChatSession::create([
            'name'  => trim($request->name),
            'phone' => trim($request->phone),
        ]);

        // Simpan pesan pertama user
        $session->messages()->create([
            'role'    => 'user',
            'content' => trim($request->message),
        ]);

        // Kirim ke Gemini dengan info pengguna
        $result = $this->gemini->chat(
            [['role' => 'user', 'content' => trim($request->message)]],
            $session->name,
            $session->phone
        );

        // Simpan balasan AI
        $session->messages()->create([
            'role'    => 'model',
            'content' => $result['text'],
        ]);

        return response()->json([
            'session_id' => $session->id,
            'reply'      => $result['text'],
        ]);
    }

    public function send(Request $request): JsonResponse
    {
        $request->validate([
            'session_id' => ['required', 'integer', 'exists:chat_sessions,id'],
            'message'    => ['required', 'string', 'min:1', 'max:1000'],
        ]);

        $session = ChatSession::findOrFail($request->session_id);

        // Simpan pesan user
        $session->messages()->create([
            'role'    => 'user',
            'content' => trim($request->message),
        ]);

        // Ambil riwayat untuk konteks (maks 20 pesan terakhir)
        $history = $session->messages()
            ->latest()
            ->take(20)
            ->get()
            ->reverse()
            ->map(fn($m) => ['role' => $m->role, 'content' => $m->content])
            ->values()
            ->toArray();

        // Kirim ke Gemini dengan info pengguna
        $result = $this->gemini->chat($history, $session->name, $session->phone);

        // Simpan balasan AI
        $session->messages()->create([
            'role'    => 'model',
            'content' => $result['text'],
        ]);

        return response()->json([
            'reply' => $result['text'],
        ]);
    }
}
