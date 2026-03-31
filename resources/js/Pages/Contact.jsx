import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import Chatbot from '@/Components/Chatbot';

/* ─────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────── */
function Navbar() {
    const { settings } = usePage().props;
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Tutup menu saat resize ke desktop
    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    const links = [
        { href: '#hero',      label: 'Beranda' },
        { href: '#services',  label: 'Layanan' },
        { href: '#portfolio', label: 'Portfolio' },
        { href: '#why-us',    label: 'Kenapa Kami' },
        { href: '#contact',   label: 'Kontak' },
    ];

    const siteName = settings?.site_name || 'YZ Studio';

    return (
        <>
            {/* Navbar bar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
            }`}>
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <a href="#hero" className="flex items-center shrink-0">
                        {settings?.logo
                            ? <img
                                src={`/storage/${settings.logo}`}
                                alt={siteName}
                                className={`h-12 w-auto max-w-[200px] object-contain transition-all ${
                                    scrolled ? 'brightness-0' : 'brightness-0 invert'
                                }`}
                              />
                            : <span className={`text-xl font-bold tracking-tight transition-colors ${
                                scrolled ? 'text-slate-900' : 'text-white'
                              }`}>
                                {siteName.split(' ')[0]}
                                <span className="text-indigo-500">{siteName.split(' ').slice(1).join(' ') || ''}</span>
                              </span>
                        }
                    </a>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-7">
                        {links.map(l => (
                            <a key={l.href} href={l.href} className={`text-sm font-medium transition-colors hover:text-indigo-500 ${
                                scrolled ? 'text-slate-600' : 'text-white/80'
                            }`}>
                                {l.label}
                            </a>
                        ))}
                        <a href="#contact" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">
                            Mulai Project
                        </a>
                    </div>

                    {/* Mobile hamburger */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${scrolled ? 'text-slate-700' : 'text-white'}`}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </nav>

            {/* Mobile menu — fullscreen overlay, di luar <nav> agar tidak dorong konten */}
            <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
                menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
                {/* Panel */}
                <div className={`absolute top-0 right-0 w-72 h-full bg-white flex flex-col shadow-2xl transition-transform duration-300 ${
                    menuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                    {/* Panel header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                        <span className="font-bold text-slate-800">{siteName}</span>
                        <button onClick={() => setMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">✕</button>
                    </div>
                    {/* Links */}
                    <nav className="flex-1 px-6 py-6 space-y-1 overflow-y-auto">
                        {links.map(l => (
                            <a key={l.href} href={l.href}
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                            >
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    {/* CTA */}
                    <div className="px-6 pb-8">
                        <a href="#contact"
                            onClick={() => setMenuOpen(false)}
                            className="block w-full text-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                            Mulai Project
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
function Hero() {
    const { settings } = usePage().props;
    return (
        <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-slate-900">
            {/* Background gradient blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px'}}
            />

            <div className="relative max-w-6xl mx-auto px-6 py-32 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium mb-8 animate-fade-in">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                    Available for new projects
                </div>

                {/* Headline */}
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up">
                    Jasa Pembuatan
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                        Website & Aplikasi
                    </span>
                    Profesional
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-100">
                    Software house Indonesia spesialis website, aplikasi web, dan solusi digital
                    untuk bisnis yang ingin berkembang lebih cepat.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200">
                    <a href="#contact"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
                    >
                        💬 Diskusi Project
                    </a>
                    <a href="#portfolio"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-200"
                    >
                        Lihat Portfolio →
                    </a>
                </div>

                {/* Stats */}
                <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up delay-300">
                    {[
                        { value: settings?.stat1_value || '50+',   label: settings?.stat1_label || 'Project Selesai' },
                        { value: settings?.stat2_value || '98%',   label: settings?.stat2_label || 'Client Puas' },
                        { value: settings?.stat3_value || '3 Thn', label: settings?.stat3_label || 'Pengalaman' },
                    ].map(s => (
                        <div key={s.label} className="text-center">
                            <p className="text-2xl md:text-3xl font-bold text-white">{s.value}</p>
                            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
                <div className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
                    <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   SERVICES SECTION
───────────────────────────────────────────── */
function Services({ services }) {
    if (!services?.length) return null;

    const formatPrice = (price) => {
        if (!price) return 'Harga Fleksibel';
        return 'Mulai ' + new Intl.NumberFormat('id-ID', {
            style: 'currency', currency: 'IDR', minimumFractionDigits: 0
        }).format(price);
    };

    return (
        <section id="services" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section header */}
                <div className="text-center mb-16">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 block">
                        Apa yang kami tawarkan
                    </span>
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Layanan Kami</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Solusi digital end-to-end untuk membantu bisnis Anda tumbuh lebih cepat dan efisien.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, i) => (
                        <div key={service.id}
                            className="card-hover group p-8 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:bg-indigo-50/30 cursor-default"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        >
                            {/* Icon */}
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-2xl mb-6 transition-colors">
                                {service.icon || '⚙️'}
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 mb-2">{service.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">{service.description}</p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <span className="text-sm font-semibold text-indigo-600">{formatPrice(service.price)}</span>
                                <a href="#contact"
                                    className="text-xs font-medium text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center gap-1"
                                >
                                    Pesan →
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   PORTFOLIO SECTION
───────────────────────────────────────────── */
function PortfolioCard({ portfolio }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    return (
        <div className="card-hover group rounded-2xl overflow-hidden bg-white border border-slate-100">
            {/* Image container — 16:9 ratio */}
            <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: '16/9' }}>
                {/* Skeleton */}
                {!imgLoaded && !imgError && portfolio.image && (
                    <div className="absolute inset-0 skeleton" />
                )}

                {/* Actual image */}
                {portfolio.image && !imgError ? (
                    <img
                        src={`/storage/${portfolio.image}`}
                        alt={`${portfolio.title} — Contoh Project Portfolio`}
                        loading="lazy"
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                            imgLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                        <span className="text-5xl mb-2">🖥️</span>
                        <span className="text-xs text-slate-400">{portfolio.title}</span>
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex gap-2">
                        <a href={`/portfolio/${portfolio.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-900 text-xs font-semibold rounded-lg hover:bg-indigo-50 transition-colors"
                        >
                            Detail →
                        </a>
                        {portfolio.demo_link && (
                            <a href={portfolio.demo_link} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Demo ↗
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Card body */}
            <div className="p-5">
                <h3 className="font-bold text-slate-800 mb-1.5 truncate">{portfolio.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">{portfolio.description}</p>

                {/* Tech badges */}
                {portfolio.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {portfolio.technologies.slice(0, 4).map((tech, i) => (
                            <span key={i} className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                {tech}
                            </span>
                        ))}
                        {portfolio.technologies.length > 4 && (
                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-400 text-xs rounded-full">
                                +{portfolio.technologies.length - 4}
                            </span>
                        )}
                    </div>
                )}

                <p className="text-xs text-slate-400 mt-3">
                    {new Date(portfolio.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                </p>
            </div>
        </div>
    );
}

function Portfolio({ portfolios }) {
    if (!portfolios?.length) return null;

    return (
        <section id="portfolio" className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 block">
                        Hasil Kerja Kami
                    </span>
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Portfolio</h2>
                    <p className="text-slate-500 max-w-xl mx-auto">
                        Beberapa proyek terbaik yang telah kami selesaikan untuk klien dari berbagai industri.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map(p => <PortfolioCard key={p.id} portfolio={p} />)}
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   WHY US SECTION
───────────────────────────────────────────── */
function WhyUs() {
    const reasons = [
        { icon: '⚡', title: 'Pengiriman Tepat Waktu', desc: 'Kami berkomitmen pada deadline yang sudah disepakati bersama.' },
        { icon: '🔧', title: 'Support Purna Jual', desc: 'Maintenance dan support tersedia setelah project selesai.' },
        { icon: '🎨', title: 'Desain Modern', desc: 'UI/UX yang clean, responsif, dan sesuai tren terkini.' },
        { icon: '📈', title: 'Skalabel', desc: 'Arsitektur yang dapat berkembang seiring pertumbuhan bisnis.' },
    ];

    return (
        <section id="why-us" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 block">
                            Kenapa Pilih Kami
                        </span>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                            Partner Terpercaya untuk
                            <span className="text-indigo-600"> Transformasi Digital</span>
                        </h2>
                        <p className="text-slate-500 leading-relaxed mb-8">
                            Kami bukan sekadar vendor — kami adalah mitra bisnis yang peduli dengan
                            pertumbuhan jangka panjang Anda. Setiap baris kode kami tulis dengan
                            standar kualitas tertinggi.
                        </p>
                        <a href="#contact"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                        >
                            Konsultasi Gratis →
                        </a>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {reasons.map((r, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors group">
                                <span className="text-3xl mb-4 block">{r.icon}</span>
                                <h4 className="font-bold text-slate-800 mb-2 text-sm">{r.title}</h4>
                                <p className="text-slate-500 text-xs leading-relaxed">{r.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   CONTACT SECTION
───────────────────────────────────────────── */
function Contact() {
    const { flash, settings } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '', whatsapp: '', message: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/contact', { onSuccess: () => reset() });
    };

    const contactItems = [
        settings?.whatsapp && { icon: '📱', label: 'WhatsApp', value: settings.whatsapp },
        settings?.email    && { icon: '📧', label: 'Email',     value: settings.email },
        settings?.address  && { icon: '📍', label: 'Lokasi',   value: settings.address },
    ].filter(Boolean);

    // fallback jika settings belum diisi
    const displayItems = contactItems.length > 0 ? contactItems : [
        { icon: '📱', label: 'WhatsApp', value: 'Belum dikonfigurasi' },
        { icon: '📧', label: 'Email',    value: 'Belum dikonfigurasi' },
        { icon: '📍', label: 'Lokasi',   value: 'Indonesia (Remote Friendly)' },
    ];

    return (
        <section id="contact" className="py-24 bg-slate-900">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left */}
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 block">
                            Hubungi Kami
                        </span>
                        <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                            Siap Memulai
                            <span className="text-indigo-400"> Project Anda?</span>
                        </h2>
                        <p className="text-slate-400 leading-relaxed mb-10">
                            Ceritakan kebutuhan Anda, dan tim kami akan merespons dalam waktu
                            kurang dari 1×24 jam via WhatsApp.
                        </p>

                        <div className="space-y-5">
                            {displayItems.map(item => (
                                <div key={item.label} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-lg shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                                        <p className="text-sm text-slate-200 font-medium">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                        {flash?.success && (
                            <div className="mb-6 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm text-center">
                                ✅ {flash.success}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Nama Lengkap *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                                    placeholder="Budi Santoso"
                                />
                                {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Nomor WhatsApp *
                                </label>
                                <input
                                    type="tel"
                                    value={data.whatsapp}
                                    onChange={e => setData('whatsapp', e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
                                    placeholder="08123456789"
                                />
                                <p className="mt-1.5 text-xs text-slate-600">Format: 08xxx atau 628xxx</p>
                                {errors.whatsapp && <p className="mt-1 text-xs text-red-400">{errors.whatsapp}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    Pesan / Kebutuhan *
                                </label>
                                <textarea
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    rows={5}
                                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all resize-none"
                                    placeholder="Ceritakan proyek Anda, anggaran, dan timeline yang diinginkan..."
                                />
                                {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25"
                            >
                                {processing ? (
                                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Mengirim...</>
                                ) : (
                                    <>Kirim Pesan via WhatsApp 💬</>

                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
    const { settings } = usePage().props;
    const siteName    = settings?.site_name    || 'YZ Studio';
    const tagline     = settings?.site_tagline || 'Building digital products that matter.';
    const footerText  = settings?.footer_text  || `${siteName}. All rights reserved.`;

    const socials = [
        { key: 'instagram', icon: '📸', label: 'Instagram' },
        { key: 'facebook',  icon: '📘', label: 'Facebook' },
        { key: 'twitter',   icon: '🐦', label: 'Twitter' },
        { key: 'linkedin',  icon: '💼', label: 'LinkedIn' },
        { key: 'github',    icon: '🐙', label: 'GitHub' },
    ].filter(s => settings?.[s.key]);

    return (
        <footer className="bg-slate-950 border-t border-slate-800">
            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                    <div className="max-w-xs">
                        {settings?.logo
                            ? <img src={`/storage/${settings.logo}`} alt={siteName} className="h-10 w-auto object-contain brightness-0 invert mb-3" />
                            : <p className="text-lg font-bold text-white mb-1">{siteName}</p>
                        }
                        <p className="text-xs text-slate-500">{tagline}</p>

                        {/* Social icons */}
                        {socials.length > 0 && (
                            <div className="flex gap-3 mt-4">
                                {socials.map(s => (
                                    <a key={s.key} href={settings[s.key]} target="_blank" rel="noopener noreferrer"
                                        title={s.label}
                                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-sm transition-colors"
                                    >
                                        {s.icon}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                        <a href="#services"  className="hover:text-slate-300 transition-colors">Layanan</a>
                        <a href="#portfolio" className="hover:text-slate-300 transition-colors">Portfolio</a>
                        <a href="#contact"   className="hover:text-slate-300 transition-colors">Kontak</a>
                        <a href="/login"     className="hover:text-slate-300 transition-colors">Admin</a>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-600">
                    © {new Date().getFullYear()} {footerText}
                </div>
            </div>
        </footer>
    );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function ContactPage({ portfolios, services }) {
    const { settings } = usePage().props;
    const siteName    = settings?.site_name    || 'YZ Studio';
    const siteDesc    = settings?.site_description || 'Software house Indonesia spesialis pembuatan website, aplikasi web, dan solusi digital profesional untuk bisnis modern. Berpengalaman 3+ tahun, 50+ project selesai.';
    const siteTagline = settings?.site_tagline || 'Software House Indonesia — Website & Aplikasi Web Profesional';

    return (
        <>
            <Head>
                <title>{siteName} — {siteTagline}</title>
                <meta name="description" content={siteDesc} />
                <meta name="keywords" content="software house indonesia, jasa pembuatan website, jasa aplikasi web, web developer indonesia, jasa website profesional, aplikasi bisnis, website company profile" />
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:title" content={`${siteName} — ${siteTagline}`} />
                <meta property="og:description" content={siteDesc} />
                <meta property="og:locale" content="id_ID" />
                {settings?.logo && <meta property="og:image" content={`/storage/${settings.logo}`} />}
                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${siteName} — ${siteTagline}`} />
                <meta name="twitter:description" content={siteDesc} />
                {/* Schema.org JSON-LD */}
                <script type="application/ld+json">{JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "ProfessionalService",
                    "name": siteName,
                    "description": siteDesc,
                    "url": window.location.origin,
                    "telephone": settings?.phone || '',
                    "email": settings?.email || '',
                    "address": { "@type": "PostalAddress", "addressCountry": "ID", "addressLocality": settings?.address || 'Indonesia' },
                    "sameAs": [settings?.instagram, settings?.linkedin, settings?.github].filter(Boolean),
                    "serviceType": "Software Development",
                    "areaServed": "Indonesia",
                })}</script>
            </Head>
            <div className="min-h-screen">
                <header role="banner"><Navbar /></header>
                <main id="main-content">
                    <Hero />
                    <Services services={services} />
                    <Portfolio portfolios={portfolios} />
                    <WhyUs />
                    <Contact />
                </main>
                <footer role="contentinfo"><Footer /></footer>
            </div>
            <Chatbot siteName={usePage().props.settings?.site_name || 'YZ Studio'} />
        </>
    );
}
