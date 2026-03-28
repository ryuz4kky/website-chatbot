<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    private string $apiKey;
    private string $endpoint = 'https://api.fonnte.com/send';

    public function __construct()
    {
        $this->apiKey = config('fonnte.api_key', '');
    }

    // ── Format & Validasi ────────────────────────────────────────────

    /**
     * Ubah nomor ke format internasional Indonesia.
     * 08xxx → 628xxx, +628xxx → 628xxx
     */
    public function formatNumber(string $number): string
    {
        // Hapus semua karakter non-digit
        $number = preg_replace('/\D/', '', $number);

        if (str_starts_with($number, '0')) {
            return '62' . substr($number, 1);
        }

        if (str_starts_with($number, '62')) {
            return $number;
        }

        return '62' . $number;
    }

    /**
     * Validasi nomor WhatsApp Indonesia.
     * Panjang 10–15 digit setelah format.
     */
    public function isValidNumber(string $number): bool
    {
        $formatted = $this->formatNumber($number);
        // 628 diikuti 8-12 digit (total 11-15 karakter)
        return (bool) preg_match('/^628[1-9][0-9]{7,11}$/', $formatted);
    }

    // ── Core Send ────────────────────────────────────────────────────

    /**
     * Kirim pesan WhatsApp ke satu nomor.
     *
     * @return array{success: bool, message: string}
     */
    public function send(string $target, string $message): array
    {
        if (empty($this->apiKey)) {
            Log::warning('[Fonnte] API key belum dikonfigurasi di .env (FONNTE_API_KEY).');
            return ['success' => false, 'message' => 'API key tidak dikonfigurasi.'];
        }

        $target = $this->formatNumber($target);

        try {
            $response = Http::timeout(15)
                ->withHeaders(['Authorization' => $this->apiKey])
                ->post($this->endpoint, [
                    'target'  => $target,
                    'message' => $message,
                ]);

            $body = $response->json() ?? [];

            if ($response->successful() && ($body['status'] ?? false) === true) {
                Log::info("[Fonnte] Pesan terkirim ke {$target}");
                return ['success' => true, 'message' => 'Pesan berhasil dikirim.'];
            }

            $reason = $body['reason'] ?? $body['message'] ?? 'Unknown error';
            Log::warning("[Fonnte] Gagal kirim ke {$target}: {$reason}", ['body' => $body]);
            return ['success' => false, 'message' => $reason];

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error("[Fonnte] Timeout/koneksi gagal ke {$target}: " . $e->getMessage());
            return ['success' => false, 'message' => 'Timeout koneksi ke Fonnte API.'];
        } catch (\Throwable $e) {
            Log::error("[Fonnte] Exception ke {$target}: " . $e->getMessage());
            return ['success' => false, 'message' => 'Terjadi kesalahan sistem.'];
        }
    }

    // ── Notifikasi ───────────────────────────────────────────────────

    /**
     * Kirim notifikasi pesan baru ke Admin.
     */
    public function notifyAdmin(string $name, string $whatsapp, string $message): array
    {
        $adminNumber = config('fonnte.admin_number', '');

        if (empty($adminNumber)) {
            Log::warning('[Fonnte] ADMIN_WHATSAPP belum diset di .env.');
            return ['success' => false, 'message' => 'Nomor admin belum dikonfigurasi.'];
        }

        $siteName = config('app.name', 'Website');

        $text = implode("\n", [
            "🔔 *Pesan Baru dari {$siteName}*",
            "",
            "👤 Nama   : {$name}",
            "📱 No WA  : {$whatsapp}",
            "",
            "💬 *Pesan:*",
            $message,
            "",
            "⏰ " . now()->timezone('Asia/Jakarta')->format('d M Y, H:i') . " WIB",
        ]);

        return $this->send($adminNumber, $text);
    }

    /**
     * Kirim konfirmasi penerimaan pesan ke User.
     */
    public function notifyUser(string $name, string $whatsapp, string $message): array
    {
        $siteName = config('app.name', 'YZ Studio');

        $text = implode("\n", [
            "Halo *{$name}* 👋",
            "",
            "Terima kasih sudah menghubungi *{$siteName}*.",
            "",
            "Pesan Anda:",
            "_{$message}_",
            "",
            "Sudah kami terima ✅",
            "Mohon tunggu, admin kami akan segera membalas.",
            "",
            "— Tim {$siteName}",
        ]);

        return $this->send($whatsapp, $text);
    }

    // ── Bulk ─────────────────────────────────────────────────────────

    /**
     * Kirim ke admin & user sekaligus.
     *
     * @return array{admin: array, user: array}
     */
    public function notifyBoth(string $name, string $whatsapp, string $message): array
    {
        $adminResult = $this->notifyAdmin($name, $whatsapp, $message);
        $userResult  = $this->notifyUser($name, $whatsapp, $message);

        return [
            'admin' => $adminResult,
            'user'  => $userResult,
        ];
    }
}
