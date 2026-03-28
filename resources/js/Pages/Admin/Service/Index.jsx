import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ServiceIndex({ services }) {
    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus layanan ini?')) {
            router.delete(`/admin/services/${id}`);
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'Harga fleksibel';
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
    };

    return (
        <AdminLayout title="Layanan">
            <Head title="Layanan" />

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Daftar Layanan</h2>
                <Link
                    href="/admin/services/create"
                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    + Tambah Layanan
                </Link>
            </div>

            {services.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-400">
                    <p className="text-4xl mb-3">⚙️</p>
                    <p className="font-medium">Belum ada layanan</p>
                    <p className="text-sm mt-1">Tambahkan layanan pertama Anda.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3 text-left">Layanan</th>
                                <th className="px-6 py-3 text-left">Harga</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {services.map((service) => (
                                <tr key={service.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {service.icon && <span className="text-2xl">{service.icon}</span>}
                                            <div>
                                                <p className="font-medium text-gray-800">{service.title}</p>
                                                <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{service.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{formatPrice(service.price)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            service.is_active
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {service.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/services/${service.id}/edit`}
                                            className="text-indigo-600 hover:underline font-medium mr-4"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="text-red-600 hover:underline font-medium"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
