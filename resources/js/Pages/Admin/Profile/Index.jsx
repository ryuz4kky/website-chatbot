import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function Section({ title, description, children }) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">{title}</h3>
                {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
            </div>
            <div className="px-6 py-5 space-y-4">{children}</div>
        </div>
    );
}

function Field({ label, error, children }) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

function Input({ type = 'text', value, onChange, placeholder, autoComplete }) {
    return (
        <input
            type={type}
            value={value ?? ''}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
    );
}

function SaveButton({ processing, label = 'Simpan' }) {
    return (
        <button
            type="submit"
            disabled={processing}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
            {processing
                ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
                : label
            }
        </button>
    );
}

export default function ProfileIndex() {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    const infoForm = useForm({
        name:  user.name  ?? '',
        email: user.email ?? '',
    });

    const passForm = useForm({
        current_password:      '',
        password:              '',
        password_confirmation: '',
    });

    const submitInfo = (e) => {
        e.preventDefault();
        infoForm.patch('/admin/profile/info');
    };

    const submitPassword = (e) => {
        e.preventDefault();
        passForm.patch('/admin/profile/password', {
            onSuccess: () => passForm.reset(),
        });
    };

    return (
        <AdminLayout title="Profil">
            <Head title="Profil" />

            <div className="max-w-2xl space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Profil Akun</h2>
                    <p className="text-sm text-slate-500 mt-1">Ubah nama, email, dan password akun admin.</p>
                </div>

                {/* Flash info */}
                {flash?.success && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
                        ✓ {flash.success}
                    </div>
                )}
                {flash?.success_password && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
                        ✓ {flash.success_password}
                    </div>
                )}

                {/* ── Info ── */}
                <Section title="Informasi Akun" description="Nama dan email yang digunakan untuk login.">
                    <form onSubmit={submitInfo} className="space-y-4">
                        <Field label="Nama" error={infoForm.errors.name}>
                            <Input
                                value={infoForm.data.name}
                                onChange={e => infoForm.setData('name', e.target.value)}
                                placeholder="Admin"
                                autoComplete="name"
                            />
                        </Field>
                        <Field label="Email" error={infoForm.errors.email}>
                            <Input
                                type="email"
                                value={infoForm.data.email}
                                onChange={e => infoForm.setData('email', e.target.value)}
                                placeholder="admin@example.com"
                                autoComplete="email"
                            />
                        </Field>
                        <SaveButton processing={infoForm.processing} label="Simpan Informasi" />
                    </form>
                </Section>

                {/* ── Password ── */}
                <Section title="Ubah Password" description="Gunakan password yang kuat dan tidak mudah ditebak.">
                    <form onSubmit={submitPassword} className="space-y-4">
                        <Field label="Password Lama" error={passForm.errors.current_password}>
                            <Input
                                type="password"
                                value={passForm.data.current_password}
                                onChange={e => passForm.setData('current_password', e.target.value)}
                                autoComplete="current-password"
                            />
                        </Field>
                        <Field label="Password Baru" error={passForm.errors.password}>
                            <Input
                                type="password"
                                value={passForm.data.password}
                                onChange={e => passForm.setData('password', e.target.value)}
                                autoComplete="new-password"
                            />
                        </Field>
                        <Field label="Konfirmasi Password Baru" error={passForm.errors.password_confirmation}>
                            <Input
                                type="password"
                                value={passForm.data.password_confirmation}
                                onChange={e => passForm.setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                            />
                        </Field>
                        <SaveButton processing={passForm.processing} label="Ubah Password" />
                    </form>
                </Section>
            </div>
        </AdminLayout>
    );
}
