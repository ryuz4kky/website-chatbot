import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

/* ── Lightbox ── */
function Lightbox({ images, index, onClose }) {
    const [current, setCurrent] = useState(index);
    const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
    const next = () => setCurrent(i => (i + 1) % images.length);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={onClose}
        >
            <button onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors z-10">
                ✕
            </button>

            {images.length > 1 && (
                <>
                    <button onClick={e => { e.stopPropagation(); prev(); }}
                        className="absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors">
                        ‹
                    </button>
                    <button onClick={e => { e.stopPropagation(); next(); }}
                        className="absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors">
                        ›
                    </button>
                </>
            )}

            <img
                src={`/storage/${images[current]}`}
                alt={`Gallery ${current + 1}`}
                className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
                onClick={e => e.stopPropagation()}
            />

            <div className="absolute bottom-4 text-white/50 text-sm">
                {current + 1} / {images.length}
            </div>
        </div>
    );
}

/* ── Navbar ── */
function Navbar() {
    const { settings } = usePage().props;
    const siteName = settings?.site_name || 'YZ Studio';
    return (
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                    {settings?.logo
                        ? <img src={`/storage/${settings.logo}`} alt={siteName} className="h-8 w-auto object-contain" />
                        : <span className="text-lg font-bold text-slate-900 tracking-tight">
                            {siteName.split(' ')[0]}<span className="text-indigo-500">{siteName.split(' ').slice(1).join(' ')}</span>
                          </span>
                    }
                </Link>
                <div className="flex items-center gap-6 text-sm">
                    <Link href="/#portfolio" className="text-slate-500 hover:text-slate-900 transition-colors">
                        ← Semua Portfolio
                    </Link>
                    <Link href="/#contact"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
                        Hubungi Kami
                    </Link>
                </div>
            </div>
        </nav>
    );
}

/* ── Related card ── */
function RelatedCard({ item }) {
    return (
        <Link href={`/portfolio/${item.id}`}
            className="group block bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative overflow-hidden bg-slate-100" style={{ aspectRatio: '16/9' }}>
                {item.image
                    ? <img src={`/storage/${item.image}`} alt={item.title} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="w-full h-full flex items-center justify-center text-4xl">🖥️</div>
                }
            </div>
            <div className="p-4">
                <h4 className="font-semibold text-slate-800 text-sm truncate">{item.title}</h4>
                {item.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {item.technologies.slice(0, 3).map((t, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full">{t}</span>
                        ))}
                    </div>
                )}
            </div>
        </Link>
    );
}

/* ── Main Page ── */
export default function PortfolioShow({ portfolio, related }) {
    const [lightbox, setLightbox] = useState(null); // index or null

    // Semua gambar: utama + gallery
    const allImages = [
        ...(portfolio.image ? [portfolio.image] : []),
        ...(portfolio.gallery ?? []),
    ];

    const hasGallery = allImages.length > 1;

    return (
        <>
            <Head title={`${portfolio.title} — Portfolio`} />

            {lightbox !== null && (
                <Lightbox images={allImages} index={lightbox} onClose={() => setLightbox(null)} />
            )}

            <div className="min-h-screen bg-slate-50">
                <Navbar />

                <div className="max-w-5xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* ── Left: main content ── */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Gambar utama */}
                            {portfolio.image && (
                                <div
                                    className="relative rounded-2xl overflow-hidden bg-slate-900 cursor-zoom-in shadow-lg"
                                    style={{ aspectRatio: '16/9' }}
                                    onClick={() => setLightbox(0)}
                                >
                                    <img
                                        src={`/storage/${portfolio.image}`}
                                        alt={portfolio.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg">
                                        🔍 Klik untuk perbesar
                                    </div>
                                </div>
                            )}

                            {/* Gallery thumbnails */}
                            {hasGallery && (
                                <div>
                                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                                        Gallery ({allImages.length} foto)
                                    </h3>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                        {allImages.map((img, i) => (
                                            <div
                                                key={i}
                                                className="relative rounded-xl overflow-hidden bg-slate-100 cursor-pointer group"
                                                style={{ aspectRatio: '16/9' }}
                                                onClick={() => setLightbox(i)}
                                            >
                                                <img
                                                    src={`/storage/${img}`}
                                                    alt={`Gallery ${i + 1}`}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <span className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity">⤢</span>
                                                </div>
                                                {i === 0 && (
                                                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-indigo-600 text-white text-xs rounded font-medium">
                                                        Cover
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Deskripsi */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">Tentang Project</h2>
                                <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                                    {portfolio.description}
                                </div>
                            </div>

                            {/* Teknologi */}
                            {portfolio.technologies?.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                    <h2 className="text-lg font-bold text-slate-800 mb-4">Teknologi yang Digunakan</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {portfolio.technologies.map((tech, i) => (
                                            <span key={i}
                                                className="px-4 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm font-medium rounded-full">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── Right: sidebar info ── */}
                        <div className="space-y-5">
                            {/* Project info card */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
                                <h1 className="text-xl font-bold text-slate-900 mb-1 leading-tight">
                                    {portfolio.title}
                                </h1>

                                {portfolio.client && (
                                    <p className="text-sm text-slate-500 mb-4">
                                        untuk <span className="font-medium text-slate-700">{portfolio.client}</span>
                                    </p>
                                )}

                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500">Tanggal</span>
                                        <span className="font-medium text-slate-800">
                                            {new Date(portfolio.date).toLocaleDateString('id-ID', {
                                                year: 'numeric', month: 'long'
                                            })}
                                        </span>
                                    </div>

                                    {portfolio.technologies?.length > 0 && (
                                        <div className="flex items-start justify-between text-sm gap-4">
                                            <span className="text-slate-500 shrink-0">Stack</span>
                                            <span className="font-medium text-slate-800 text-right">
                                                {portfolio.technologies.slice(0, 3).join(', ')}
                                                {portfolio.technologies.length > 3 && ` +${portfolio.technologies.length - 3}`}
                                            </span>
                                        </div>
                                    )}

                                    {allImages.length > 0 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-500">Foto</span>
                                            <span className="font-medium text-slate-800">{allImages.length} gambar</span>
                                        </div>
                                    )}
                                </div>

                                {/* CTA */}
                                <div className="mt-6 space-y-2">
                                    {portfolio.demo_link && (
                                        <a href={portfolio.demo_link} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors">
                                            🔗 Lihat Demo
                                        </a>
                                    )}
                                    <Link href="/#contact"
                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors">
                                        💬 Diskusi Project Serupa
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related portfolios */}
                    {related?.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">Project Lainnya</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                {related.map(item => <RelatedCard key={item.id} item={item} />)}
                            </div>
                        </div>
                    )}
                </div>

                <footer className="mt-16 border-t border-slate-200 py-8 text-center text-sm text-slate-400">
                    <Link href="/" className="hover:text-indigo-600 transition-colors">← Kembali ke Beranda</Link>
                </footer>
            </div>
        </>
    );
}
