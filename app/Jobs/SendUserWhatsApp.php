<?php

namespace App\Jobs;

use App\Services\FonnteService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SendUserWhatsApp implements ShouldQueue
{
    use Queueable;

    public int $tries = 2;
    public int $timeout = 30;

    public function __construct(
        private string $name,
        private string $whatsapp,
        private string $message
    ) {}

    public function handle(FonnteService $fonnte): void
    {
        // Hanya kirim di jam kerja 08:00–20:00 WIB
        $hour = (int) now()->timezone('Asia/Jakarta')->format('H');

        if ($hour < 8 || $hour >= 20) {
            // Tunda ke jam 08:00 hari ini atau besok
            $nextOpen = now()->timezone('Asia/Jakarta')->startOfDay()->addHours(8);
            if ($hour >= 20) {
                $nextOpen->addDay();
            }
            $this->release((int) $nextOpen->diffInSeconds(now()));
            return;
        }

        $fonnte->notifyUser($this->name, $this->whatsapp, $this->message);
    }
}
