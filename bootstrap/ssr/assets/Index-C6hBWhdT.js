import { t as AdminLayout } from "./AdminLayout-qqnefiFY.js";
import { Head, Link, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Portfolio/Index.jsx
function PortfolioIndex({ portfolios }) {
	const handleDelete = (id) => {
		if (confirm("Yakin ingin menghapus portfolio ini?")) router.delete(`/admin/portfolios/${id}`);
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "Portfolio",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Portfolio" }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl font-bold text-gray-800",
					children: "Daftar Portfolio"
				}), /* @__PURE__ */ jsx(Link, {
					href: "/admin/portfolios/create",
					className: "px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors",
					children: "+ Tambah Portfolio"
				})]
			}),
			portfolios.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl shadow-sm p-12 text-center text-gray-400",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-4xl mb-3",
						children: "🗂️"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "font-medium",
						children: "Belum ada portfolio"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm mt-1",
						children: "Tambahkan portfolio pertama Anda."
					})
				]
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
				children: portfolios.map((portfolio) => /* @__PURE__ */ jsxs("div", {
					className: "bg-white rounded-xl shadow-sm overflow-hidden",
					children: [
						portfolio.image && /* @__PURE__ */ jsx("img", {
							src: `/storage/${portfolio.image}`,
							alt: portfolio.title,
							className: "w-full h-40 object-cover"
						}),
						!portfolio.image && /* @__PURE__ */ jsx("div", {
							className: "w-full h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-4xl",
							children: "🖼️"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "p-5",
							children: [
								/* @__PURE__ */ jsx("h3", {
									className: "font-semibold text-gray-800 truncate",
									children: portfolio.title
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm text-gray-500 mt-1 line-clamp-2",
									children: portfolio.description
								}),
								portfolio.technologies && portfolio.technologies.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "flex flex-wrap gap-1 mt-3",
									children: portfolio.technologies.map((tech, i) => /* @__PURE__ */ jsx("span", {
										className: "px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-full",
										children: tech
									}, i))
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between mt-4 pt-4 border-t border-gray-100",
									children: [/* @__PURE__ */ jsx("span", {
										className: "text-xs text-gray-400",
										children: new Date(portfolio.date).toLocaleDateString("id-ID", {
											year: "numeric",
											month: "long"
										})
									}), /* @__PURE__ */ jsxs("div", {
										className: "flex gap-2",
										children: [
											portfolio.demo_link && /* @__PURE__ */ jsx("a", {
												href: portfolio.demo_link,
												target: "_blank",
												rel: "noopener noreferrer",
												className: "text-xs text-blue-600 hover:underline",
												children: "Demo ↗"
											}),
											/* @__PURE__ */ jsx(Link, {
												href: `/admin/portfolios/${portfolio.id}/edit`,
												className: "text-xs text-indigo-600 hover:underline font-medium",
												children: "Edit"
											}),
											/* @__PURE__ */ jsx("button", {
												onClick: () => handleDelete(portfolio.id),
												className: "text-xs text-red-600 hover:underline font-medium",
												children: "Hapus"
											})
										]
									})]
								})
							]
						})
					]
				}, portfolio.id))
			})
		]
	});
}
//#endregion
export { PortfolioIndex as default };
