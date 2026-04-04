import { t as AdminLayout } from "./AdminLayout-qqnefiFY.js";
import { Head } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Dashboard.jsx
function StatCard({ label, value, icon, color }) {
	return /* @__PURE__ */ jsx("div", {
		className: `bg-white rounded-xl shadow-sm p-6 border-l-4 ${color}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
				className: "text-sm text-gray-500 font-medium",
				children: label
			}), /* @__PURE__ */ jsx("p", {
				className: "text-3xl font-bold text-gray-800 mt-1",
				children: value
			})] }), /* @__PURE__ */ jsx("span", {
				className: "text-4xl",
				children: icon
			})]
		})
	});
}
function Dashboard({ stats }) {
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "Dashboard",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Dashboard" }),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-bold text-gray-800",
					children: "Selamat datang! 👋"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-gray-500 mt-1 text-sm",
					children: "Berikut ringkasan data website Anda."
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
				children: [
					/* @__PURE__ */ jsx(StatCard, {
						label: "Total Portfolio",
						value: stats.portfolios,
						icon: "🗂️",
						color: "border-indigo-500"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Total Layanan",
						value: stats.services,
						icon: "⚙️",
						color: "border-blue-500"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Total Pesan",
						value: stats.messages,
						icon: "💬",
						color: "border-green-500"
					}),
					/* @__PURE__ */ jsx(StatCard, {
						label: "Pesan Belum Dibaca",
						value: stats.unread_messages,
						icon: "🔔",
						color: "border-red-500"
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-sm p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-semibold text-gray-800 mb-4",
						children: "Menu Cepat"
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-3",
						children: [
							{
								href: "/admin/portfolios/create",
								label: "+ Tambah Portfolio",
								color: "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
							},
							{
								href: "/admin/services/create",
								label: "+ Tambah Layanan",
								color: "bg-blue-50 text-blue-700 hover:bg-blue-100"
							},
							{
								href: "/admin/messages",
								label: "💬 Lihat Pesan Masuk",
								color: "bg-green-50 text-green-700 hover:bg-green-100"
							}
						].map((item) => /* @__PURE__ */ jsx("a", {
							href: item.href,
							className: `block px-4 py-3 rounded-lg font-medium text-sm transition-colors ${item.color}`,
							children: item.label
						}, item.href))
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-sm p-6",
					children: [/* @__PURE__ */ jsx("h3", {
						className: "font-semibold text-gray-800 mb-4",
						children: "Informasi Sistem"
					}), /* @__PURE__ */ jsxs("div", {
						className: "space-y-2 text-sm text-gray-600",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between py-2 border-b border-gray-100",
								children: [/* @__PURE__ */ jsx("span", { children: "Framework" }), /* @__PURE__ */ jsx("span", {
									className: "font-medium text-gray-800",
									children: "Laravel 13"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between py-2 border-b border-gray-100",
								children: [/* @__PURE__ */ jsx("span", { children: "Frontend" }), /* @__PURE__ */ jsx("span", {
									className: "font-medium text-gray-800",
									children: "Inertia.js + React"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between py-2 border-b border-gray-100",
								children: [/* @__PURE__ */ jsx("span", { children: "Styling" }), /* @__PURE__ */ jsx("span", {
									className: "font-medium text-gray-800",
									children: "Tailwind CSS v4"
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between py-2",
								children: [/* @__PURE__ */ jsx("span", { children: "WhatsApp API" }), /* @__PURE__ */ jsx("span", {
									className: "font-medium text-gray-800",
									children: "Fonnte"
								})]
							})
						]
					})]
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as default };
