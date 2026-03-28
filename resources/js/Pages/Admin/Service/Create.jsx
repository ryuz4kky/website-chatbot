import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ServiceCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        icon: '',
        price: '',
        is_active: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/services');
    };

    return (
        <AdminLayout title="Tambah Layanan">
            <Head title="Tambah Layanan" />

            <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <a href="/admin/services" className="text-gray-400 hover:text-gray-600 text-sm">← Kembali</a>
                    <h2 className="text-xl font-bold text-gray-800">Tambah Layanan</h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Layanan *</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                placeholder="Contoh: Pembuatan Website"
                            />
                            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                placeholder="Deskripsi layanan..."
                            />
                            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
                            <input
                                type="text"
                                value={data.icon}
                                onChange={(e) => setData('icon', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                placeholder="🌐"
                            />
                            <p className="mt-1 text-xs text-gray-400">Gunakan emoji sebagai ikon layanan</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                placeholder="500000 (kosongkan jika fleksibel)"
                                min="0"
                            />
                            {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <label htmlFor="is_active" className="text-sm text-gray-700 font-medium">
                                Layanan aktif (ditampilkan di website)
                            </label>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Layanan'}
                            </button>
                            <a
                                href="/admin/services"
                                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                            >
                                Batal
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
