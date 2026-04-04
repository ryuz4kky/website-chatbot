import { Head, Link, usePage } from "@inertiajs/react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
//#region resources/js/Pages/Portfolio/Show.jsx
function Lightbox({ images, index, onClose }) {
	const [current, setCurrent] = useState(index);
	const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
	const next = () => setCurrent((i) => (i + 1) % images.length);
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-50 bg-black/95 flex items-center justify-center",
		onClick: onClose,
		children: [
			/* @__PURE__ */ jsx("button", {
				onClick: onClose,
				className: "absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors z-10",
				children: "✕"
			}),
			images.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
				onClick: (e) => {
					e.stopPropagation();
					prev();
				},
				className: "absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors",
				children: "‹"
			}), /* @__PURE__ */ jsx("button", {
				onClick: (e) => {
					e.stopPropagation();
					next();
				},
				className: "absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors",
				children: "›"
			})] }),
			/* @__PURE__ */ jsx("img", {
				src: `/storage/${images[current]}`,
				alt: `Gallery ${current + 1}`,
				className: "max-h-[90vh] max-w-[90vw] object-contain rounded-lg",
				onClick: (e) => e.stopPropagation()
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "absolute bottom-4 text-white/50 text-sm",
				children: [
					current + 1,
					" / ",
					images.length
				]
			})
		]
	});
}
function Navbar() {
	const { settings } = usePage().props;
	const siteName = settings?.site_name || "YZ Studio";
	return /* @__PURE__ */ jsx("nav", {
		className: "bg-white border-b border-slate-100 sticky top-0 z-40",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-5xl mx-auto px-6 h-16 flex items-center justify-between",
			children: [/* @__PURE__ */ jsx(Link, {
				href: "/",
				className: "flex items-center",
				children: settings?.logo ? /* @__PURE__ */ jsx("img", {
					src: `/storage/${settings.logo}`,
					alt: siteName,
					className: "h-8 w-auto object-contain"
				}) : /* @__PURE__ */ jsxs("span", {
					className: "text-lg font-bold text-slate-900 tracking-tight",
					children: [siteName.split(" ")[0], /* @__PURE__ */ jsx("span", {
						className: "text-indigo-500",
						children: siteName.split(" ").slice(1).join(" ")
					})]
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-6 text-sm",
				children: [/* @__PURE__ */ jsx(Link, {
					href: "/#portfolio",
					className: "text-slate-500 hover:text-slate-900 transition-colors",
					children: "← Semua Portfolio"
				}), /* @__PURE__ */ jsx(Link, {
					href: "/#contact",
					className: "px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors",
					children: "Hubungi Kami"
				})]
			})]
		})
	});
}
function RelatedCard({ item }) {
	return /* @__PURE__ */ jsxs(Link, {
		href: `/portfolio/${item.id}`,
		className: "group block bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-shadow",
		children: [/* @__PURE__ */ jsx("div", {
			className: "relative overflow-hidden bg-slate-100",
			style: { aspectRatio: "16/9" },
			children: item.image ? /* @__PURE__ */ jsx("img", {
				src: `/storage/${item.image}`,
				alt: item.title,
				loading: "lazy",
				className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
			}) : /* @__PURE__ */ jsx("div", {
				className: "w-full h-full flex items-center justify-center text-4xl",
				children: "🖥️"
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-4",
			children: [/* @__PURE__ */ jsx("h4", {
				className: "font-semibold text-slate-800 text-sm truncate",
				children: item.title
			}), item.technologies?.length > 0 && /* @__PURE__ */ jsx("div", {
				className: "flex flex-wrap gap-1 mt-2",
				children: item.technologies.slice(0, 3).map((t, i) => /* @__PURE__ */ jsx("span", {
					className: "px-2 py-0.5 bg-slate-100 text-slate-500 text-xs rounded-full",
					children: t
				}, i))
			})]
		})]
	});
}
function PortfolioShow({ portfolio, related }) {
	const [lightbox, setLightbox] = useState(null);
	const allImages = [...portfolio.image ? [portfolio.image] : [], ...portfolio.gallery ?? []];
	const hasGallery = allImages.length > 1;
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Head, { title: `${portfolio.title} — Portfolio` }),
		lightbox !== null && /* @__PURE__ */ jsx(Lightbox, {
			images: allImages,
			index: lightbox,
			onClose: () => setLightbox(null)
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "min-h-screen bg-slate-50",
			children: [
				/* @__PURE__ */ jsx(Navbar, {}),
				/* @__PURE__ */ jsxs("div", {
					className: "max-w-5xl mx-auto px-6 py-12",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 lg:grid-cols-3 gap-10",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "lg:col-span-2 space-y-8",
							children: [
								portfolio.image && /* @__PURE__ */ jsxs("div", {
									className: "relative rounded-2xl overflow-hidden bg-slate-900 cursor-zoom-in shadow-lg",
									style: { aspectRatio: "16/9" },
									onClick: () => setLightbox(0),
									children: [/* @__PURE__ */ jsx("img", {
										src: `/storage/${portfolio.image}`,
										alt: portfolio.title,
										className: "w-full h-full object-cover hover:scale-105 transition-transform duration-500"
									}), /* @__PURE__ */ jsx("div", {
										className: "absolute bottom-3 right-3 px-3 py-1.5 bg-black/50 backdrop-blur-sm text-white text-xs rounded-lg",
										children: "🔍 Klik untuk perbesar"
									})]
								}),
								hasGallery && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h3", {
									className: "text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3",
									children: [
										"Gallery (",
										allImages.length,
										" foto)"
									]
								}), /* @__PURE__ */ jsx("div", {
									className: "grid grid-cols-3 sm:grid-cols-4 gap-2",
									children: allImages.map((img, i) => /* @__PURE__ */ jsxs("div", {
										className: "relative rounded-xl overflow-hidden bg-slate-100 cursor-pointer group",
										style: { aspectRatio: "16/9" },
										onClick: () => setLightbox(i),
										children: [
											/* @__PURE__ */ jsx("img", {
												src: `/storage/${img}`,
												alt: `Gallery ${i + 1}`,
												loading: "lazy",
												className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
											}),
											/* @__PURE__ */ jsx("div", {
												className: "absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center",
												children: /* @__PURE__ */ jsx("span", {
													className: "text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity",
													children: "⤢"
												})
											}),
											i === 0 && /* @__PURE__ */ jsx("div", {
												className: "absolute top-1 left-1 px-1.5 py-0.5 bg-indigo-600 text-white text-xs rounded font-medium",
												children: "Cover"
											})
										]
									}, i))
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100",
									children: [/* @__PURE__ */ jsx("h2", {
										className: "text-lg font-bold text-slate-800 mb-4",
										children: "Tentang Project"
									}), /* @__PURE__ */ jsx("div", {
										className: "prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-line",
										children: portfolio.description
									})]
								}),
								portfolio.technologies?.length > 0 && /* @__PURE__ */ jsxs("div", {
									className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100",
									children: [/* @__PURE__ */ jsx("h2", {
										className: "text-lg font-bold text-slate-800 mb-4",
										children: "Teknologi yang Digunakan"
									}), /* @__PURE__ */ jsx("div", {
										className: "flex flex-wrap gap-2",
										children: portfolio.technologies.map((tech, i) => /* @__PURE__ */ jsx("span", {
											className: "px-4 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-sm font-medium rounded-full",
											children: tech
										}, i))
									})]
								})
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "space-y-5",
							children: /* @__PURE__ */ jsxs("div", {
								className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24",
								children: [
									/* @__PURE__ */ jsx("h1", {
										className: "text-xl font-bold text-slate-900 mb-1 leading-tight",
										children: portfolio.title
									}),
									portfolio.client && /* @__PURE__ */ jsxs("p", {
										className: "text-sm text-slate-500 mb-4",
										children: ["untuk ", /* @__PURE__ */ jsx("span", {
											className: "font-medium text-slate-700",
											children: portfolio.client
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-3 pt-4 border-t border-slate-100",
										children: [
											/* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between text-sm",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-slate-500",
													children: "Tanggal"
												}), /* @__PURE__ */ jsx("span", {
													className: "font-medium text-slate-800",
													children: new Date(portfolio.date).toLocaleDateString("id-ID", {
														year: "numeric",
														month: "long"
													})
												})]
											}),
											portfolio.technologies?.length > 0 && /* @__PURE__ */ jsxs("div", {
												className: "flex items-start justify-between text-sm gap-4",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-slate-500 shrink-0",
													children: "Stack"
												}), /* @__PURE__ */ jsxs("span", {
													className: "font-medium text-slate-800 text-right",
													children: [portfolio.technologies.slice(0, 3).join(", "), portfolio.technologies.length > 3 && ` +${portfolio.technologies.length - 3}`]
												})]
											}),
											allImages.length > 0 && /* @__PURE__ */ jsxs("div", {
												className: "flex items-center justify-between text-sm",
												children: [/* @__PURE__ */ jsx("span", {
													className: "text-slate-500",
													children: "Foto"
												}), /* @__PURE__ */ jsxs("span", {
													className: "font-medium text-slate-800",
													children: [allImages.length, " gambar"]
												})]
											})
										]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-6 space-y-2",
										children: [portfolio.demo_link && /* @__PURE__ */ jsx("a", {
											href: portfolio.demo_link,
											target: "_blank",
											rel: "noopener noreferrer",
											className: "flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors",
											children: "🔗 Lihat Demo"
										}), /* @__PURE__ */ jsx(Link, {
											href: "/#contact",
											className: "flex items-center justify-center gap-2 w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors",
											children: "💬 Diskusi Project Serupa"
										})]
									})
								]
							})
						})]
					}), related?.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "mt-16",
						children: [/* @__PURE__ */ jsx("h2", {
							className: "text-xl font-bold text-slate-800 mb-6",
							children: "Project Lainnya"
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
							children: related.map((item) => /* @__PURE__ */ jsx(RelatedCard, { item }, item.id))
						})]
					})]
				}),
				/* @__PURE__ */ jsx("footer", {
					className: "mt-16 border-t border-slate-200 py-8 text-center text-sm text-slate-400",
					children: /* @__PURE__ */ jsx(Link, {
						href: "/",
						className: "hover:text-indigo-600 transition-colors",
						children: "← Kembali ke Beranda"
					})
				})
			]
		})
	] });
}
//#endregion
export { PortfolioShow as default };
