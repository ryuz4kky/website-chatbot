import { createInertiaApp } from "@inertiajs/react";
import ReactDOMServer from "react-dom/server";
import { jsx } from "react/jsx-runtime";
//#region node_modules/laravel-vite-plugin/inertia-helpers/index.js
async function resolvePageComponent(path, pages) {
	for (const p of Array.isArray(path) ? path : [path]) {
		const page = pages[p];
		if (typeof page === "undefined") continue;
		return typeof page === "function" ? page() : page;
	}
	throw new Error(`Page not found: ${path}`);
}
//#endregion
//#region resources/js/ssr.jsx
var appName = "YZ Studio";
var ssr_default = (page) => createInertiaApp({
	page,
	title: (title) => title ? `${title}` : appName,
	render: ReactDOMServer.renderToString,
	resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, /* @__PURE__ */ Object.assign({
		"./Pages/Admin/Chat/Index.jsx": () => import("./assets/Index-c3Pt8OMy.js"),
		"./Pages/Admin/Chat/Show.jsx": () => import("./assets/Show-nnLDaMp8.js"),
		"./Pages/Admin/Dashboard.jsx": () => import("./assets/Dashboard-CmLLkhbt.js"),
		"./Pages/Admin/Messages/Index.jsx": () => import("./assets/Index-jIw5UkVV.js"),
		"./Pages/Admin/Portfolio/Create.jsx": () => import("./assets/Create-BFImvSTS.js"),
		"./Pages/Admin/Portfolio/Edit.jsx": () => import("./assets/Edit-BZngGnH6.js"),
		"./Pages/Admin/Portfolio/Index.jsx": () => import("./assets/Index-C6hBWhdT.js"),
		"./Pages/Admin/Profile/Index.jsx": () => import("./assets/Index-Cmgrp_-d.js"),
		"./Pages/Admin/Service/Create.jsx": () => import("./assets/Create-BSckOHPw.js"),
		"./Pages/Admin/Service/Edit.jsx": () => import("./assets/Edit-Do1IVI6E.js"),
		"./Pages/Admin/Service/Index.jsx": () => import("./assets/Index-0O8Hf2kh.js"),
		"./Pages/Admin/Settings/Index.jsx": () => import("./assets/Index-I4_uZ5GU.js"),
		"./Pages/Auth/Login.jsx": () => import("./assets/Login-siQSvFjt.js"),
		"./Pages/Contact.jsx": () => import("./assets/Contact-CR2JDCFU.js"),
		"./Pages/Portfolio/Show.jsx": () => import("./assets/Show-SeeCbt4U.js")
	})),
	setup({ App, props }) {
		return /* @__PURE__ */ jsx(App, { ...props });
	}
});
//#endregion
export { ssr_default as default };
