import { useState, useRef, useEffect } from 'react';

function getCsrf() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

async function postJson(url, body) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-XSRF-TOKEN': getCsrf(),
        },
        body: JSON.stringify(body),
    });

    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
        throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    // Tangani error validasi (422) atau error lain dari server
    if (!res.ok) {
        const msg = data?.message ?? `Error ${res.status}`;
        throw new Error(msg);
    }

    return data;
}

function TypingDots() {
    return (
        <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
        </div>
    );
}

export default function Chatbot({ siteName = 'YZ Studio' }) {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState('form'); // 'form' | 'chat'
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState('');

    // Form state
    const [name, setName]       = useState('');
    const [phone, setPhone]     = useState('');
    const [firstMsg, setFirstMsg] = useState('');
    const [formErrors, setFormErrors] = useState({});

    const bottomRef = useRef(null);
    const inputRef  = useRef(null);

    useEffect(() => {
        if (open && step === 'chat') {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open]);

    useEffect(() => {
        if (open && step === 'chat') inputRef.current?.focus();
    }, [open, step]);

    const validateForm = () => {
        const errors = {};
        if (!name.trim()) errors.name = 'Nama wajib diisi.';
        if (!phone.trim()) errors.phone = 'Nomor HP wajib diisi.';
        if (!firstMsg.trim()) errors.firstMsg = 'Pertanyaan wajib diisi.';
        return errors;
    };

    const startChat = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length) { setFormErrors(errors); return; }

        setLoading(true);
        setFormErrors({});

        const userMsg = firstMsg.trim();
        setStep('chat');
        setMessages([{ role: 'user', content: userMsg }]);

        try {
            const data = await postJson('/chat/init', {
                name: name.trim(),
                phone: phone.trim(),
                message: userMsg,
            });
            setSessionId(data.session_id);
            setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
        } catch (e) {
            const errMsg = e?.message?.includes('429') || e?.message?.toLowerCase().includes('quota')
                ? 'AI sedang sibuk, coba beberapa saat lagi.'
                : 'Maaf, terjadi kesalahan koneksi. Coba lagi.';
            setMessages(prev => [...prev, { role: 'model', content: errMsg }]);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setLoading(true);

        try {
            const data = await postJson('/chat/send', {
                session_id: sessionId,
                message: text,
            });
            setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
        } catch (e) {
            const errMsg = e?.message?.includes('429') || e?.message?.toLowerCase().includes('quota')
                ? 'AI sedang sibuk, coba beberapa saat lagi.'
                : 'Maaf, terjadi kesalahan koneksi. Coba lagi.';
            setMessages(prev => [...prev, { role: 'model', content: errMsg }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const reset = () => {
        setStep('form');
        setMessages([]);
        setSessionId(null);
        setName(''); setPhone(''); setFirstMsg('');
        setFormErrors({});
        setInput('');
    };

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center text-2xl"
                aria-label="Buka chat"
            >
                {open ? '✕' : '💬'}
            </button>

            {/* Chat panel */}
            <div className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
            }`} style={{ height: '520px' }}>

                {/* Header */}
                <div className="bg-indigo-600 px-4 py-3.5 flex items-center gap-3 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">🤖</div>
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm leading-tight">AI Assistant</p>
                        <p className="text-indigo-200 text-xs">{siteName}</p>
                    </div>
                    {step === 'chat' && (
                        <button onClick={reset} className="text-indigo-200 hover:text-white text-xs transition-colors">
                            Chat baru
                        </button>
                    )}
                </div>

                {/* Form step */}
                {step === 'form' && (
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <p className="text-sm text-slate-500 text-center pt-2">
                            Halo! Isi data di bawah untuk mulai chat dengan AI kami 👋
                        </p>

                        <div>
                            <input
                                type="text"
                                placeholder="Nama kamu"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {formErrors.name && <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Nomor HP / WhatsApp"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            {formErrors.phone && <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>}
                        </div>
                        <div>
                            <textarea
                                placeholder="Apa yang ingin kamu tanyakan?"
                                value={firstMsg}
                                onChange={e => setFirstMsg(e.target.value)}
                                rows={3}
                                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                            {formErrors.firstMsg && <p className="mt-1 text-xs text-red-500">{formErrors.firstMsg}</p>}
                        </div>
                        <button
                            onClick={startChat}
                            disabled={loading}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading
                                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Memproses...</>
                                : 'Mulai Chat →'
                            }
                        </button>
                    </div>
                )}

                {/* Chat step */}
                {step === 'chat' && (
                    <>
                        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-sm'
                                            : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && <TypingDots />}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="px-3 py-3 border-t border-slate-100 flex gap-2 shrink-0">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="Tulis pesan..."
                                rows={1}
                                className="flex-1 px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                style={{ maxHeight: '80px' }}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shrink-0 self-end"
                            >
                                ➤
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
