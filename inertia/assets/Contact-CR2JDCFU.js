import { Head, useForm, usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
//#region resources/js/Components/Chatbot.jsx
function getCsrf() {
	const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
	return match ? decodeURIComponent(match[1]) : "";
}
async function postJson(url, body) {
	const res = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"X-XSRF-TOKEN": getCsrf()
		},
		body: JSON.stringify(body)
	});
	if (!(res.headers.get("content-type") ?? "").includes("application/json")) throw new Error(`HTTP ${res.status}`);
	const data = await res.json();
	if (!res.ok) {
		const msg = data?.message ?? `Error ${res.status}`;
		throw new Error(msg);
	}
	return data;
}
function TypingDots() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex justify-start",
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "w-2 h-2 bg-slate-400 rounded-full animate-bounce",
					style: { animationDelay: "0ms" }
				}),
				/* @__PURE__ */ jsx("span", {
					className: "w-2 h-2 bg-slate-400 rounded-full animate-bounce",
					style: { animationDelay: "150ms" }
				}),
				/* @__PURE__ */ jsx("span", {
					className: "w-2 h-2 bg-slate-400 rounded-full animate-bounce",
					style: { animationDelay: "300ms" }
				})
			]
		})
	});
}
function Chatbot({ siteName = "YZ Studio" }) {
	const [mounted, setMounted] = useState(false);
	const [open, setOpen] = useState(false);
	const [step, setStep] = useState("form");
	const [messages, setMessages] = useState([]);
	const [sessionId, setSessionId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [input, setInput] = useState("");
	const [name, setName] = useState("");
	const [firstMsg, setFirstMsg] = useState("");
	const [formErrors, setFormErrors] = useState({});
	const bottomRef = useRef(null);
	const inputRef = useRef(null);
	useEffect(() => {
		setMounted(true);
	}, []);
	useEffect(() => {
		if (open && step === "chat") bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, open]);
	useEffect(() => {
		if (open && step === "chat") inputRef.current?.focus();
	}, [open, step]);
	const validateForm = () => {
		const errors = {};
		if (!name.trim()) errors.name = "Nama wajib diisi.";
		if (!firstMsg.trim()) errors.firstMsg = "Pertanyaan wajib diisi.";
		return errors;
	};
	const startChat = async () => {
		const errors = validateForm();
		if (Object.keys(errors).length) {
			setFormErrors(errors);
			return;
		}
		setLoading(true);
		setFormErrors({});
		const userMsg = firstMsg.trim();
		setStep("chat");
		setMessages([{
			role: "user",
			content: userMsg
		}]);
		try {
			const data = await postJson("/chat/init", {
				name: name.trim(),
				message: userMsg
			});
			setSessionId(data.session_id);
			setMessages((prev) => [...prev, {
				role: "model",
				content: data.reply
			}]);
		} catch (e) {
			const errMsg = e?.message?.includes("429") || e?.message?.toLowerCase().includes("quota") ? "AI sedang sibuk, coba beberapa saat lagi." : "Maaf, terjadi kesalahan koneksi. Coba lagi.";
			setMessages((prev) => [...prev, {
				role: "model",
				content: errMsg
			}]);
		} finally {
			setLoading(false);
		}
	};
	const sendMessage = async () => {
		const text = input.trim();
		if (!text || loading) return;
		setInput("");
		setMessages((prev) => [...prev, {
			role: "user",
			content: text
		}]);
		setLoading(true);
		try {
			const data = await postJson("/chat/send", {
				session_id: sessionId,
				message: text
			});
			setMessages((prev) => [...prev, {
				role: "model",
				content: data.reply
			}]);
		} catch (e) {
			const errMsg = e?.message?.includes("429") || e?.message?.toLowerCase().includes("quota") ? "AI sedang sibuk, coba beberapa saat lagi." : "Maaf, terjadi kesalahan koneksi. Coba lagi.";
			setMessages((prev) => [...prev, {
				role: "model",
				content: errMsg
			}]);
		} finally {
			setLoading(false);
		}
	};
	const handleKey = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};
	const reset = () => {
		setStep("form");
		setMessages([]);
		setSessionId(null);
		setName("");
		setFirstMsg("");
		setFormErrors({});
		setInput("");
	};
	if (!mounted) return null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
		onClick: () => setOpen((o) => !o),
		className: "fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg hover:shadow-indigo-500/40 transition-all duration-200 flex items-center justify-center text-2xl",
		"aria-label": "Buka chat",
		children: open ? "✕" : "💬"
	}), /* @__PURE__ */ jsxs("div", {
		className: `fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`,
		style: { height: "520px" },
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "bg-indigo-600 px-4 py-3.5 flex items-center gap-3 shrink-0",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm",
						children: "🤖"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ jsx("p", {
							className: "text-white font-semibold text-sm leading-tight",
							children: "AI Assistant"
						}), /* @__PURE__ */ jsx("p", {
							className: "text-indigo-200 text-xs",
							children: siteName
						})]
					}),
					step === "chat" && /* @__PURE__ */ jsx("button", {
						onClick: reset,
						className: "text-indigo-200 hover:text-white text-xs transition-colors",
						children: "Chat baru"
					})
				]
			}),
			step === "form" && /* @__PURE__ */ jsxs("div", {
				className: "flex-1 overflow-y-auto p-4 space-y-3",
				children: [
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-slate-500 text-center pt-2",
						children: "Halo! Isi data di bawah untuk mulai chat dengan AI kami 👋"
					}),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("input", {
						type: "text",
						placeholder: "Nama kamu",
						value: name,
						onChange: (e) => setName(e.target.value),
						className: "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
					}), formErrors.name && /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs text-red-500",
						children: formErrors.name
					})] }),
					/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("textarea", {
						placeholder: "Apa yang ingin kamu tanyakan?",
						value: firstMsg,
						onChange: (e) => setFirstMsg(e.target.value),
						rows: 3,
						className: "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
					}), formErrors.firstMsg && /* @__PURE__ */ jsx("p", {
						className: "mt-1 text-xs text-red-500",
						children: formErrors.firstMsg
					})] }),
					/* @__PURE__ */ jsx("button", {
						onClick: startChat,
						disabled: loading,
						className: "w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2",
						children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), " Memproses..."] }) : "Mulai Chat →"
					})
				]
			}),
			step === "chat" && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
				className: "flex-1 overflow-y-auto px-4 py-4 space-y-3",
				children: [
					messages.map((msg, i) => /* @__PURE__ */ jsx("div", {
						className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
						children: /* @__PURE__ */ jsx("div", {
							className: `max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${msg.role === "user" ? "bg-indigo-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-800 rounded-bl-sm"}`,
							children: msg.content
						})
					}, i)),
					loading && /* @__PURE__ */ jsx(TypingDots, {}),
					/* @__PURE__ */ jsx("div", { ref: bottomRef })
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "px-3 py-3 border-t border-slate-100 flex gap-2 shrink-0",
				children: [/* @__PURE__ */ jsx("textarea", {
					ref: inputRef,
					value: input,
					onChange: (e) => setInput(e.target.value),
					onKeyDown: handleKey,
					placeholder: "Tulis pesan...",
					rows: 1,
					className: "flex-1 px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none",
					style: { maxHeight: "80px" }
				}), /* @__PURE__ */ jsx("button", {
					onClick: sendMessage,
					disabled: loading || !input.trim(),
					className: "w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shrink-0 self-end",
					children: "➤"
				})]
			})] })
		]
	})] });
}
//#endregion
//#region resources/js/Pages/Contact.jsx
function formatIdr(price) {
	const amount = Number(price);
	if (!Number.isFinite(amount) || amount <= 0) return "Harga Fleksibel";
	return `Mulai Rp ${Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}
function formatMonthYear(dateValue) {
	if (!dateValue) return "";
	const date = new Date(dateValue);
	if (Number.isNaN(date.getTime())) return "";
	return `${[
		"Januari",
		"Februari",
		"Maret",
		"April",
		"Mei",
		"Juni",
		"Juli",
		"Agustus",
		"September",
		"Oktober",
		"November",
		"Desember"
	][date.getMonth()]} ${date.getFullYear()}`;
}
function Navbar() {
	const { settings } = usePage().props;
	const [scrolled, setScrolled] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	useEffect(() => {
		const onResize = () => {
			if (window.innerWidth >= 768) setMenuOpen(false);
		};
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);
	const links = [
		{
			href: "#hero",
			label: "Beranda"
		},
		{
			href: "#services",
			label: "Layanan"
		},
		{
			href: "#portfolio",
			label: "Portfolio"
		},
		{
			href: "#why-us",
			label: "Kenapa Kami"
		},
		{
			href: "#contact",
			label: "Kontak"
		}
	];
	const siteName = settings?.site_name || "YZ Studio";
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("nav", {
		className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"}`,
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-6xl mx-auto px-6 h-16 flex items-center justify-between",
			children: [
				/* @__PURE__ */ jsx("a", {
					href: "#hero",
					className: "flex items-center shrink-0",
					children: settings?.logo ? /* @__PURE__ */ jsx("img", {
						src: `/storage/${settings.logo}`,
						alt: siteName,
						className: `h-12 w-auto max-w-[200px] object-contain transition-all ${scrolled ? "brightness-0" : "brightness-0 invert"}`
					}) : /* @__PURE__ */ jsxs("span", {
						className: `text-xl font-bold tracking-tight transition-colors ${scrolled ? "text-slate-900" : "text-white"}`,
						children: [siteName.split(" ")[0], /* @__PURE__ */ jsx("span", {
							className: "text-indigo-500",
							children: siteName.split(" ").slice(1).join(" ") || ""
						})]
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "hidden md:flex items-center gap-7",
					children: [links.map((l) => /* @__PURE__ */ jsx("a", {
						href: l.href,
						className: `text-sm font-medium transition-colors hover:text-indigo-500 ${scrolled ? "text-slate-600" : "text-white/80"}`,
						children: l.label
					}, l.href)), /* @__PURE__ */ jsx("a", {
						href: "#contact",
						className: "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors",
						children: "Mulai Project"
					})]
				}),
				/* @__PURE__ */ jsx("button", {
					onClick: () => setMenuOpen(!menuOpen),
					className: `md:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-slate-700" : "text-white"}`,
					"aria-label": "Toggle menu",
					children: menuOpen ? "✕" : "☰"
				})
			]
		})
	}), /* @__PURE__ */ jsxs("div", {
		className: `fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`,
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0 bg-slate-900/80 backdrop-blur-sm",
			onClick: () => setMenuOpen(false)
		}), /* @__PURE__ */ jsxs("div", {
			className: `absolute top-0 right-0 w-72 h-full bg-white flex flex-col shadow-2xl transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`,
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "h-16 flex items-center justify-between px-6 border-b border-slate-100",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-bold text-slate-800",
						children: siteName
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setMenuOpen(false),
						className: "p-2 text-slate-400 hover:text-slate-700",
						children: "✕"
					})]
				}),
				/* @__PURE__ */ jsx("nav", {
					className: "flex-1 px-6 py-6 space-y-1 overflow-y-auto",
					children: links.map((l) => /* @__PURE__ */ jsx("a", {
						href: l.href,
						onClick: () => setMenuOpen(false),
						className: "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors",
						children: l.label
					}, l.href))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "px-6 pb-8",
					children: /* @__PURE__ */ jsx("a", {
						href: "#contact",
						onClick: () => setMenuOpen(false),
						className: "block w-full text-center px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors",
						children: "Mulai Project"
					})
				})
			]
		})]
	})] });
}
function Hero() {
	const { settings } = usePage().props;
	return /* @__PURE__ */ jsxs("section", {
		id: "hero",
		className: "relative min-h-screen flex items-center overflow-hidden bg-slate-900",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "absolute inset-0 overflow-hidden pointer-events-none",
				children: [
					/* @__PURE__ */ jsx("div", { className: "absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl" }),
					/* @__PURE__ */ jsx("div", { className: "absolute top-1/2 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" }),
					/* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl" })
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute inset-0 opacity-[0.03]",
				style: {
					backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
					backgroundSize: "32px 32px"
				}
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative max-w-6xl mx-auto px-6 py-32 text-center",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium mb-8 animate-fade-in",
						children: [/* @__PURE__ */ jsx("span", { className: "w-2 h-2 bg-indigo-400 rounded-full animate-pulse" }), "Available for new projects"]
					}),
					/* @__PURE__ */ jsxs("h1", {
						className: "text-5xl md:text-7xl font-bold text-white leading-tight mb-6 animate-fade-in-up",
						children: [
							"Jasa Pembuatan",
							/* @__PURE__ */ jsx("span", {
								className: "block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400",
								children: "Website & Aplikasi"
							}),
							"Profesional"
						]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-100",
						children: "Software house Indonesia spesialis website, aplikasi web, dan solusi digital untuk bisnis yang ingin berkembang lebih cepat."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-200",
						children: [/* @__PURE__ */ jsx("a", {
							href: "#contact",
							className: "inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25",
							children: "💬 Diskusi Project"
						}), /* @__PURE__ */ jsx("a", {
							href: "#portfolio",
							className: "inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10 transition-all duration-200",
							children: "Lihat Portfolio →"
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto animate-fade-in-up delay-300",
						children: [
							{
								value: settings?.stat1_value || "50+",
								label: settings?.stat1_label || "Project Selesai"
							},
							{
								value: settings?.stat2_value || "98%",
								label: settings?.stat2_label || "Client Puas"
							},
							{
								value: settings?.stat3_value || "3 Thn",
								label: settings?.stat3_label || "Pengalaman"
							}
						].map((s) => /* @__PURE__ */ jsxs("div", {
							className: "text-center",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-2xl md:text-3xl font-bold text-white",
								children: s.value
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 mt-1",
								children: s.label
							})]
						}, s.label))
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute bottom-8 left-1/2 -translate-x-1/2 animate-float",
				children: /* @__PURE__ */ jsx("div", {
					className: "w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1",
					children: /* @__PURE__ */ jsx("div", { className: "w-1 h-2 bg-white/40 rounded-full animate-bounce" })
				})
			})
		]
	});
}
function Services({ services }) {
	if (!services?.length) return null;
	return /* @__PURE__ */ jsx("section", {
		id: "services",
		className: "py-24 bg-white",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-6xl mx-auto px-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-center mb-16",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 block",
						children: "Apa yang kami tawarkan"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-4xl font-bold text-slate-900 mb-4",
						children: "Layanan Kami"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-500 max-w-xl mx-auto",
						children: "Solusi digital end-to-end untuk membantu bisnis Anda tumbuh lebih cepat dan efisien."
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
				children: services.map((service, i) => /* @__PURE__ */ jsxs("div", {
					className: "card-hover group p-8 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:bg-indigo-50/30 cursor-default",
					style: { animationDelay: `${i * .1}s` },
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "w-14 h-14 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 flex items-center justify-center text-2xl mb-6 transition-colors",
							children: service.icon || "⚙️"
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-lg font-bold text-slate-800 mb-2",
							children: service.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-slate-500 text-sm leading-relaxed mb-6",
							children: service.description
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between pt-4 border-t border-slate-100",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-sm font-semibold text-indigo-600",
								children: formatIdr(service.price)
							}), /* @__PURE__ */ jsx("a", {
								href: "#contact",
								className: "text-xs font-medium text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center gap-1",
								children: "Pesan →"
							})]
						})
					]
				}, service.id))
			})]
		})
	});
}
function PortfolioCard({ portfolio }) {
	const [imgLoaded, setImgLoaded] = useState(false);
	const [imgError, setImgError] = useState(false);
	return /* @__PURE__ */ jsxs("div", {
		className: "card-hover group rounded-2xl overflow-hidden bg-white border border-slate-100",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "relative w-full overflow-hidden bg-slate-100",
			style: { aspectRatio: "16/9" },
			children: [
				!imgLoaded && !imgError && portfolio.image && /* @__PURE__ */ jsx("div", { className: "absolute inset-0 skeleton" }),
				portfolio.image && !imgError ? /* @__PURE__ */ jsx("img", {
					src: `/storage/${portfolio.image}`,
					alt: `${portfolio.title} — Contoh Project Portfolio`,
					loading: "lazy",
					onLoad: () => setImgLoaded(true),
					onError: () => setImgError(true),
					className: `w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`
				}) : /* @__PURE__ */ jsxs("div", {
					className: "w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-5xl mb-2",
						children: "🖥️"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs text-slate-400",
						children: portfolio.title
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex gap-2",
						children: [/* @__PURE__ */ jsx("a", {
							href: `/portfolio/${portfolio.id}`,
							className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-900 text-xs font-semibold rounded-lg hover:bg-indigo-50 transition-colors",
							children: "Detail →"
						}), portfolio.demo_link && /* @__PURE__ */ jsx("a", {
							href: portfolio.demo_link,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors",
							children: "Demo ↗"
						})]
					})
				})
			]
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-5",
			children: [
				/* @__PURE__ */ jsx("h3", {
					className: "font-bold text-slate-800 mb-1.5 truncate",
					children: portfolio.title
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4",
					children: portfolio.description
				}),
				portfolio.technologies?.length > 0 && /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap gap-1.5",
					children: [portfolio.technologies.slice(0, 4).map((tech, i) => /* @__PURE__ */ jsx("span", {
						className: "px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full",
						children: tech
					}, i)), portfolio.technologies.length > 4 && /* @__PURE__ */ jsxs("span", {
						className: "px-2.5 py-0.5 bg-slate-100 text-slate-400 text-xs rounded-full",
						children: ["+", portfolio.technologies.length - 4]
					})]
				}),
				formatMonthYear(portfolio.date) && /* @__PURE__ */ jsx("p", {
					className: "text-xs text-slate-400 mt-3",
					children: formatMonthYear(portfolio.date)
				})
			]
		})]
	});
}
function Portfolio({ portfolios }) {
	if (!portfolios?.length) return null;
	return /* @__PURE__ */ jsx("section", {
		id: "portfolio",
		className: "py-24 bg-slate-50",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-6xl mx-auto px-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-center mb-16",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 block",
						children: "Hasil Kerja Kami"
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-4xl font-bold text-slate-900 mb-4",
						children: "Portfolio"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-500 max-w-xl mx-auto",
						children: "Beberapa proyek terbaik yang telah kami selesaikan untuk klien dari berbagai industri."
					})
				]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
				children: portfolios.map((p) => /* @__PURE__ */ jsx(PortfolioCard, { portfolio: p }, p.id))
			})]
		})
	});
}
function WhyUs() {
	return /* @__PURE__ */ jsx("section", {
		id: "why-us",
		className: "py-24 bg-white",
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-6xl mx-auto px-6",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 block",
						children: "Kenapa Pilih Kami"
					}),
					/* @__PURE__ */ jsxs("h2", {
						className: "text-4xl font-bold text-slate-900 mb-6 leading-tight",
						children: ["Partner Terpercaya untuk", /* @__PURE__ */ jsx("span", {
							className: "text-indigo-600",
							children: " Transformasi Digital"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-500 leading-relaxed mb-8",
						children: "Kami bukan sekadar vendor — kami adalah mitra bisnis yang peduli dengan pertumbuhan jangka panjang Anda. Setiap baris kode kami tulis dengan standar kualitas tertinggi."
					}),
					/* @__PURE__ */ jsx("a", {
						href: "#contact",
						className: "inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors",
						children: "Konsultasi Gratis →"
					})
				] }), /* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
					children: [
						{
							icon: "⚡",
							title: "Pengiriman Tepat Waktu",
							desc: "Kami berkomitmen pada deadline yang sudah disepakati bersama."
						},
						{
							icon: "🔧",
							title: "Support Purna Jual",
							desc: "Maintenance dan support tersedia setelah project selesai."
						},
						{
							icon: "🎨",
							title: "Desain Modern",
							desc: "UI/UX yang clean, responsif, dan sesuai tren terkini."
						},
						{
							icon: "📈",
							title: "Skalabel",
							desc: "Arsitektur yang dapat berkembang seiring pertumbuhan bisnis."
						}
					].map((r, i) => /* @__PURE__ */ jsxs("div", {
						className: "p-6 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors group",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-3xl mb-4 block",
								children: r.icon
							}),
							/* @__PURE__ */ jsx("h4", {
								className: "font-bold text-slate-800 mb-2 text-sm",
								children: r.title
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-slate-500 text-xs leading-relaxed",
								children: r.desc
							})
						]
					}, i))
				})]
			})
		})
	});
}
function Contact() {
	const { flash, settings } = usePage().props;
	const { data, setData, post, processing, errors, reset } = useForm({
		name: "",
		whatsapp: "",
		message: ""
	});
	const submit = (e) => {
		e.preventDefault();
		post("/contact", { onSuccess: () => reset() });
	};
	const contactItems = [
		settings?.whatsapp && {
			icon: "📱",
			label: "WhatsApp",
			value: settings.whatsapp
		},
		settings?.email && {
			icon: "📧",
			label: "Email",
			value: settings.email
		},
		settings?.address && {
			icon: "📍",
			label: "Lokasi",
			value: settings.address
		}
	].filter(Boolean);
	const displayItems = contactItems.length > 0 ? contactItems : [
		{
			icon: "📱",
			label: "WhatsApp",
			value: "Belum dikonfigurasi"
		},
		{
			icon: "📧",
			label: "Email",
			value: "Belum dikonfigurasi"
		},
		{
			icon: "📍",
			label: "Lokasi",
			value: "Indonesia (Remote Friendly)"
		}
	];
	return /* @__PURE__ */ jsx("section", {
		id: "contact",
		className: "py-24 bg-slate-900",
		children: /* @__PURE__ */ jsx("div", {
			className: "max-w-6xl mx-auto px-6",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-2 gap-16 items-start",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx("span", {
						className: "text-xs font-bold uppercase tracking-widest text-indigo-400 mb-3 block",
						children: "Hubungi Kami"
					}),
					/* @__PURE__ */ jsxs("h2", {
						className: "text-4xl font-bold text-white mb-6 leading-tight",
						children: ["Siap Memulai", /* @__PURE__ */ jsx("span", {
							className: "text-indigo-400",
							children: " Project Anda?"
						})]
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-slate-400 leading-relaxed mb-10",
						children: "Ceritakan kebutuhan Anda, dan tim kami akan merespons dalam waktu kurang dari 1×24 jam via WhatsApp."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "space-y-5",
						children: displayItems.map((item) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-4",
							children: [/* @__PURE__ */ jsx("div", {
								className: "w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-lg shrink-0",
								children: item.icon
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-xs text-slate-500 mb-0.5",
								children: item.label
							}), /* @__PURE__ */ jsx("p", {
								className: "text-sm text-slate-200 font-medium",
								children: item.value
							})] })]
						}, item.label))
					})
				] }), /* @__PURE__ */ jsxs("div", {
					className: "bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8",
					children: [flash?.success && /* @__PURE__ */ jsxs("div", {
						className: "mb-6 px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm text-center",
						children: ["✅ ", flash.success]
					}), /* @__PURE__ */ jsxs("form", {
						onSubmit: submit,
						className: "space-y-5",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2",
									children: "Nama Lengkap *"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "text",
									value: data.name,
									onChange: (e) => setData("name", e.target.value),
									className: "w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all",
									placeholder: "Budi Santoso"
								}),
								errors.name && /* @__PURE__ */ jsx("p", {
									className: "mt-1.5 text-xs text-red-400",
									children: errors.name
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2",
									children: "Nomor WhatsApp *"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "tel",
									value: data.whatsapp,
									onChange: (e) => setData("whatsapp", e.target.value),
									className: "w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all",
									placeholder: "08123456789"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1.5 text-xs text-slate-600",
									children: "Format: 08xxx atau 628xxx"
								}),
								errors.whatsapp && /* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs text-red-400",
									children: errors.whatsapp
								})
							] }),
							/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsx("label", {
									className: "block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2",
									children: "Pesan / Kebutuhan *"
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: data.message,
									onChange: (e) => setData("message", e.target.value),
									rows: 5,
									className: "w-full px-4 py-3 bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all resize-none",
									placeholder: "Ceritakan proyek Anda, anggaran, dan timeline yang diinginkan..."
								}),
								errors.message && /* @__PURE__ */ jsx("p", {
									className: "mt-1.5 text-xs text-red-400",
									children: errors.message
								})
							] }),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: processing,
								className: "w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/25",
								children: processing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), " Mengirim..."] }) : /* @__PURE__ */ jsx(Fragment, { children: "Kirim Pesan via WhatsApp 💬" })
							})
						]
					})]
				})]
			})
		})
	});
}
function Footer() {
	const { settings } = usePage().props;
	const siteName = settings?.site_name || "YZ Studio";
	const tagline = settings?.site_tagline || "Building digital products that matter.";
	const footerText = settings?.footer_text || `${siteName}. All rights reserved.`;
	const socials = [
		{
			key: "instagram",
			icon: "📸",
			label: "Instagram"
		},
		{
			key: "facebook",
			icon: "📘",
			label: "Facebook"
		},
		{
			key: "twitter",
			icon: "🐦",
			label: "Twitter"
		},
		{
			key: "linkedin",
			icon: "💼",
			label: "LinkedIn"
		},
		{
			key: "github",
			icon: "🐙",
			label: "GitHub"
		}
	].filter((s) => settings?.[s.key]);
	return /* @__PURE__ */ jsx("footer", {
		className: "bg-slate-950 border-t border-slate-800",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-6xl mx-auto px-6 py-10",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col md:flex-row items-start justify-between gap-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "max-w-xs",
					children: [
						settings?.logo ? /* @__PURE__ */ jsx("img", {
							src: `/storage/${settings.logo}`,
							alt: siteName,
							className: "h-10 w-auto object-contain brightness-0 invert mb-3"
						}) : /* @__PURE__ */ jsx("p", {
							className: "text-lg font-bold text-white mb-1",
							children: siteName
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-slate-500",
							children: tagline
						}),
						socials.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "flex gap-3 mt-4",
							children: socials.map((s) => /* @__PURE__ */ jsx("a", {
								href: settings[s.key],
								target: "_blank",
								rel: "noopener noreferrer",
								title: s.label,
								className: "w-8 h-8 rounded-lg bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-sm transition-colors",
								children: s.icon
							}, s.key))
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-6 text-sm text-slate-500",
					children: [
						/* @__PURE__ */ jsx("a", {
							href: "#services",
							className: "hover:text-slate-300 transition-colors",
							children: "Layanan"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#portfolio",
							className: "hover:text-slate-300 transition-colors",
							children: "Portfolio"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#contact",
							className: "hover:text-slate-300 transition-colors",
							children: "Kontak"
						}),
						/* @__PURE__ */ jsx("a", {
							href: "/login",
							className: "hover:text-slate-300 transition-colors",
							children: "Admin"
						})
					]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-600",
				children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ",
					footerText
				]
			})]
		})
	});
}
function ContactPage({ portfolios, services }) {
	const { settings } = usePage().props;
	const siteName = settings?.site_name || "YZ Studio";
	const siteDesc = settings?.site_description || "Software house Indonesia spesialis pembuatan website, aplikasi web, dan solusi digital profesional untuk bisnis modern. Berpengalaman 3+ tahun, 50+ project selesai.";
	const siteTagline = settings?.site_tagline || "Software House Indonesia — Website & Aplikasi Web Profesional";
	const jsonLd = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "ProfessionalService",
		"name": siteName,
		"description": siteDesc,
		"url": typeof window !== "undefined" ? window.location.origin : "",
		"telephone": settings?.phone || "",
		"email": settings?.email || "",
		"address": {
			"@type": "PostalAddress",
			"addressCountry": "ID",
			"addressLocality": settings?.address || "Indonesia"
		},
		"sameAs": [
			settings?.instagram,
			settings?.linkedin,
			settings?.github
		].filter(Boolean),
		"serviceType": "Software Development",
		"areaServed": "Indonesia"
	});
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsxs(Head, {
			title: `${siteName} — ${siteTagline}`,
			children: [
				/* @__PURE__ */ jsx("meta", {
					name: "description",
					content: siteDesc
				}),
				/* @__PURE__ */ jsx("meta", {
					name: "keywords",
					content: "software house indonesia, jasa pembuatan website, jasa aplikasi web, web developer indonesia, jasa website profesional, aplikasi bisnis, website company profile"
				}),
				/* @__PURE__ */ jsx("meta", {
					property: "og:type",
					content: "website"
				}),
				/* @__PURE__ */ jsx("meta", {
					property: "og:title",
					content: `${siteName} — ${siteTagline}`
				}),
				/* @__PURE__ */ jsx("meta", {
					property: "og:description",
					content: siteDesc
				}),
				/* @__PURE__ */ jsx("meta", {
					property: "og:locale",
					content: "id_ID"
				}),
				/* @__PURE__ */ jsx("meta", {
					property: "og:image",
					content: settings?.logo ? `/storage/${settings.logo}` : ""
				}),
				/* @__PURE__ */ jsx("meta", {
					name: "twitter:card",
					content: "summary_large_image"
				}),
				/* @__PURE__ */ jsx("meta", {
					name: "twitter:title",
					content: `${siteName} — ${siteTagline}`
				}),
				/* @__PURE__ */ jsx("meta", {
					name: "twitter:description",
					content: siteDesc
				}),
				/* @__PURE__ */ jsx("link", {
					rel: "icon",
					type: "image/png",
					href: settings?.favicon ? `/storage/${settings.favicon}` : "/favicon.ico"
				})
			]
		}),
		/* @__PURE__ */ jsx("script", {
			type: "application/ld+json",
			dangerouslySetInnerHTML: { __html: jsonLd }
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "min-h-screen",
			children: [
				/* @__PURE__ */ jsx("header", {
					role: "banner",
					children: /* @__PURE__ */ jsx(Navbar, {})
				}),
				/* @__PURE__ */ jsxs("main", {
					id: "main-content",
					children: [
						/* @__PURE__ */ jsx(Hero, {}),
						/* @__PURE__ */ jsx(Services, { services }),
						/* @__PURE__ */ jsx(Portfolio, { portfolios }),
						/* @__PURE__ */ jsx(WhyUs, {}),
						/* @__PURE__ */ jsx(Contact, {})
					]
				}),
				/* @__PURE__ */ jsx("footer", {
					role: "contentinfo",
					children: /* @__PURE__ */ jsx(Footer, {})
				})
			]
		}),
		/* @__PURE__ */ jsx(Chatbot, { siteName })
	] });
}
//#endregion
export { ContactPage as default };
