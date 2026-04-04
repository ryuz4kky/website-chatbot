<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Inertia\Inertia;
use Inertia\Response;

class PortfolioController extends Controller
{
    private const MAX_UPLOAD_KB = 10240;

    public function index(): Response
    {
        return Inertia::render('Admin/Portfolio/Index', [
            'portfolios' => Portfolio::latest()->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Portfolio/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'          => 'required|string|max:255',
            'description'    => 'required|string',
            'image'          => 'nullable|image|mimes:jpg,jpeg,png,webp|max:' . self::MAX_UPLOAD_KB,
            'gallery.*'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:' . self::MAX_UPLOAD_KB,
            'demo_link'      => 'nullable|url|max:255',
            'technologies'   => 'nullable|string',
            'date'           => 'required|date',
            'client'         => 'nullable|string|max:255',
            'status'         => 'in:draft,published',
        ]);

        if ($request->hasFile('image')) {
            $path = $this->processImage($request->file('image'));
            if (!$path) return back()->withErrors(['image' => 'Gagal memproses gambar utama.']);
            $validated['image'] = $path;
        }

        $validated['gallery']      = $this->processGallery($request);
        $validated['technologies'] = $this->parseTechnologies($validated['technologies'] ?? null);
        $validated['slug']         = Portfolio::makeUniqueSlug($validated['title']);

        Portfolio::create($validated);

        return redirect()->route('admin.portfolios.index')
            ->with('success', 'Portfolio berhasil ditambahkan.');
    }

    public function edit(Portfolio $portfolio): Response
    {
        $portfolio->technologies_string = implode(', ', $portfolio->technologies ?? []);
        return Inertia::render('Admin/Portfolio/Edit', compact('portfolio'));
    }

    public function update(Request $request, Portfolio $portfolio)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:' . self::MAX_UPLOAD_KB,
            'gallery.*'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:' . self::MAX_UPLOAD_KB,
            'demo_link'    => 'nullable|url|max:255',
            'technologies' => 'nullable|string',
            'date'         => 'required|date',
            'client'       => 'nullable|string|max:255',
            'status'       => 'in:draft,published',
            'delete_gallery' => 'nullable|array',
            'delete_gallery.*' => 'string',
        ]);

        // Gambar utama
        if ($request->hasFile('image')) {
            if ($portfolio->image) {
                Storage::disk('public')->delete($portfolio->image);
                $this->deleteLegacyPublicFile($portfolio->image);
            }
            $path = $this->processImage($request->file('image'));
            if (!$path) return back()->withErrors(['image' => 'Gagal memproses gambar utama.']);
            $validated['image'] = $path;
        } else {
            unset($validated['image']);
        }

        // Hapus gallery yang dipilih user
        $currentGallery = $portfolio->gallery ?? [];
        $toDelete = $validated['delete_gallery'] ?? [];
        foreach ($toDelete as $path) {
            Storage::disk('public')->delete($path);
            $this->deleteLegacyPublicFile($path);
            $currentGallery = array_values(array_filter($currentGallery, fn($g) => $g !== $path));
        }

        // Tambah gallery baru
        $newGallery = $this->processGallery($request);
        $validated['gallery'] = array_values(array_merge($currentGallery, $newGallery));

        $validated['technologies'] = $this->parseTechnologies($validated['technologies'] ?? null);
        $validated['slug'] = Portfolio::makeUniqueSlug($validated['title'], $portfolio->id);
        unset($validated['delete_gallery']);

        $portfolio->update($validated);

        return redirect()->route('admin.portfolios.index')
            ->with('success', 'Portfolio berhasil diperbarui.');
    }

    public function destroy(Portfolio $portfolio)
    {
        if ($portfolio->image) {
            Storage::disk('public')->delete($portfolio->image);
            $this->deleteLegacyPublicFile($portfolio->image);
        }
        foreach ($portfolio->gallery ?? [] as $img) {
            Storage::disk('public')->delete($img);
            $this->deleteLegacyPublicFile($img);
        }
        $portfolio->delete();

        return redirect()->route('admin.portfolios.index')
            ->with('success', 'Portfolio berhasil dihapus.');
    }

    // ── Helpers ─────────────────────────────────────────────

    private function processGallery(Request $request): array
    {
        $paths = [];
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $path = $this->processImage($file, 1280, 720);
                if ($path) $paths[] = $path;
            }
        }
        return $paths;
    }

    private function parseTechnologies(?string $value): array
    {
        return $value ? array_map('trim', explode(',', $value)) : [];
    }

    private function processImage(UploadedFile $file, int $w = 1280, int $h = 720): ?string
    {
        try {
            Storage::disk('public')->makeDirectory('portfolios');
            $manager  = new ImageManager(new Driver());
            $image    = $manager->read($file->getRealPath());
            $image->cover($w, $h);
            $filename = 'portfolios/' . Str::uuid() . '.webp';
            $image->toWebp(82)->save(storage_path('app/public/' . $filename));
            $this->mirrorToLegacyPublicPath($filename);
            return $filename;
        } catch (\Throwable $e) {
            Log::error('Portfolio image failed: ' . $e->getMessage());
            return null;
        }
    }

    private function mirrorToLegacyPublicPath(string $path): void
    {
        $source = Storage::disk('public')->path($path);
        $target = base_path('storage/'.$path);

        if (! File::exists($source)) {
            return;
        }

        File::ensureDirectoryExists(dirname($target));
        File::copy($source, $target);
    }

    private function deleteLegacyPublicFile(string $path): void
    {
        $target = base_path('storage/'.$path);

        if (File::exists($target)) {
            File::delete($target);
        }
    }
}
