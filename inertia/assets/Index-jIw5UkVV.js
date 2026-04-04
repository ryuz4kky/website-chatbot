import { t as AdminLayout } from "./AdminLayout-qqnefiFY.js";
import { Head, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Messages/Index.jsx
function WaBadge({ sent, label }) {
	return sent ? /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium",
		children: ["✓ ", label]
	}) : /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full",
		children: ["✗ ", label]
	});
}
function MessagesIndex({ messages }) {
	const markRead = (id) => router.patch(`/admin/messages/${id}/read`);
	const handleDelete = (id) => {
		if (confirm("Yakin ingin menghapus pesan ini?")) router.delete(`/admin/messages/${id}`);
	};
	const unreadCount = messages.filter((m) => !m.is_read).length;
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "Pesan Masuk",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Pesan Masuk" }),
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-between mb-6",
				children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl font-bold text-slate-800",
					children: "Pesan Masuk"
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-sm text-slate-500 mt-0.5",
					children: [
						messages.length,
						" total",
						unreadCount > 0 && /* @__PURE__ */ jsxs("span", {
							className: "ml-2 text-red-600 font-medium",
							children: [
								"• ",
								unreadCount,
								" belum dibaca"
							]
						})
					]
				})] })
			}),
			messages.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl shadow-sm p-16 text-center",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-5xl mb-4",
						children: "💬"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "font-semibold text-slate-700",
						children: "Belum ada pesan masuk"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-slate-400 mt-1",
						children: "Pesan dari form kontak akan muncul di sini."
					})
				]
			}) : /* @__PURE__ */ jsx("div", {
				className: "space-y-3",
				children: messages.map((msg) => /* @__PURE__ */ jsx("div", {
					className: `bg-white rounded-xl shadow-sm border-l-4 transition-colors ${msg.is_read ? "border-slate-200" : "border-indigo-500"}`,
					children: /* @__PURE__ */ jsxs("div", {
						className: "p-5 flex items-start gap-4",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0",
								children: msg.name.charAt(0).toUpperCase()
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex-1 min-w-0",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center flex-wrap gap-2 mb-1",
										children: [/* @__PURE__ */ jsx("p", {
											className: "font-semibold text-slate-800",
											children: msg.name
										}), !msg.is_read && /* @__PURE__ */ jsx("span", {
											className: "px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full font-medium",
											children: "Baru"
										})]
									}),
									/* @__PURE__ */ jsxs("a", {
										href: `https://wa.me/${msg.whatsapp}`,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "inline-flex items-center gap-1.5 text-sm text-green-600 hover:text-green-700 font-medium mb-3",
										children: [/* @__PURE__ */ jsx("svg", {
											viewBox: "0 0 24 24",
											className: "w-4 h-4 fill-current",
											children: /* @__PURE__ */ jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" })
										}), msg.whatsapp]
									}),
									/* @__PURE__ */ jsx("div", {
										className: "bg-slate-50 rounded-xl p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100 mb-3",
										children: msg.message
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex items-center flex-wrap gap-3",
										children: [
											/* @__PURE__ */ jsx("span", {
												className: "text-xs text-slate-400",
												children: new Date(msg.created_at).toLocaleString("id-ID", {
													dateStyle: "long",
													timeStyle: "short"
												})
											}),
											/* @__PURE__ */ jsx(WaBadge, {
												sent: msg.wa_sent,
												label: "WA Admin"
											}),
											/* @__PURE__ */ jsx(WaBadge, {
												sent: msg.wa_user_sent,
												label: "WA User"
											}),
											msg.wa_error && /* @__PURE__ */ jsx("span", {
												className: "text-xs text-red-500",
												title: msg.wa_error,
												children: "⚠ Error WA"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex flex-col gap-2 shrink-0",
								children: [
									!msg.is_read && /* @__PURE__ */ jsx("button", {
										onClick: () => markRead(msg.id),
										className: "px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors whitespace-nowrap",
										children: "✓ Tandai Dibaca"
									}),
									/* @__PURE__ */ jsx("a", {
										href: `https://wa.me/${msg.whatsapp}?text=${encodeURIComponent(`Halo ${msg.name}, terima kasih sudah menghubungi kami! 😊`)}`,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "px-3 py-1.5 text-xs font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-center whitespace-nowrap",
										children: "💬 Balas WA"
									}),
									/* @__PURE__ */ jsx("button", {
										onClick: () => handleDelete(msg.id),
										className: "px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg transition-colors",
										children: "Hapus"
									})
								]
							})
						]
					})
				}, msg.id))
			})
		]
	});
}
//#endregion
export { MessagesIndex as default };
