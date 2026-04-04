import { Link, router, usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
//#region resources/js/Layouts/AdminLayout.jsx
var navItems = [
	{
		href: "/admin/dashboard",
		label: "Dashboard",
		icon: "▦",
		exact: true
	},
	{
		href: "/admin/portfolios",
		label: "Portfolio",
		icon: "◈"
	},
	{
		href: "/admin/services",
		label: "Layanan",
		icon: "◎"
	},
	{
		href: "/admin/messages",
		label: "Pesan",
		icon: "◉"
	},
	{
		href: "/admin/chats",
		label: "Chat AI",
		icon: "🤖"
	}
];
var settingItems = [{
	href: "/admin/profile",
	label: "Profil",
	icon: "👤"
}, {
	href: "/admin/settings",
	label: "Pengaturan",
	icon: "⚙"
}];
function AdminLayout({ children, title }) {
	const { auth, flash, settings, url } = usePage().props;
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const currentPath = usePage().url.split("?")[0];
	const isActive = (href, exact = false) => exact ? currentPath === href : currentPath.startsWith(href);
	const handleLogout = () => router.post("/logout");
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen bg-slate-50 flex",
		children: [
			/* @__PURE__ */ jsxs("aside", {
				className: `
                fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 flex flex-col shrink-0
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:transform-none
            `,
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "h-16 flex items-center justify-between px-6 border-b border-slate-800",
						children: [/* @__PURE__ */ jsx(Link, {
							href: "/",
							className: "flex items-center gap-2 min-w-0",
							children: settings?.logo ? /* @__PURE__ */ jsx("img", {
								src: `/storage/${settings.logo}`,
								alt: "Logo",
								className: "h-11 w-auto max-w-[160px] object-contain brightness-0 invert"
							}) : /* @__PURE__ */ jsx("span", {
								className: "text-lg font-bold text-white tracking-tight",
								children: settings?.site_name ? /* @__PURE__ */ jsxs(Fragment, { children: [settings.site_name.split(" ")[0], /* @__PURE__ */ jsx("span", {
									className: "text-indigo-400",
									children: settings.site_name.split(" ").slice(1).join(" ")
								})] }) : /* @__PURE__ */ jsxs(Fragment, { children: ["YZ", /* @__PURE__ */ jsx("span", {
									className: "text-indigo-400",
									children: "Studio"
								})] })
							})
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setSidebarOpen(false),
							className: "lg:hidden text-slate-400 hover:text-white",
							children: "✕"
						})]
					}),
					/* @__PURE__ */ jsxs("nav", {
						className: "flex-1 px-3 py-6 space-y-1 overflow-y-auto",
						children: [/* @__PURE__ */ jsx("p", {
							className: "px-3 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3",
							children: "Menu"
						}), navItems.map((item) => {
							const active = isActive(item.href, item.exact);
							return /* @__PURE__ */ jsxs(Link, {
								href: item.href,
								onClick: () => setSidebarOpen(false),
								className: `
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                                    ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}
                                `,
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-base",
									children: item.icon
								}), item.label]
							}, item.href);
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "px-3 pb-2 border-t border-slate-800 pt-4",
						children: [/* @__PURE__ */ jsx("p", {
							className: "px-3 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2",
							children: "Sistem"
						}), settingItems.map((item) => {
							const active = isActive(item.href);
							return /* @__PURE__ */ jsxs(Link, {
								href: item.href,
								onClick: () => setSidebarOpen(false),
								className: `
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                                    ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}
                                `,
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-base",
									children: item.icon
								}), item.label]
							}, item.href);
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "p-4 border-t border-slate-800",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 mb-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0",
								children: auth?.user?.name?.charAt(0).toUpperCase()
							}), /* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-semibold text-white truncate",
									children: auth?.user?.name
								}), /* @__PURE__ */ jsx("p", {
									className: "text-xs text-slate-500 truncate",
									children: auth?.user?.email
								})]
							})]
						}), /* @__PURE__ */ jsxs("button", {
							onClick: handleLogout,
							className: "w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors",
							children: [/* @__PURE__ */ jsx("span", { children: "⬡" }), " Logout"]
						})]
					})
				]
			}),
			sidebarOpen && /* @__PURE__ */ jsx("div", {
				className: "fixed inset-0 z-40 bg-black/60 lg:hidden",
				onClick: () => setSidebarOpen(false)
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex-1 flex flex-col min-w-0 overflow-hidden",
				children: [
					/* @__PURE__ */ jsxs("header", {
						className: "h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ jsx("button", {
								onClick: () => setSidebarOpen(true),
								className: "lg:hidden w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100",
								children: "☰"
							}), /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("h1", {
								className: "text-sm font-bold text-slate-900",
								children: title
							}) })]
						}), /* @__PURE__ */ jsx(Link, {
							href: "/",
							className: "flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors font-medium",
							children: "← Lihat Website"
						})]
					}),
					(flash?.success || flash?.error) && /* @__PURE__ */ jsxs("div", {
						className: "px-6 pt-4",
						children: [flash?.success && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "shrink-0",
									children: "✓"
								}),
								" ",
								flash.success
							]
						}), flash?.error && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "shrink-0",
									children: "✗"
								}),
								" ",
								flash.error
							]
						})]
					}),
					/* @__PURE__ */ jsx("main", {
						className: "flex-1 p-6 overflow-y-auto",
						children
					})
				]
			})
		]
	});
}
//#endregion
export { AdminLayout as t };
