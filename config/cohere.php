<?php

return [
    'api_key' => env('COHERE_API_KEY', ''),

    // Model dicoba berurutan, kalau kena limit otomatis turun ke berikutnya.
    'models' => array_filter(explode(',', env('COHERE_MODELS', 'command-r-plus,command-r'))),
];