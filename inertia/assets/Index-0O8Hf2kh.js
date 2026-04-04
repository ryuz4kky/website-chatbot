import { t as AdminLayout } from "./AdminLayout-qqnefiFY.js";
import { Head, Link, router } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Service/Index.jsx
function ServiceIndex({ services }) {
	const handleDelete = (id) => {
		if (confirm("Yakin ingin menghapus layanan ini?")) router.delete(`/admin/services/${id}`);
	};
	const formatPrice = (price) => {
		if (!price) return "Harga fleksibel";
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0
		}).format(price);
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "Layanan",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Layanan" }),
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between mb-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl font-bold text-gray-800",
					children: "Daftar Layanan"
				}), /* @__PURE__ */ jsx(Link, {
					href: "/admin/services/create",
					className: "px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors",
					children: "+ Tambah Layanan"
				})]
			}),
			services.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-xl shadow-sm p-12 text-center text-gray-400",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-4xl mb-3",
						children: "⚙️"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "font-medium",
						children: "Belum ada layanan"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm mt-1",
						children: "Tambahkan layanan pertama Anda."
					})
				]
			}) : /* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-xl shadow-sm overflow-hidden",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-gray-50 text-gray-600 uppercase text-xs",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-3 text-left",
								children: "Layanan"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-3 text-left",
								children: "Harga"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-3 text-left",
								children: "Status"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-3 text-right",
								children: "Aksi"
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", {
						className: "divide-y divide-gray-100",
						children: services.map((service) => /* @__PURE__ */ jsxs("tr", {
							className: "hover:bg-gray-50",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-4",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-3",
										children: [service.icon && /* @__PURE__ */ jsx("span", {
											className: "text-2xl",
											children: service.icon
										}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
											className: "font-medium text-gray-800",
											children: service.title
										}), /* @__PURE__ */ jsx("p", {
											className: "text-xs text-gray-400 line-clamp-1 mt-0.5",
											children: service.description
										})] })]
									})
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-4 text-gray-600",
									children: formatPrice(service.price)
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-4",
									children: /* @__PURE__ */ jsx("span", {
										className: `px-2 py-1 rounded-full text-xs font-medium ${service.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`,
										children: service.is_active ? "Aktif" : "Nonaktif"
									})
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-6 py-4 text-right",
									children: [/* @__PURE__ */ jsx(Link, {
										href: `/admin/services/${service.id}/edit`,
										className: "text-indigo-600 hover:underline font-medium mr-4",
										children: "Edit"
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => handleDelete(service.id),
										className: "text-red-600 hover:underline font-medium",
										children: "Hapus"
									})]
								})
							]
						}, service.id))
					})]
				})
			})
		]
	});
}
//#endregion
export { ServiceIndex as default };
