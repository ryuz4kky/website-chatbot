<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Fonnte WhatsApp API Configuration
    |--------------------------------------------------------------------------
    |
    | Daftarkan akun di https://fonnte.com dan dapatkan API key Anda.
    | Set FONNTE_API_KEY dan ADMIN_WHATSAPP di file .env
    |
    */

    'api_key' => env('FONNTE_API_KEY', ''),

    'admin_number' => env('ADMIN_WHATSAPP', ''),

    'endpoint' => 'https://api.fonnte.com/send',
];
