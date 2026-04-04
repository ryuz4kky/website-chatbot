import { t as AdminLayout } from "./AdminLayout-qqnefiFY.js";
import { Head, Link, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Chat/Index.jsx
function ChatIndex({ sessions }) {
	const destroy = (id) => {
		if (!confirm("Hapus sesi chat ini?")) return;
		router.delete(`/admin/chats/${id}`);
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "Chat AI",
		children: [/* @__PURE__ */ jsx(Head, { title: "Chat AI" }), /* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl font-bold text-slate-800",
					children: "Sesi Chat AI"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500 mt-1",
					children: "Percakapan pengunjung dengan chatbot."
				})] }), /* @__PURE__ */ jsxs("span", {
					className: "text-sm text-slate-400",
					children: [sessions.total, " sesi"]
				})]
			}), sessions.data.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl shadow-sm p-12 text-center",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-4xl mb-3",
					children: "💬"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-500 text-sm",
					children: "Belum ada sesi chat."
				})]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl shadow-sm overflow-hidden",
				children: [/* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-slate-50 border-b border-slate-100",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider",
								children: "Nama"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider",
								children: "No. HP"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider",
								children: "Pesan"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider",
								children: "Waktu"
							}),
							/* @__PURE__ */ jsx("th", { className: "px-5 py-3" })
						] })
					}), /* @__PURE__ */ jsx("tbody", {
						className: "divide-y divide-slate-50",
						children: sessions.data.map((s) => /* @__PURE__ */ jsxs("tr", {
							className: "hover:bg-slate-50 transition-colors",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-5 py-3.5 font-medium text-slate-800",
									children: s.name
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-5 py-3.5 text-slate-500",
									children: s.phone
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-5 py-3.5",
									children: /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium",
										children: [
											"💬 ",
											s.messages_count,
											" pesan"
										]
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-5 py-3.5 text-slate-400 text-xs",
									children: new Date(s.created_at).toLocaleString("id-ID", {
										day: "numeric",
										month: "short",
										year: "numeric",
										hour: "2-digit",
										minute: "2-digit"
									})
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-5 py-3.5 text-right space-x-2",
									children: [/* @__PURE__ */ jsx(Link, {
										href: `/admin/chats/${s.id}`,
										className: "text-xs text-indigo-600 hover:text-indigo-800 font-medium",
										children: "Lihat"
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => destroy(s.id),
										className: "text-xs text-red-400 hover:text-red-600 font-medium",
										children: "Hapus"
									})]
								})
							]
						}, s.id))
					})]
				}), sessions.last_page > 1 && /* @__PURE__ */ jsx("div", {
					className: "px-5 py-3 border-t border-slate-100 flex gap-2",
					children: sessions.links.map((link, i) => /* @__PURE__ */ jsx(Link, {
						href: link.url ?? "#",
						className: `px-3 py-1 text-xs rounded-lg ${link.active ? "bg-indigo-600 text-white" : "text-slate-500 hover:bg-slate-100"} ${!link.url ? "opacity-40 pointer-events-none" : ""}`,
						dangerouslySetInnerHTML: { __html: link.label }
					}, i))
				})]
			})]
		})]
	});
}
//#endregion
export { ChatIndex as default };
