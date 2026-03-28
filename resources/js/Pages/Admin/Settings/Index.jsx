import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useState } from 'react';

function Section({ title, description, children }) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">{title}</h3>
                {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
            </div>
            <div className="px-6 py-5 space-y-5">{children}</div>
        </div>
    );
}

function Field({ label, hint, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            {children}
            {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

function Input({ value, onChange, placeholder, type = 'text' }) {
    return (
        <input
            type={type}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
    );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
    return (
        <textarea
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
    );
}

function LogoUpload({ label, hint, currentPath, name, onChange, error }) {
    const [preview, setPreview] = useState(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        onChange(file);
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const displaySrc = preview || (currentPath ? `/storage/${currentPath}` : null);

    return (
        <Field label={label} hint={hint} error={error}>
            <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                    {displaySrc
                        ? <img src={displaySrc} alt={label} className="w-full h-full object-contain p-1" />
                        : <span className="text-2xl text-slate-300">🖼️</span>
                    }
                </div>
                <div className="flex-1">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg cursor-pointer transition-colors">
                        📁 Pilih File
                        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    </label>
                    {displaySrc && !preview && (
                        <p className="mt-1.5 text-xs text-slate-400 truncate max-w-xs">{currentPath}</p>
                    )}
                    {preview && (
                        <p className="mt-1.5 text-xs text-green-600">✓ File baru dipilih — belum disimpan</p>
                    )}
                </div>
            </div>
        </Field>
    );
}

export default function SettingsIndex({ settings }) {
    const { data, setData, post, processing, errors } = useForm({
        // Identitas
        site_name:        settings.site_name ?? '',
        site_tagline:     settings.site_tagline ?? '',
        site_description: settings.site_description ?? '',
        logo:             null,
        favicon:          null,
        // Kontak
        email:     settings.email ?? '',
        phone:     settings.phone ?? '',
        whatsapp:  settings.whatsapp ?? '',
        address:   settings.address ?? '',
        // Sosmed
        instagram: settings.instagram ?? '',
        facebook:  settings.facebook ?? '',
        twitter:   settings.twitter ?? '',
        linkedin:  settings.linkedin ?? '',
        github:    settings.github ?? '',
        // Footer
        footer_text: settings.footer_text ?? '',
        // Statistik Hero
        stat1_value: settings.stat1_value ?? '50+',
        stat1_label: settings.stat1_label ?? 'Project Selesai',
        stat2_value: settings.stat2_value ?? '98%',
        stat2_label: settings.stat2_label ?? 'Client Puas',
        stat3_value: settings.stat3_value ?? '3 Thn',
        stat3_label: settings.stat3_label ?? 'Pengalaman',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/settings', { forceFormData: true });
    };

    return (
        <AdminLayout title="Pengaturan">
            <Head title="Pengaturan" />

            <div className="max-w-3xl">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Pengaturan Website</h2>
                    <p className="text-sm text-slate-500 mt-1">Kelola informasi dan identitas website Anda.</p>
                </div>

                <form onSubmit={submit} className="space-y-6">

                    {/* ── Identitas & Logo ── */}
                    <Section title="Identitas & Logo" description="Nama, tagline, dan logo yang tampil di website.">
                        <LogoUpload
                            label="Logo"
                            hint="PNG/SVG transparan, maks 2MB. Disarankan min 200×60px."
                            currentPath={settings.logo}
                            onChange={(file) => setData('logo', file)}
                            error={errors.logo}
                        />
                        <LogoUpload
                            label="Favicon"
                            hint="PNG 32×32px atau 64×64px, maks 512KB."
                            currentPath={settings.favicon}
                            onChange={(file) => setData('favicon', file)}
                            error={errors.favicon}
                        />
                        <Field label="Nama Website *">
                            <Input
                                value={data.site_name}
                                onChange={e => setData('site_name', e.target.value)}
                                placeholder="YZ Studio"
                            />
                        </Field>
                        <Field label="Tagline" hint="Slogan singkat yang muncul di hero section.">
                            <Input
                                value={data.site_tagline}
                                onChange={e => setData('site_tagline', e.target.value)}
                                placeholder="Building digital products that matter."
                            />
                        </Field>
                        <Field label="Deskripsi Website" hint="Untuk meta description SEO (~150 karakter).">
                            <Textarea
                                value={data.site_description}
                                onChange={e => setData('site_description', e.target.value)}
                                placeholder="Software house Indonesia spesialis website dan aplikasi web modern."
                            />
                        </Field>
                    </Section>

                    {/* ── Kontak ── */}
                    <Section title="Informasi Kontak" description="Ditampilkan di section kontak dan footer.">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field label="Email">
                                <Input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="hello@yzstudio.dev"
                                />
                            </Field>
                            <Field label="Nomor Telepon">
                                <Input
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    placeholder="+62 21-1234-5678"
                                />
                            </Field>
                            <Field label="Nomor WhatsApp" hint="Format: 628xxx (tanpa + atau spasi)">
                                <Input
                                    value={data.whatsapp}
                                    onChange={e => setData('whatsapp', e.target.value)}
                                    placeholder="6281234567890"
                                />
                            </Field>
                        </div>
                        <Field label="Alamat">
                            <Textarea
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                placeholder="Jakarta, Indonesia"
                                rows={2}
                            />
                        </Field>
                    </Section>

                    {/* ── Sosial Media ── */}
                    <Section title="Media Sosial" description="Isi URL lengkap akun media sosial Anda.">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {[
                                { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/yourhandle' },
                                { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/yourpage' },
                                { key: 'twitter',   label: 'Twitter / X', placeholder: 'https://twitter.com/yourhandle' },
                                { key: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/yourprofile' },
                                { key: 'github',    label: 'GitHub',    placeholder: 'https://github.com/yourhandle' },
                            ].map(field => (
                                <Field key={field.key} label={field.label}>
                                    <Input
                                        value={data[field.key]}
                                        onChange={e => setData(field.key, e.target.value)}
                                        placeholder={field.placeholder}
                                    />
                                </Field>
                            ))}
                        </div>
                    </Section>

                    {/* ── Statistik ── */}
                    <Section title="Statistik Hero" description="Angka yang ditampilkan di bagian hero halaman utama.">
                        {[
                            { val: 'stat1_value', lbl: 'stat1_label', placeholderVal: '50+',   placeholderLbl: 'Project Selesai' },
                            { val: 'stat2_value', lbl: 'stat2_label', placeholderVal: '98%',   placeholderLbl: 'Client Puas' },
                            { val: 'stat3_value', lbl: 'stat3_label', placeholderVal: '3 Thn', placeholderLbl: 'Pengalaman' },
                        ].map((s, i) => (
                            <div key={s.val} className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                                <Field label={`Statistik ${i + 1} — Nilai`}>
                                    <Input
                                        value={data[s.val]}
                                        onChange={e => setData(s.val, e.target.value)}
                                        placeholder={s.placeholderVal}
                                    />
                                </Field>
                                <Field label="Label">
                                    <Input
                                        value={data[s.lbl]}
                                        onChange={e => setData(s.lbl, e.target.value)}
                                        placeholder={s.placeholderLbl}
                                    />
                                </Field>
                            </div>
                        ))}
                    </Section>

                    {/* ── Footer ── */}
                    <Section title="Footer" description="Teks copyright yang muncul di footer website.">
                        <Field label="Teks Footer" hint="Tahun akan otomatis ditambahkan di depan teks ini.">
                            <Input
                                value={data.footer_text}
                                onChange={e => setData('footer_text', e.target.value)}
                                placeholder="YZ Studio. All rights reserved."
                            />
                        </Field>
                    </Section>

                    {/* Save button */}
                    <div className="flex items-center gap-4 pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {processing
                                ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
                                : '💾 Simpan Pengaturan'
                            }
                        </button>
                        <p className="text-xs text-slate-400">Perubahan langsung berlaku di website.</p>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
