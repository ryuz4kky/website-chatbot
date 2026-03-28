import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const navItems = [
    { href: '/admin/dashboard',  label: 'Dashboard',   icon: '▦', exact: true },
    { href: '/admin/portfolios', label: 'Portfolio',    icon: '◈' },
    { href: '/admin/services',   label: 'Layanan',      icon: '◎' },
    { href: '/admin/messages',   label: 'Pesan',        icon: '◉' },
    { href: '/admin/chats',      label: 'Chat AI',      icon: '🤖' },
];

const settingItems = [
    { href: '/admin/profile',  label: 'Profil',      icon: '👤' },
    { href: '/admin/settings', label: 'Pengaturan',  icon: '⚙' },
];

export default function AdminLayout({ children, title }) {
    const { auth, flash, settings, url } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // usePage().url selalu reaktif saat Inertia navigasi
    const currentPath = usePage().url.split('?')[0];

    const isActive = (href, exact = false) =>
        exact ? currentPath === href : currentPath.startsWith(href);

    const handleLogout = () => router.post('/logout');

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* ── Sidebar ── */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col shrink-0
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:transform-none
            `}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-2 min-w-0">
                        {settings?.logo
                            ? <img src={`/storage/${settings.logo}`} alt="Logo" className="h-11 w-auto max-w-[160px] object-contain brightness-0 invert" />
                            : <span className="text-lg font-bold text-white tracking-tight">
                                {settings?.site_name
                                    ? <>{settings.site_name.split(' ')[0]}<span className="text-indigo-400">{settings.site_name.split(' ').slice(1).join(' ')}</span></>
                                    : <>YZ<span className="text-indigo-400">Studio</span></>
                                }
                              </span>
                        }
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        ✕
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                    <p className="px-3 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                        Menu
                    </p>
                    {navItems.map(item => {
                        const active = isActive(item.href, item.exact);
                        return (
                            <Link key={item.href} href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                                    ${active
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }
                                `}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Settings nav */}
                <div className="px-3 pb-2 border-t border-slate-800 pt-4">
                    <p className="px-3 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                        Sistem
                    </p>
                    {settingItems.map(item => {
                        const active = isActive(item.href);
                        return (
                            <Link key={item.href} href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                                    ${active
                                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }
                                `}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* User section */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {auth?.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{auth?.user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{auth?.user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <span>⬡</span> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)} />
            )}

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                        >
                            ☰
                        </button>
                        <div>
                            <h1 className="text-sm font-bold text-slate-900">{title}</h1>
                        </div>
                    </div>
                    <Link href="/"
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors font-medium"
                    >
                        ← Lihat Website
                    </Link>
                </header>

                {/* Flash messages */}
                {(flash?.success || flash?.error) && (
                    <div className="px-6 pt-4">
                        {flash?.success && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm">
                                <span className="shrink-0">✓</span> {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                                <span className="shrink-0">✗</span> {flash.error}
                            </div>
                        )}
                    </div>
                )}

                {/* Content */}
                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
