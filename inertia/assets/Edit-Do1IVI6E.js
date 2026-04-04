import { t as AdminLayout } from "./AdminLayout-qqnefiFY.js";
import { Head, useForm } from "@inertiajs/react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Service/Edit.jsx
function ServiceEdit({ service }) {
	const { data, setData, put, processing, errors } = useForm({
		title: service.title,
		description: service.description,
		icon: service.icon ?? "",
		price: service.price ?? "",
		is_active: service.is_active
	});
	const submit = (e) => {
		e.preventDefault();
		put(`/admin/services/${service.id}`);
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "Edit Layanan",
		children: [/* @__PURE__ */ jsx(Head, { title: "Edit Layanan" }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-2xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 mb-6",
				children: [/* @__PURE__ */ jsx("a", {
					href: "/admin/services",
					className: "text-gray-400 hover:text-gray-600 text-sm",
					children: "← Kembali"
				}), /* @__PURE__ */ jsx("h2", {
					className: "text-xl font-bold text-gray-800",
					children: "Edit Layanan"
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "bg-white rounded-xl shadow-sm p-6",
				children: /* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "space-y-5",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-gray-700 mb-1",
								children: "Nama Layanan *"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "text",
								value: data.title,
								onChange: (e) => setData("title", e.target.value),
								className: "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
							}),
							errors.title && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-red-600",
								children: errors.title
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-gray-700 mb-1",
								children: "Deskripsi *"
							}),
							/* @__PURE__ */ jsx("textarea", {
								value: data.description,
								onChange: (e) => setData("description", e.target.value),
								rows: 4,
								className: "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
							}),
							errors.description && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-red-600",
								children: errors.description
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-sm font-medium text-gray-700 mb-1",
							children: "Icon (emoji)"
						}), /* @__PURE__ */ jsx("input", {
							type: "text",
							value: data.icon,
							onChange: (e) => setData("icon", e.target.value),
							className: "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-gray-700 mb-1",
								children: "Harga (Rp)"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "number",
								value: data.price,
								onChange: (e) => setData("price", e.target.value),
								className: "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm",
								min: "0"
							}),
							errors.price && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-red-600",
								children: errors.price
							})
						] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								id: "is_active",
								checked: data.is_active,
								onChange: (e) => setData("is_active", e.target.checked),
								className: "w-4 h-4 text-indigo-600 rounded"
							}), /* @__PURE__ */ jsx("label", {
								htmlFor: "is_active",
								className: "text-sm text-gray-700 font-medium",
								children: "Layanan aktif"
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex gap-3 pt-2",
							children: [/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: processing,
								className: "px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50",
								children: processing ? "Menyimpan..." : "Simpan Perubahan"
							}), /* @__PURE__ */ jsx("a", {
								href: "/admin/services",
								className: "px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors",
								children: "Batal"
							})]
						})
					]
				})
			})]
		})]
	});
}
//#endregion
export { ServiceEdit as default };
