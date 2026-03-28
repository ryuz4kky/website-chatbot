import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function PortfolioIndex({ portfolios }) {
    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus portfolio ini?')) {
            router.delete(`/admin/portfolios/${id}`);
        }
    };

    return (
        <AdminLayout title="Portfolio">
            <Head title="Portfolio" />

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Daftar Portfolio</h2>
                <Link
                    href="/admin/portfolios/create"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + Tambah Portfolio
                </Link>
            </div>

            {portfolios.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
                    <p className="text-4xl mb-3">🗂️</p>
                    <p className="font-medium">Belum ada portfolio</p>
                    <p className="text-sm mt-1">Tambahkan portfolio pertama Anda.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map((portfolio) => (
                        <div key={portfolio.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            {portfolio.image && (
                                <img
                                    src={`/storage/${portfolio.image}`}
                                    alt={portfolio.title}
                                    className="w-full h-40 object-cover"
                                />
                            )}
                            {!portfolio.image && (
                                <div className="w-full h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-4xl">
                                    🖼️
                                </div>
                            )}
                            <div className="p-5">
                                <h3 className="font-semibold text-gray-800 truncate">{portfolio.title}</h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{portfolio.description}</p>

                                {portfolio.technologies && portfolio.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {portfolio.technologies.map((tech, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-xs text-gray-400">
                                        {new Date(portfolio.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                                    </span>
                                    <div className="flex gap-2">
                                        {portfolio.demo_link && (
                                            <a
                                                href={portfolio.demo_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-blue-600 hover:underline"
                                            >
                                                Demo ↗
                                            </a>
                                        )}
                                        <Link
                                            href={`/admin/portfolios/${portfolio.id}/edit`}
                                            className="text-xs text-indigo-600 hover:underline font-medium"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(portfolio.id)}
                                            className="text-xs text-red-600 hover:underline font-medium"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
