import { t as AdminLayout } from "./AdminLayout-qqnefiFY.js";
import { Head, useForm, usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Admin/Profile/Index.jsx
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
			className: "px-6 py-5 space-y-4",
			children
		})]
	});
}
function Field({ label, error, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("label", {
			className: "block text-sm font-medium text-slate-700 mb-1.5",
			children: label
		}),
		children,
		error && /* @__PURE__ */ jsx("p", {
			className: "mt-1 text-xs text-red-600",
			children: error
		})
	] });
}
function Input({ type = "text", value, onChange, placeholder, autoComplete }) {
	return /* @__PURE__ */ jsx("input", {
		type,
		value: value ?? "",
		onChange,
		placeholder,
		autoComplete,
		className: "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
	});
}
function SaveButton({ processing, label = "Simpan" }) {
	return /* @__PURE__ */ jsx("button", {
		type: "submit",
		disabled: processing,
		className: "px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2",
		children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { className: "w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" }), " Menyimpan..."] }) : label
	});
}
function ProfileIndex() {
	const { auth, flash } = usePage().props;
	const user = auth.user;
	const infoForm = useForm({
		name: user.name ?? "",
		email: user.email ?? ""
	});
	const passForm = useForm({
		current_password: "",
		password: "",
		password_confirmation: ""
	});
	const submitInfo = (e) => {
		e.preventDefault();
		infoForm.patch("/admin/profile/info");
	};
	const submitPassword = (e) => {
		e.preventDefault();
		passForm.patch("/admin/profile/password", { onSuccess: () => passForm.reset() });
	};
	return /* @__PURE__ */ jsxs(AdminLayout, {
		title: "Profil",
		children: [/* @__PURE__ */ jsx(Head, { title: "Profil" }), /* @__PURE__ */ jsxs("div", {
			className: "max-w-2xl space-y-6",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-xl font-bold text-slate-800",
					children: "Profil Akun"
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500 mt-1",
					children: "Ubah nama, email, dan password akun admin."
				})] }),
				flash?.success && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm",
					children: ["✓ ", flash.success]
				}),
				flash?.success_password && /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm",
					children: ["✓ ", flash.success_password]
				}),
				/* @__PURE__ */ jsx(Section, {
					title: "Informasi Akun",
					description: "Nama dan email yang digunakan untuk login.",
					children: /* @__PURE__ */ jsxs("form", {
						onSubmit: submitInfo,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Nama",
								error: infoForm.errors.name,
								children: /* @__PURE__ */ jsx(Input, {
									value: infoForm.data.name,
									onChange: (e) => infoForm.setData("name", e.target.value),
									placeholder: "Admin",
									autoComplete: "name"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Email",
								error: infoForm.errors.email,
								children: /* @__PURE__ */ jsx(Input, {
									type: "email",
									value: infoForm.data.email,
									onChange: (e) => infoForm.setData("email", e.target.value),
									placeholder: "admin@example.com",
									autoComplete: "email"
								})
							}),
							/* @__PURE__ */ jsx(SaveButton, {
								processing: infoForm.processing,
								label: "Simpan Informasi"
							})
						]
					})
				}),
				/* @__PURE__ */ jsx(Section, {
					title: "Ubah Password",
					description: "Gunakan password yang kuat dan tidak mudah ditebak.",
					children: /* @__PURE__ */ jsxs("form", {
						onSubmit: submitPassword,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ jsx(Field, {
								label: "Password Lama",
								error: passForm.errors.current_password,
								children: /* @__PURE__ */ jsx(Input, {
									type: "password",
									value: passForm.data.current_password,
									onChange: (e) => passForm.setData("current_password", e.target.value),
									autoComplete: "current-password"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Password Baru",
								error: passForm.errors.password,
								children: /* @__PURE__ */ jsx(Input, {
									type: "password",
									value: passForm.data.password,
									onChange: (e) => passForm.setData("password", e.target.value),
									autoComplete: "new-password"
								})
							}),
							/* @__PURE__ */ jsx(Field, {
								label: "Konfirmasi Password Baru",
								error: passForm.errors.password_confirmation,
								children: /* @__PURE__ */ jsx(Input, {
									type: "password",
									value: passForm.data.password_confirmation,
									onChange: (e) => passForm.setData("password_confirmation", e.target.value),
									autoComplete: "new-password"
								})
							}),
							/* @__PURE__ */ jsx(SaveButton, {
								processing: passForm.processing,
								label: "Ubah Password"
							})
						]
					})
				})
			]
		})]
	});
}
//#endregion
export { ProfileIndex as default };
