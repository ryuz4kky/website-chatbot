<?php

return [
    'api_key' => env('COHERE_API_KEY', ''),

    // Model dicoba berurutan, kalau kena limit otomatis turun ke berikutnya.
    'models' => array_filter(explode(',', env('COHERE_MODELS', 'command-a-03-2025,command-r-plus-08-2024,command-r-08-2024'))),
];