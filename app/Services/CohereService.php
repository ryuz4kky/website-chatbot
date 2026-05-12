<?php

namespace App\Services;

use App\Models\Portfolio;
use App\Models\Service;
use App\Models\Setting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CohereService
{
    private string $apiKey;
    private array $models;

    public function __construct()
    {
        $this->apiKey = trim((string) config('cohere.api_key', ''));
        $this->models = $this->normalizeModels(config('cohere.models', ['command-r']));
    }

    public function buildSystemPrompt(string $userName = ''): string
    {
        $settings = Setting::allAsArray();
        $siteName = $settings['site_name'] ?? config('app.name');
        $tagline  = $settings['site_tagline'] ?? '';
        $email    = $settings['email'] ?? '';
        $phone    = $settings['phone'] ?? '';
        $whatsapp = $settings['whatsapp'] ?? '';
        $address  = $settings['address'] ?? '';

        $services = Service::where('is_active', true)->get(['title', 'description', 'price']);
        $serviceList = $services->map(fn($s) =>
            "- {$s->title}" . ($s->price ? " (Mulai dari Rp " . number_format($s->price, 0, ',', '.') . ")" : "") . ": {$s->description}"
        )->implode("\n");

        $portfolios = Portfolio::published()->latest()->take(10)->get(['title', 'description', 'technologies', 'client']);
        $portfolioList = $portfolios->map(fn($p) =>
            "- {$p->title}" . ($p->client ? " (Klien: {$p->client})" : '') .
            (count($p->technologies ?? []) ? ' | Teknologi: ' . implode(', ', $p->technologies) : '') .
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
Nama : {$userName}

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
- Harga SANGAT bergantung pada kompleksitas dan fitur yang dibutuhkan - semakin kompleks, harga bisa jauh lebih tinggi dari estimasi.
- Contoh: aplikasi dengan fitur sederhana bisa mulai dari harga dasar, namun aplikasi enterprise, multi-role, integrasi banyak API, atau fitur khusus bisa bernilai puluhan hingga ratusan juta rupiah.
- Jangan memberikan angka pasti untuk project yang belum jelas spesifikasinya. Selalu sampaikan bahwa harga final ditentukan setelah diskusi dan analisis kebutuhan.
- Arahkan pengguna untuk menghubungi tim kami agar bisa mendapat penawaran yang akurat sesuai kebutuhan mereka.
PROMPT;
    }

    public function chat(array $history, string $userName = ''): array
    {
        if (empty($this->apiKey)) {
            return ['success' => false, 'text' => 'API key Cohere belum dikonfigurasi.'];
        }

        if (empty($this->models)) {
            Log::warning('[Cohere] Tidak ada model chat yang valid setelah filtering config.');
            return ['success' => false, 'text' => 'Konfigurasi model AI tidak valid.'];
        }

        $messages = [
            [
                'role' => 'system',
                'content' => $this->buildSystemPrompt($userName),
            ],
        ];

        foreach ($history as $item) {
            $role = ($item['role'] ?? 'user') === 'user' ? 'user' : 'assistant';
            $content = trim((string) ($item['content'] ?? ''));

            if ($content === '') {
                continue;
            }

            $messages[] = [
                'role' => $role,
                'content' => $content,
            ];
        }

        foreach ($this->models as $model) {
            $payload = [
                'model' => $model,
                'messages' => $messages,
                'temperature' => 0.7,
                'max_tokens' => 1024,
            ];

            try {
                $response = Http::timeout(30)
                    ->withHeaders([
                        'Authorization' => 'Bearer ' . $this->apiKey,
                        'Content-Type' => 'application/json',
                    ])
                    ->post('https://api.cohere.com/v2/chat', $payload);

                $body = $response->json() ?? [];
                $errorMessage = $body['message'] ?? $body['error']['message'] ?? null;

                if ($response->status() === 429) {
                    Log::warning("[Cohere] Rate limit pada model {$model}, mencoba model berikutnya.");
                    continue;
                }

                if ($response->status() === 401) {
                    Log::error("[Cohere] API key tidak valid untuk model {$model}: {$errorMessage}");
                    return ['success' => false, 'text' => 'API key Cohere tidak valid. Periksa konfigurasi server.'];
                }

                if ($response->status() === 400 && $errorMessage && str_contains(strtolower($errorMessage), 'model')) {
                    Log::warning("[Cohere] Model {$model} tidak ditemukan/unsupported: {$errorMessage}");
                    continue;
                }

                $text = $this->extractText($body);

                if ($text) {
                    Log::info("[Cohere] Berhasil menggunakan model {$model}");
                    return ['success' => true, 'text' => $text];
                }

                $reason = $errorMessage ?? ('HTTP ' . $response->status() . ', respons tidak dikenali.');
                Log::warning("[Cohere] Gagal pada model {$model}: {$reason}");
            } catch (\Throwable $e) {
                Log::error("[Cohere] Exception pada model {$model}: " . $e->getMessage());
            }
        }

        return ['success' => false, 'text' => 'Semua model AI sedang tidak tersedia. Silakan coba beberapa saat lagi.'];
    }

    private function normalizeModels(array $models): array
    {
        $filtered = [];

        foreach ($models as $model) {
            $model = trim((string) $model);

            if ($model === '') {
                continue;
            }

            $filtered[] = $model;
        }

        return array_values(array_unique($filtered));
    }

    private function extractText(array $body): ?string
    {
        $text = $body['message']['content'][0]['text']
            ?? $body['text']
            ?? null;

        if (!is_string($text)) {
            return null;
        }

        $text = trim($text);

        return $text === '' ? null : $text;
    }
}