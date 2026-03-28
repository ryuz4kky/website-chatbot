<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'whatsapp',
        'message',
        'is_read',
        'wa_sent',
        'wa_user_sent',
        'wa_error',
    ];

    protected $casts = [
        'is_read'      => 'boolean',
        'wa_sent'      => 'boolean',
        'wa_user_sent' => 'boolean',
    ];
}
