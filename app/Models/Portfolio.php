<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image',
        'gallery',
        'demo_link',
        'technologies',
        'date',
        'client',
        'status',
    ];

    protected $casts = [
        'technologies' => 'array',
        'gallery'      => 'array',
        'date'         => 'date',
    ];

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
