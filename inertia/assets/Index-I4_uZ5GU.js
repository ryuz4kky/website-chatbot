import { t as AdminLayout } from "./AdminLayout-qqnefiFY.js";
import { Head, useForm } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
//#region resources/js/Pages/Admin/Settings/Index.jsx
function Section({ title, description, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-white rounded-xl shadow-sm overflow-hidden",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "px-6 py-4 border-b border-slate-100",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "font-semibold text-slate-800",
				children: title
			}), description && /* @__PURE__ */ jsx("p", {
				className: "text-xs text-slate-400 mt-0.5",
				children: description
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "px-6 py-5 space-y-5",
			children
		})]
	});
}
function Field({ label, hint, error, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("label", {
			className: "block text-sm font-medium text-slate-700 mb-1.5",
			children: label
		}),
		children,
		hint && /* @__PURE__ */ jsx("p", {
			className: "mt-1 text-xs text-slate-400",
			children: hint
		}),
		error && /* @__PURE__ */ jsx("p", {
			className: "mt-1 text-xs text-red-600",
			children: error
		})
	] });
}
function Input({ value, onChange, placeholder, type = "text" }) {
	return /* @__PURE__ */ jsx("input", {
		type,
		value: value ?? "",
		onChange,
		placeholder,
		className: "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
	});
}
function Textarea({ value, onChange, placeholder, rows = 3 }) {
	return /* @__PURE__ */ jsx("textarea", {
		value: value ?? "",
		onChange,
		placeholder,
		rows,
		className: "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
	});
}
function LogoUpload({ label, hint, currentPath, name, onChange, error }) {
	const [preview, setPreview] = useState(null);
	const handleFile = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		onChange(file);
		const reader = new FileReader();
		reader.onload = (ev) => setPreview(ev.target.result);
		reader.readAsDataURL(file);
	};
	const displaySrc = preview || (currentPath ? `/storage/${currentPath}` : null);
	return /* @__PURE__ */ jsx(Field, {
		label,
		hint,
		error,
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-5",
			children: [/* @__PURE__ */ jsx("div", {
				className: "w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0",
				children: displaySrc ? /* @__PURE__ */ jsx("img", {
					src: displaySrc,
					alt: label,
					className: "w-full h-full object-contain p-1"
				}) : /* @__PURE__ */ jsx("span", {
					className: "text-2xl text-slate-300",
					children: "🖼️"
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex-1",
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg cursor-pointer transition-colors",
						children: ["📁 Pilih File", /* @__PURE__ */ jsx("input", {
							type: "file",
							accept: "image/*",
							onChange: handleFile,
							className: "hidden"
						})]
					}),
					displaySrc && !preview && /* @__PURE__ */ jsx("p", {
						className: "mt-1.5 text-xs text-slate-400 truncate max-w-xs",
						children: currentPath
					}),
					preview && /* @__PURE__ */ jsx("p", {
						className: "mt-1.5 text-xs text-green-600",
						children: "✓ File baru dipilih — belum disimpan"
					})
				]
			})]
		})
	});
}
function SettingsIndex({ settings }) {
	const { data, setData, post, processing, errors } = useForm({
		site_name: settings.site_name ?? "",
		site_tagline: settings.site_tagline ?? "",
		site_description: settings.site_description ?? "",
		logo: null,
		favicon: null,
		email: settings.email ?? "",
		phone: settings.phone ?? "",
		whatsapp: settings.whatsapp ?? "",
		address: settings.address ?? "",
		instagram: settings.instagram ?? "",
		facebook: settings.facebook ?? "",
		twitter: settings.twitter ?? "",
		linkedin: settings.linkedin ?? "",
		github: settings.github ?? "",
		footer_text: settings.footer_text ?? "",
		stat1_value: settings.stat1_value ?? "50+",
		stat1_label: settings.stat1_label ?? "Project Selesai",
		stat2_value: settings.stat2_value ?? "98%",
		stat2_label: settings.stat2_label ?? "Client Puas",
		stat3_value: settings.stat3_value ?? "3 Thn",
		stat3_label: settings.stat3_label ?? "Pengalaman"
	});
	const submit = (e) => {
		e.preventDefault();
		post("/admin/settings", { forceFormData: true });
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "Pengaturan",
		children: [/* @__PURE__ */ jsx(Head, { title: "Pengaturan" }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-3xl",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl font-bold text-slate-800",
					children: "Pengaturan Website"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500 mt-1",
					children: "Kelola informasi dan identitas website Anda."
				})]
			}), /* @__PURE__ */ jsxs("form", {
				onSubmit: submit,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsxs(Section, {
						title: "Identitas & Logo",
						description: "Nama, tagline, dan logo yang tampil di website.",
						children: [
							/* @__PURE__ */ jsx(LogoUpload, {
								label: "Logo",
								hint: "PNG/SVG transparan, maks 2MB. Disarankan min 200×60px.",
								currentPath: settings.logo,
								onChange: (file) => setData("logo", file),
								error: errors.logo
							}),
							/* @__PURE__ */ jsx(LogoUpload, {
								label: "Favicon",
								hint: "PNG 32×32px atau 64×64px, maks 512KB.",
								currentPath: settings.favicon,
								onChange: (file) => setData("favicon", file),
								error: errors.favicon
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Nama Website *",
								children: /* @__PURE__ */ jsx(Input, {
									value: data.site_name,
									onChange: (e) => setData("site_name", e.target.value),
									placeholder: "YZ Studio"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Tagline",
								hint: "Slogan singkat yang muncul di hero section.",
								children: /* @__PURE__ */ jsx(Input, {
									value: data.site_tagline,
									onChange: (e) => setData("site_tagline", e.target.value),
									placeholder: "Building digital products that matter."
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Deskripsi Website",
								hint: "Untuk meta description SEO (~150 karakter).",
								children: /* @__PURE__ */ jsx(Textarea, {
									value: data.site_description,
									onChange: (e) => setData("site_description", e.target.value),
									placeholder: "Software house Indonesia spesialis website dan aplikasi web modern."
								})
							})
						]
					}),
					/* @__PURE__ */ jsxs(Section, {
						title: "Informasi Kontak",
						description: "Ditampilkan di section kontak dan footer.",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-5",
							children: [
								/* @__PURE__ */ jsx(Field, {
									label: "Email",
									children: /* @__PURE__ */ jsx(Input, {
										type: "email",
										value: data.email,
										onChange: (e) => setData("email", e.target.value),
										placeholder: "hello@yzstudio.dev"
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Nomor Telepon",
									children: /* @__PURE__ */ jsx(Input, {
										value: data.phone,
										onChange: (e) => setData("phone", e.target.value),
										placeholder: "+62 21-1234-5678"
									})
								}),
								/* @__PURE__ */ jsx(Field, {
									label: "Nomor WhatsApp",
									hint: "Format: 628xxx (tanpa + atau spasi)",
									children: /* @__PURE__ */ jsx(Input, {
										value: data.whatsapp,
										onChange: (e) => setData("whatsapp", e.target.value),
										placeholder: "6281234567890"
									})
								})
							]
						}), /* @__PURE__ */ jsx(Field, {
							label: "Alamat",
							children: /* @__PURE__ */ jsx(Textarea, {
								value: data.address,
								onChange: (e) => setData("address", e.target.value),
								placeholder: "Jakarta, Indonesia",
								rows: 2
							})
						})]
					}),
					/* @__PURE__ */ jsx(Section, {
						title: "Media Sosial",
						description: "Isi URL lengkap akun media sosial Anda.",
						children: /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-5",
							children: [
								{
									key: "instagram",
									label: "Instagram",
									placeholder: "https://instagram.com/yourhandle"
								},
								{
									key: "facebook",
									label: "Facebook",
									placeholder: "https://facebook.com/yourpage"
								},
								{
									key: "twitter",
									label: "Twitter / X",
									placeholder: "https://twitter.com/yourhandle"
								},
								{
									key: "linkedin",
									label: "LinkedIn",
									placeholder: "https://linkedin.com/in/yourprofile"
								},
								{
									key: "github",
									label: "GitHub",
									placeholder: "https://github.com/yourhandle"
								}
							].map((field) => /* @__PURE__ */ jsx(Field, {
								label: field.label,
								children: /* @__PURE__ */ jsx(Input, {
									value: data[field.key],
									onChange: (e) => setData(field.key, e.target.value),
									placeholder: field.placeholder
								})
							}, field.key))
						})
					}),
					/* @__PURE__ */ jsx(Section, {
						title: "Statistik Hero",
						description: "Angka yang ditampilkan di bagian hero halaman utama.",
						children: [
							{
								val: "stat1_value",
								lbl: "stat1_label",
								placeholderVal: "50+",
								placeholderLbl: "Project Selesai"
							},
							{
								val: "stat2_value",
								lbl: "stat2_label",
								placeholderVal: "98%",
								placeholderLbl: "Client Puas"
							},
							{
								val: "stat3_value",
								lbl: "stat3_label",
								placeholderVal: "3 Thn",
								placeholderLbl: "Pengalaman"
							}
						].map((s, i) => /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0",
							children: [/* @__PURE__ */ jsx(Field, {
								label: `Statistik ${i + 1} — Nilai`,
								children: /* @__PURE__ */ jsx(Input, {
									value: data[s.val],
									onChange: (e) => setData(s.val, e.target.value),
									placeholder: s.placeholderVal
								})
							}), /* @__PURE__ */ jsx(Field, {
								label: "Label",
								children: /* @__PURE__ */ jsx(Input, {
									value: data[s.lbl],
									onChange: (e) => setData(s.lbl, e.target.value),
									placeholder: s.placeholderLbl
								})
							})]
						}, s.val))
					}),
					/* @__PURE__ */ jsx(Section, {
						title: "Footer",
						description: "Teks copyright yang muncul di footer website.",
						children: /* @__PURE__ */ jsx(Field, {
							label: "Teks Footer",
							hint: "Tahun akan otomatis ditambahkan di depan teks ini.",
							children: /* @__PURE__ */ jsx(Input, {
								value: data.footer_text,
								onChange: (e) => setData("footer_text", e.target.value),
								placeholder: "YZ Studio. All rights reserved."
							})
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4 pt-2",
						children: [/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: processing,
							className: "px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2",
							children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { className: "w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" }), " Menyimpan..."] }) : "💾 Simpan Pengaturan"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-400",
							children: "Perubahan langsung berlaku di website."
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { SettingsIndex as default };
