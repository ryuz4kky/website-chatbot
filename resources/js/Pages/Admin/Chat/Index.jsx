import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ChatIndex({ sessions }) {
    const destroy = (id) => {
        if (!confirm('Hapus sesi chat ini?')) return;
        router.delete(`/admin/chats/${id}`);
    };

    return (
        <AdminLayout title="Chat AI">
            <Head title="Chat AI" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Sesi Chat AI</h2>
                        <p className="text-sm text-slate-500 mt-1">Percakapan pengunjung dengan chatbot.</p>
                    </div>
                    <span className="text-sm text-slate-400">{sessions.total} sesi</span>
                </div>

                {sessions.data.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <p className="text-4xl mb-3">💬</p>
                        <p className="text-slate-500 text-sm">Belum ada sesi chat.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">No. HP</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pesan</th>
                                    <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Waktu</th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {sessions.data.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3.5 font-medium text-slate-800">{s.name}</td>
                                        <td className="px-5 py-3.5 text-slate-500">{s.phone}</td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                                                💬 {s.messages_count} pesan
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-slate-400 text-xs">
                                            {new Date(s.created_at).toLocaleString('id-ID', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                                        </td>
                                        <td className="px-5 py-3.5 text-right space-x-2">
                                            <Link
                                                href={`/admin/chats/${s.id}`}
                                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                                            >
                                                Lihat
                                            </Link>
                                            <button
                                                onClick={() => destroy(s.id)}
                                                className="text-xs text-red-400 hover:text-red-600 font-medium"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {sessions.last_page > 1 && (
                            <div className="px-5 py-3 border-t border-slate-100 flex gap-2">
                                {sessions.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url ?? '#'}
                                        className={`px-3 py-1 text-xs rounded-lg ${
                                            link.active
                                                ? 'bg-indigo-600 text-white'
                                                : 'text-slate-500 hover:bg-slate-100'
                                        } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
