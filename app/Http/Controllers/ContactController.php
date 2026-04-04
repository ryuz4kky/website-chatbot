<?php

namespace App\Http\Controllers;

use App\Jobs\SendUserWhatsApp;
use App\Models\Message;
use App\Models\Portfolio;
use App\Models\Service;
use App\Services\FonnteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function __construct(private FonnteService $fonnte) {}

    public function index(): Response
    {
        return Inertia::render('Contact', [
            'portfolios' => Portfolio::published()->latest()
                ->get(['id', 'slug', 'title', 'description', 'image', 'demo_link', 'technologies', 'date']),
            'services' => Service::where('is_active', true)
                ->get(['id', 'title', 'description', 'icon', 'price']),
        ]);
    }

    public function store(Request $request)
    {
        // ── 1. Validasi ──────────────────────────────────────────────
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255', 'regex:/^[\pL\s\-\.]+$/u'],
            'whatsapp' => ['required', 'string', 'max:20'],
            'message'  => ['required', 'string', 'min:10', 'max:2000'],
        ], [
            'name.required'     => 'Nama wajib diisi.',
            'name.regex'        => 'Nama hanya boleh berisi huruf dan spasi.',
            'whatsapp.required' => 'Nomor WhatsApp wajib diisi.',
            'message.required'  => 'Pesan wajib diisi.',
            'message.min'       => 'Pesan minimal 10 karakter.',
            'message.max'       => 'Pesan maksimal 2000 karakter.',
        ]);

        // ── 2. Simpan ke database ────────────────────────────────────
        $msg = Message::create([
            'name'     => trim($validated['name']),
            'whatsapp' => trim($validated['whatsapp']),
            'message'  => trim($validated['message']),
        ]);

        // ── 3. Notifikasi WA ke Admin ────────────────────────────────
        $result = $this->fonnte->notifyAdmin($msg->name, $msg->whatsapp, $msg->message);

        if ($result['success']) {
            $msg->wa_sent = true;
        } else {
            $msg->wa_error = $result['message'];
            Log::warning("[Contact] WA admin gagal untuk pesan #{$msg->id}", $result);
        }

        $msg->save();

        // ── 4. Kirim konfirmasi ke User (delay acak, hanya jam kerja) ─
        $delay = rand(45, 120); // 45–120 detik setelah admin
        SendUserWhatsApp::dispatch($msg->name, $msg->whatsapp, $msg->message)
            ->delay(now()->addSeconds($delay));

        return back()->with('success', 'Pesan berhasil dikirim! Kami akan segera menghubungi Anda.');
    }
}
