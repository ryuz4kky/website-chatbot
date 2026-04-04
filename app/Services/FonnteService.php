<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FonnteService
{
    private string $token;
    private string $endpoint = 'https://whatsappbot.yusof.xyz/api/send-message';

    public function __construct()
    {
        $this->token = config('fonnte.api_key', '');
    }

    public function formatNumber(string $number): string
    {
        $number = preg_replace('/\D/', '', $number);

        if (str_starts_with($number, '0')) {
            return '62' . substr($number, 1);
        }

        if (str_starts_with($number, '62')) {
            return $number;
        }

        return '62' . $number;
    }

    public function isValidNumber(string $number): bool
    {
        return (bool) preg_match('/^628[1-9][0-9]{7,11}$/', $this->formatNumber($number));
    }

    public function send(string $target, string $message): array
    {
        if (empty($this->token)) {
            Log::warning('[WA] Token belum dikonfigurasi di .env (FONNTE_API_KEY).');
            return ['success' => false, 'message' => 'Token tidak dikonfigurasi.'];
        }

        $target = $this->formatNumber($target);

        try {
            $response = Http::timeout(15)->get($this->endpoint, [
                'token'   => $this->token,
                'target'  => $target,
                'message' => $message,
            ]);

            $body = $response->json() ?? [];

            if ($response->successful() && ($body['success'] ?? false) === true) {
                Log::info("[WA] Pesan terkirim ke {$target}");
                return ['success' => true, 'message' => 'Pesan berhasil dikirim.'];
            }

            $reason = $body['message'] ?? $body['error'] ?? 'Unknown error';
            Log::warning("[WA] Gagal kirim ke {$target}: {$reason}", ['body' => $body]);
            return ['success' => false, 'message' => $reason];

        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error("[WA] Timeout/koneksi gagal ke {$target}: " . $e->getMessage());
            return ['success' => false, 'message' => 'Timeout koneksi ke WA API.'];
        } catch (\Throwable $e) {
            Log::error("[WA] Exception ke {$target}: " . $e->getMessage());
            return ['success' => false, 'message' => 'Terjadi kesalahan sistem.'];
        }
    }

    public function notifyAdmin(string $name, string $whatsapp, string $message): array
    {
        $adminNumber = config('fonnte.admin_number', '');

        if (empty($adminNumber)) {
            Log::warning('[WA] ADMIN_WHATSAPP belum diset di .env.');
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

    public function notifyUser(string $name, string $whatsapp, string $message): array
    {
        $siteName  = config('app.name', 'YZ Studio');
        $firstName = explode(' ', trim($name))[0];

        $greetings = ["Halo", "Hai", "Hei"];
        $acks      = [
            "Pesannya sudah kami terima ✅",
            "Sudah masuk ya, terima kasih ✅",
            "Oke, sudah kami catat ✅",
        ];
        $responses = [
            "Tim kami akan segera menghubungi kamu.",
            "Kami akan segera merespons dalam waktu dekat.",
            "Tunggu ya, kami akan segera balas.",
        ];
        $closings = [
            "Salam,\n*Tim {$siteName}*",
            "Terima kasih,\n*{$siteName}*",
            "Salam hangat,\n*{$siteName}*",
        ];

        $text = implode("\n", [
            $greetings[array_rand($greetings)] . " *{$firstName}* 👋",
            "",
            "Terima kasih sudah menghubungi *{$siteName}*.",
            $acks[array_rand($acks)],
            "",
            $responses[array_rand($responses)],
            "",
            $closings[array_rand($closings)],
        ]);

        return $this->send($whatsapp, $text);
    }
}
