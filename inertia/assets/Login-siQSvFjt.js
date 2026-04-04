import { Head, useForm } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
//#region resources/js/Pages/Auth/Login.jsx
function Login() {
	const { data, setData, post, processing, errors } = useForm({
		email: "",
		password: "",
		remember: false
	});
	const submit = (e) => {
		e.preventDefault();
		post("/login");
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Head, { title: "Login Admin" }), /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900",
		children: /* @__PURE__ */ jsx("div", {
			className: "w-full max-w-md px-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "bg-white rounded-2xl shadow-2xl p-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-8",
					children: [/* @__PURE__ */ jsx("h1", {
						className: "text-3xl font-bold text-indigo-900",
						children: "YZ Studio"
					}), /* @__PURE__ */ jsx("p", {
						className: "text-gray-500 mt-2 text-sm",
						children: "Masuk ke panel admin"
					})]
				}), /* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "space-y-5",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-gray-700 mb-1",
								children: "Email"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "email",
								value: data.email,
								onChange: (e) => setData("email", e.target.value),
								className: "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm",
								placeholder: "admin@example.com",
								required: true
							}),
							errors.email && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-red-600",
								children: errors.email
							})
						] }),
						/* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-gray-700 mb-1",
								children: "Password"
							}),
							/* @__PURE__ */ jsx("input", {
								type: "password",
								value: data.password,
								onChange: (e) => setData("password", e.target.value),
								className: "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm",
								placeholder: "••••••••",
								required: true
							}),
							errors.password && /* @__PURE__ */ jsx("p", {
								className: "mt-1 text-xs text-red-600",
								children: errors.password
							})
						] }),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center",
							children: [/* @__PURE__ */ jsx("input", {
								id: "remember",
								type: "checkbox",
								checked: data.remember,
								onChange: (e) => setData("remember", e.target.checked),
								className: "w-4 h-4 text-indigo-600 rounded"
							}), /* @__PURE__ */ jsx("label", {
								htmlFor: "remember",
								className: "ml-2 text-sm text-gray-600",
								children: "Ingat saya"
							})]
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: processing,
							className: "w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
							children: processing ? "Masuk..." : "Masuk"
						})
					]
				})]
			})
		})
	})] });
}
//#endregion
export { Login as default };
