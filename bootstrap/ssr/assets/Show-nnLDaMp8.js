import { t as AdminLayout } from "./AdminLayout-qqnefiFY.js";
import { Head, Link } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Chat/Show.jsx
function ChatShow({ session, messages }) {
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "Detail Chat",
		children: [/* @__PURE__ */ jsx(Head, { title: `Chat — ${session.name}` }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-2xl space-y-4",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "flex items-center gap-3",
					children: /* @__PURE__ */ jsx(Link, {
						href: "/admin/chats",
						className: "text-sm text-slate-400 hover:text-slate-600",
						children: "← Kembali"
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-sm px-6 py-4 flex items-center gap-4",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0",
							children: session.name.charAt(0).toUpperCase()
						}),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "font-semibold text-slate-800",
							children: session.name
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-slate-400",
							children: session.phone
						})] }),
						/* @__PURE__ */ jsx("div", {
							className: "ml-auto text-xs text-slate-400",
							children: new Date(session.created_at).toLocaleString("id-ID")
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "bg-white rounded-xl shadow-sm p-5 space-y-4",
					children: messages.map((msg) => /* @__PURE__ */ jsx("div", {
						className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
						children: /* @__PURE__ */ jsx("div", {
							className: `max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-800 rounded-bl-sm"}`,
							children: msg.content
						})
					}, msg.id))
				})
			]
		})]
	});
}
//#endregion
export { ChatShow as default };
