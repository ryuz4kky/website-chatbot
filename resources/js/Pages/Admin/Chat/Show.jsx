import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function ChatShow({ session, messages }) {
    return (
        <AdminLayout title="Detail Chat">
            <Head title={`Chat — ${session.name}`} />

            <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-3">
                    <Link href="/admin/chats" className="text-sm text-slate-400 hover:text-slate-600">← Kembali</Link>
                </div>

                {/* User info */}
                <div className="bg-white rounded-xl shadow-sm px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                        {session.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800">{session.name}</p>
                        <p className="text-sm text-slate-400">{session.phone}</p>
                    </div>
                    <div className="ml-auto text-xs text-slate-400">
                        {new Date(session.created_at).toLocaleString('id-ID')}
                    </div>
                </div>

                {/* Messages */}
                <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                                msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-sm'
                                    : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
