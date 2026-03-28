<?php

return [
    'api_key' => env('GEMINI_API_KEY', ''),

    // Model dicoba berurutan, kalau kena limit otomatis turun ke berikutnya
    'models' => array_filter(explode(',', env('GEMINI_MODELS', 'gemini-2.0-flash,gemini-1.5-flash,gemini-1.5-flash-8b'))),
];
