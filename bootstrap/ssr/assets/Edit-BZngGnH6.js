import { t as AdminLayout } from "./AdminLayout-qqnefiFY.js";
import { Head, useForm } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
//#region resources/js/Pages/Admin/Portfolio/Edit.jsx
function PortfolioEdit({ portfolio }) {
	const [newGalleryPreviews, setNewGalleryPreviews] = useState([]);
	const [toDelete, setToDelete] = useState([]);
	const { data, setData, post, processing, errors } = useForm({
		_method: "PUT",
		title: portfolio.title,
		description: portfolio.description,
		image: null,
		gallery: [],
		delete_gallery: [],
		demo_link: portfolio.demo_link ?? "",
		technologies: (portfolio.technologies ?? []).join(", "),
		date: portfolio.date ? portfolio.date.substring(0, 10) : "",
		client: portfolio.client ?? "",
		status: portfolio.status ?? "published"
	});
	const handleNewGallery = (e) => {
		const files = Array.from(e.target.files);
		setData("gallery", files);
		setNewGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
	};
	const toggleDelete = (path) => {
		const updated = toDelete.includes(path) ? toDelete.filter((p) => p !== path) : [...toDelete, path];
		setToDelete(updated);
		setData("delete_gallery", updated);
	};
	const submit = (e) => {
		e.preventDefault();
		post(`/admin/portfolios/${portfolio.id}`, { forceFormData: true });
	};
	const currentGallery = (portfolio.gallery ?? []).filter((g) => g !== portfolio.image);
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "Edit Portfolio",
		children: [/* @__PURE__ */ jsx(Head, { title: "Edit Portfolio" }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-3xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3 mb-6",
				children: [
					/* @__PURE__ */ jsx("a", {
						href: "/admin/portfolios",
						className: "text-slate-400 hover:text-slate-600 text-sm",
						children: "← Kembali"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-xl font-bold text-slate-800",
						children: "Edit Portfolio"
					}),
					/* @__PURE__ */ jsx("a", {
						href: `/portfolio/${portfolio.id}`,
						target: "_blank",
						className: "ml-auto text-xs text-indigo-600 hover:underline",
						children: "Lihat halaman ↗"
					})
				]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl shadow-sm p-6 space-y-5",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "font-semibold text-slate-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-3",
								children: "Informasi Dasar"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-5",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "sm:col-span-2",
										children: [
											/* @__PURE__ */ jsx("label", {
												className: "block text-sm font-medium text-slate-700 mb-1.5",
												children: "Judul *"
											}),
											/* @__PURE__ */ jsx("input", {
												type: "text",
												value: data.title,
												onChange: (e) => setData("title", e.target.value),
												className: "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
											}),
											errors.title && /* @__PURE__ */ jsx("p", {
												className: "mt-1 text-xs text-red-600",
												children: errors.title
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-slate-700 mb-1.5",
										children: "Nama Client"
									}), /* @__PURE__ */ jsx("input", {
										type: "text",
										value: data.client,
										onChange: (e) => setData("client", e.target.value),
										className: "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500",
										placeholder: "PT. Maju Bersama"
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [
										/* @__PURE__ */ jsx("label", {
											className: "block text-sm font-medium text-slate-700 mb-1.5",
											children: "Tanggal *"
										}),
										/* @__PURE__ */ jsx("input", {
											type: "date",
											value: data.date,
											onChange: (e) => setData("date", e.target.value),
											className: "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
										}),
										errors.date && /* @__PURE__ */ jsx("p", {
											className: "mt-1 text-xs text-red-600",
											children: errors.date
										})
									] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-slate-700 mb-1.5",
										children: "Link Demo"
									}), /* @__PURE__ */ jsx("input", {
										type: "url",
										value: data.demo_link,
										onChange: (e) => setData("demo_link", e.target.value),
										className: "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500",
										placeholder: "https://..."
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
										className: "block text-sm font-medium text-slate-700 mb-1.5",
										children: "Status"
									}), /* @__PURE__ */ jsxs("select", {
										value: data.status,
										onChange: (e) => setData("status", e.target.value),
										className: "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white",
										children: [/* @__PURE__ */ jsx("option", {
											value: "published",
											children: "Published"
										}), /* @__PURE__ */ jsx("option", {
											value: "draft",
											children: "Draft"
										})]
									})] })
								]
							}),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-slate-700 mb-1.5",
									children: "Teknologi"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: data.technologies,
									onChange: (e) => setData("technologies", e.target.value),
									className: "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500",
									placeholder: "Laravel, React, MySQL"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-slate-400",
									children: "Pisahkan dengan koma"
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-slate-700 mb-1.5",
									children: "Deskripsi *"
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: data.description,
									onChange: (e) => setData("description", e.target.value),
									rows: 5,
									className: "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
								}),
								errors.description && /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-red-600",
									children: errors.description
								})
							] })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white rounded-xl shadow-sm p-6 space-y-6",
						children: [
							/* @__PURE__ */ jsx("h3", {
								className: "font-semibold text-slate-700 text-sm uppercase tracking-wide border-b border-slate-100 pb-3",
								children: "Gambar"
							}),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-slate-700 mb-2",
									children: "Gambar Cover"
								}),
								portfolio.image && /* @__PURE__ */ jsx("div", {
									className: "mb-3 rounded-xl overflow-hidden bg-slate-100 w-48",
									style: { aspectRatio: "16/9" },
									children: /* @__PURE__ */ jsx("img", {
										src: `/storage/${portfolio.image}`,
										alt: "Cover",
										className: "w-full h-full object-cover"
									})
								}),
								/* @__PURE__ */ jsx("input", {
									type: "file",
									accept: "image/jpeg,image/png,image/webp",
									onChange: (e) => setData("image", e.target.files[0]),
									className: "w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-slate-400",
									children: "Kosongkan jika tidak ingin mengganti cover."
								}),
								errors.image && /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-red-600",
									children: errors.image
								})
							] }),
							currentGallery.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("label", {
									className: "block text-sm font-medium text-slate-700 mb-2",
									children: ["Gallery Saat Ini ", /* @__PURE__ */ jsx("span", {
										className: "text-slate-400 font-normal",
										children: "(centang untuk hapus)"
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-4 gap-2",
									children: currentGallery.map((img, i) => {
										const marked = toDelete.includes(img);
										return /* @__PURE__ */ jsxs("div", {
											className: `relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${marked ? "border-red-500 opacity-50" : "border-transparent"}`,
											style: { aspectRatio: "16/9" },
											onClick: () => toggleDelete(img),
											children: [/* @__PURE__ */ jsx("img", {
												src: `/storage/${img}`,
												alt: "",
												className: "w-full h-full object-cover"
											}), marked && /* @__PURE__ */ jsx("div", {
												className: "absolute inset-0 bg-red-500/20 flex items-center justify-center",
												children: /* @__PURE__ */ jsx("span", {
													className: "text-red-600 font-bold text-lg",
													children: "✕"
												})
											})]
										}, i);
									})
								}),
								toDelete.length > 0 && /* @__PURE__ */ jsxs("p", {
									className: "mt-2 text-xs text-red-600",
									children: [toDelete.length, " gambar akan dihapus saat disimpan."]
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-sm font-medium text-slate-700 mb-1.5",
									children: "Tambah Foto Gallery"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "file",
									accept: "image/jpeg,image/png,image/webp",
									multiple: true,
									onChange: handleNewGallery,
									className: "w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
								}),
								newGalleryPreviews.length > 0 && /* @__PURE__ */ jsx("div", {
									className: "mt-3 grid grid-cols-4 gap-2",
									children: newGalleryPreviews.map((src, i) => /* @__PURE__ */ jsx("div", {
										className: "rounded-xl overflow-hidden bg-slate-100 ring-2 ring-indigo-400",
										style: { aspectRatio: "16/9" },
										children: /* @__PURE__ */ jsx("img", {
											src,
											alt: "",
											className: "w-full h-full object-cover"
										})
									}, i))
								})
							] })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: processing,
							className: "px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2",
							children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { className: "w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" }), " Menyimpan..."] }) : "💾 Simpan Perubahan"
						}), /* @__PURE__ */ jsx("a", {
							href: "/admin/portfolios",
							className: "px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors",
							children: "Batal"
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { PortfolioEdit as default };
