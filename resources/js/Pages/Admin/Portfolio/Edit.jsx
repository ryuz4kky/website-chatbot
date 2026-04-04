import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function PortfolioEdit({ portfolio }) {
    const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);
    const [toDelete, setToDelete] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        _method:        'PUT',
        title:          portfolio.title,
        description:    portfolio.description,
        image:          null,
        gallery:        [],
        delete_gallery: [],
        demo_link:      portfolio.demo_link ?? '',
        technologies:   (portfolio.technologies ?? []).join(', '),
        date:           portfolio.date ? portfolio.date.substring(0, 10) : '',
        client:         portfolio.client ?? '',
        status:         portfolio.status ?? 'published',
    });

    const handleNewGallery = (e) => {
        const files = Array.from(e.target.files);
        setData('gallery', files);
        setNewGalleryPreviews(files.map(f => URL.createObjectURL(f)));
    };

    const toggleDelete = (path) => {
        const updated = toDelete.includes(path)
            ? toDelete.filter(p => p !== path)
            : [...toDelete, path];
        setToDelete(updated);
        setData('delete_gallery', updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/portfolios/${portfolio.id}`, { forceFormData: true });
    };

    const currentGallery = (portfolio.gallery ?? []).filter(g => g !== portfolio.image);

    return (
        <AdminLayout title="Edit Portfolio">
            <Head title="Edit Portfolio" />

            <div className="max-w-3xl">
                <div className="flex items-center gap-3 mb-6">
                    <a href="/admin/portfolios" className="text-slate-400 hover:text-slate-600 text-sm">← Kembali</a>
                    <h2 className="text-xl font-bold text-slate-800">Edit Portfolio</h2>
                    <a href={`/portfolio/${portfolio.slug || portfolio.id}`} target="_blank"
                        className="ml-auto text-xs text-indigo-600 hover:underline">
                        Lihat halaman ↗
                    </a>
                </div>

                <form onSubmit={submit} className="space-y-6">

                    {/* Informasi Dasar */}
                    <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
                        <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-3">
                            Informasi Dasar
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Judul *</label>
                                <input type="text" value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Client</label>
                                <input type="text" value={data.client}
                                    onChange={e => setData('client', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="PT. Maju Bersama" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal *</label>
                                <input type="date" value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Link Demo</label>
                                <input type="url" value={data.demo_link}
                                    onChange={e => setData('demo_link', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="https://..." />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                                <select value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Teknologi</label>
                            <input type="text" value={data.technologies}
                                onChange={e => setData('technologies', e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Laravel, React, MySQL" />
                            <p className="mt-1 text-xs text-slate-400">Pisahkan dengan koma</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Deskripsi *</label>
                            <textarea value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={5}
                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                            {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                        </div>
                    </div>

                    {/* Gambar */}
                    <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
                        <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-3">
                            Gambar
                        </h3>

                        {/* Cover */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Gambar Cover</label>
                            {portfolio.image && (
                                <div className="mb-3 rounded-xl overflow-hidden bg-slate-100 w-48" style={{ aspectRatio: '16/9' }}>
                                    <img src={`/storage/${portfolio.image}`} alt="Cover" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <input type="file" accept="image/jpeg,image/png,image/webp"
                                onChange={e => setData('image', e.target.files[0])}
                                className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                            <p className="mt-1 text-xs text-slate-400">Kosongkan jika tidak ingin mengganti cover.</p>
                            {errors.image && <p className="mt-1 text-xs text-red-600">{errors.image}</p>}
                        </div>

                        {/* Existing gallery */}
                        {currentGallery.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Gallery Saat Ini <span className="text-slate-400 font-normal">(centang untuk hapus)</span>
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {currentGallery.map((img, i) => {
                                        const marked = toDelete.includes(img);
                                        return (
                                            <div key={i}
                                                className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${marked ? 'border-red-500 opacity-50' : 'border-transparent'}`}
                                                style={{ aspectRatio: '16/9' }}
                                                onClick={() => toggleDelete(img)}
                                            >
                                                <img src={`/storage/${img}`} alt="" className="w-full h-full object-cover" />
                                                {marked && (
                                                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                                                        <span className="text-red-600 font-bold text-lg">✕</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {toDelete.length > 0 && (
                                    <p className="mt-2 text-xs text-red-600">{toDelete.length} gambar akan dihapus saat disimpan.</p>
                                )}
                            </div>
                        )}

                        {/* New gallery */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Tambah Foto Gallery
                            </label>
                            <input type="file" accept="image/jpeg,image/png,image/webp" multiple
                                onChange={handleNewGallery}
                                className="w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />

                            {newGalleryPreviews.length > 0 && (
                                <div className="mt-3 grid grid-cols-4 gap-2">
                                    {newGalleryPreviews.map((src, i) => (
                                        <div key={i} className="rounded-xl overflow-hidden bg-slate-100 ring-2 ring-indigo-400" style={{ aspectRatio: '16/9' }}>
                                            <img src={src} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button type="submit" disabled={processing}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
                            {processing
                                ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Menyimpan...</>
                                : '💾 Simpan Perubahan'
                            }
                        </button>
                        <a href="/admin/portfolios" className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                            Batal
                        </a>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
