<?php

namespace App\Services;

use App\Models\Portfolio;
use App\Models\Service;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    private string $apiKey;
    private array $models;

    public function __construct()
    {
        $this->apiKey = config('gemini.api_key', '');
        $this->models = config('gemini.models', ['gemini-2.0-flash']);
    }

    public function buildSystemPrompt(string $userName = '', string $userPhone = ''): string
    {
        $settings = Setting::allAsArray();
        $siteName = $settings['site_name'] ?? config('app.name');
        $tagline  = $settings['site_tagline'] ?? '';
        $email     = $settings['email'] ?? '';
        $phone     = $settings['phone'] ?? '';
        $whatsapp  = $settings['whatsapp'] ?? '';
        $address   = $settings['address'] ?? '';

        $services = Service::where('is_active', true)->get(['title', 'description', 'price']);
        $serviceList = $services->map(fn($s) =>
            "- {$s->title}" . ($s->price ? " (Mulai dari Rp " . number_format($s->price, 0, ',', '.') . ")" : "") . ": {$s->description}"
        )->implode("\n");

        $portfolios = Portfolio::published()->latest()->take(10)->get(['title', 'description', 'technologies', 'client']);
        $portfolioList = $portfolios->map(fn($p) =>
            "- {$p->title}" . ($p->client ? " (Klien: {$p->client})" : "") .
            (count($p->technologies ?? []) ? " | Teknologi: " . implode(', ', $p->technologies) : "") .
            ": {$p->description}"
        )->implode("\n");

        return <<<PROMPT
Kamu adalah asisten virtual AI untuk *{$siteName}*, sebuah software house Indonesia profesional.
{$tagline}

== INFORMASI PERUSAHAAN ==
Nama      : {$siteName}
Email     : {$email}
Telepon   : {$phone}
WhatsApp  : {$whatsapp}
Alamat    : {$address}

== LAYANAN KAMI ==
{$serviceList}

== PORTFOLIO ==
{$portfolioList}

== PENGGUNA SAAT INI ==
Nama    : {$userName}
No. WA  : {$userPhone}

== INSTRUKSI ==
- Sapa pengguna dengan namanya ({$userName}) saat pertama kali menjawab.
- Jika ditanya nomor WA atau kontak perusahaan, sampaikan nomor WhatsApp: {$whatsapp}.
- Jawab pertanyaan seputar layanan, portfolio, harga, proses kerja, dan hal terkait {$siteName}.
- Gunakan bahasa yang sama dengan pengguna (Indonesia atau Inggris).
- Jika pengguna ingin order atau diskusi lebih lanjut, arahkan untuk mengisi form kontak di halaman ini.
- Jangan menjawab hal di luar konteks bisnis {$siteName}.
- Jawab dengan ramah, singkat, dan profesional.

== KEBIJAKAN HARGA ==
- Harga di atas hanyalah estimasi awal untuk project standar.
- Harga SANGAT bergantung pada kompleksitas dan fitur yang dibutuhkan — semakin kompleks, harga bisa jauh lebih tinggi dari estimasi.
- Contoh: aplikasi dengan fitur sederhana bisa mulai dari harga dasar, namun aplikasi enterprise, multi-role, integrasi banyak API, atau fitur khusus bisa bernilai puluhan hingga ratusan juta rupiah.
- Jangan memberikan angka pasti untuk project yang belum jelas spesifikasinya. Selalu sampaikan bahwa harga final ditentukan setelah diskusi dan analisis kebutuhan.
- Arahkan pengguna untuk menghubungi tim kami agar bisa mendapat penawaran yang akurat sesuai kebutuhan mereka.
PROMPT;
    }

    /**
     * @param array  $history  [['role' => 'user'|'model', 'content' => '...']]
     * @param string $userName  Nama pengguna untuk sapaan personal
     * @param string $userPhone Nomor WA pengguna
     */
    public function chat(array $history, string $userName = '', string $userPhone = ''): array
    {
        if (empty($this->apiKey)) {
            return ['success' => false, 'text' => 'API key Gemini belum dikonfigurasi.'];
        }

        $contents = array_map(fn($m) => [
            'role'  => $m['role'],
            'parts' => [['text' => $m['content']]],
        ], $history);

        $payload = [
            'system_instruction' => [
                'parts' => [['text' => $this->buildSystemPrompt($userName, $userPhone)]],
            ],
            'contents'           => $contents,
            'generationConfig'   => [
                'temperature'     => 0.7,
                'maxOutputTokens' => 1024,
            ],
        ];

        foreach ($this->models as $model) {
            $model    = trim($model);
            $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$this->apiKey}";

            try {
                $response = Http::timeout(30)->post($endpoint, $payload);
                $body     = $response->json();

                // Kena rate limit (429) atau quota habis — coba model berikutnya
                if ($response->status() === 429 || isset($body['error']['code']) && $body['error']['code'] === 429) {
                    Log::warning("[Gemini] Rate limit pada model {$model}, mencoba model berikutnya.");
                    continue;
                }

                $text = $body['candidates'][0]['content']['parts'][0]['text'] ?? null;

                if ($text) {
                    Log::info("[Gemini] Berhasil menggunakan model {$model}");
                    return ['success' => true, 'text' => $text];
                }

                $reason = $body['error']['message'] ?? 'Respons tidak dikenali.';
                Log::warning("[Gemini] Gagal pada model {$model}: {$reason}");
                continue;

            } catch (\Throwable $e) {
                Log::error("[Gemini] Exception pada model {$model}: " . $e->getMessage());
                continue;
            }
        }

        return ['success' => false, 'text' => 'Semua model AI sedang tidak tersedia. Silakan coba beberapa saat lagi.'];
    }
}
