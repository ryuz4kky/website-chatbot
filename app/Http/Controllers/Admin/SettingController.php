<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    private array $fields = [
        'site_name', 'site_tagline', 'site_description',
        'logo', 'favicon',
        'email', 'phone', 'whatsapp', 'address',
        'instagram', 'facebook', 'twitter', 'linkedin', 'github',
        'footer_text',
        'stat1_value', 'stat1_label',
        'stat2_value', 'stat2_label',
        'stat3_value', 'stat3_label',
    ];

    public function index(): Response
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => Setting::allAsArray(),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'logo'    => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
            'favicon' => 'nullable|image|mimes:png,ico|max:512',
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $old = Setting::get('logo');
            if ($old) Storage::disk('public')->delete($old);

            $path = $request->file('logo')->store('settings', 'public');
            Setting::set('logo', $path);
        }

        // Handle favicon upload
        if ($request->hasFile('favicon')) {
            $old = Setting::get('favicon');
            if ($old) Storage::disk('public')->delete($old);

            $path = $request->file('favicon')->store('settings', 'public');
            Setting::set('favicon', $path);
        }

        // Simpan semua field teks
        $textFields = array_diff($this->fields, ['logo', 'favicon']);
        foreach ($textFields as $field) {
            if ($request->has($field)) {
                Setting::set($field, $request->input($field));
            }
        }

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
