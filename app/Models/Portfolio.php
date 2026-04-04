<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
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

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function resolveRouteBinding($value, $field = null): ?Model
    {
        $field ??= $this->getRouteKeyName();

        if ($field === 'slug') {
            return $this->where('slug', $value)
                ->orWhere('id', $value)
                ->first();
        }

        return parent::resolveRouteBinding($value, $field);
    }

    public static function makeUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base !== '' ? $base : 'portfolio';
        $original = $slug;
        $counter = 2;

        while (
            static::query()
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = "{$original}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
