import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function StatCard({ label, value, icon, color }) {
    return (
        <div className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{label}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
                </div>
                <span className="text-4xl">{icon}</span>
            </div>
        </div>
    );
}

export default function Dashboard({ stats }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Selamat datang! 👋</h2>
                <p className="text-gray-500 mt-1 text-sm">Berikut ringkasan data website Anda.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Total Portfolio"
                    value={stats.portfolios}
                    icon="🗂️"
                    color="border-indigo-500"
                />
                <StatCard
                    label="Total Layanan"
                    value={stats.services}
                    icon="⚙️"
                    color="border-blue-500"
                />
                <StatCard
                    label="Total Pesan"
                    value={stats.messages}
                    icon="💬"
                    color="border-green-500"
                />
                <StatCard
                    label="Pesan Belum Dibaca"
                    value={stats.unread_messages}
                    icon="🔔"
                    color="border-red-500"
                />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Menu Cepat</h3>
                    <div className="space-y-3">
                        {[
                            { href: '/admin/portfolios/create', label: '+ Tambah Portfolio', color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100' },
                            { href: '/admin/services/create', label: '+ Tambah Layanan', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                            { href: '/admin/messages', label: '💬 Lihat Pesan Masuk', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                        ].map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className={`block px-4 py-3 rounded-lg font-medium text-sm transition-colors ${item.color}`}
                            >
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Informasi Sistem</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span>Framework</span>
                            <span className="font-medium text-gray-800">Laravel 13</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span>Frontend</span>
                            <span className="font-medium text-gray-800">Inertia.js + React</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-100">
                            <span>Styling</span>
                            <span className="font-medium text-gray-800">Tailwind CSS v4</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>WhatsApp API</span>
                            <span className="font-medium text-gray-800">Fonnte</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
