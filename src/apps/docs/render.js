const root = document.querySelector("[data-docs-render]");

if (root) {
	let data;

	try {
		data = JSON.parse(root.getAttribute("render-data"));
		root.removeAttribute("render-data");
	} catch (error) {
		console.error("Could not read documentation render data:", error);
	}

	if (data) {
		const renderDocumentation = async () => {
			const render = window.CoCreate?.render?.render;
			if (typeof render !== "function") return;

			await render({ element: document.documentElement, data, key: "root" });
		};

		if (typeof window.CoCreate?.render?.render === "function") {
			renderDocumentation();
		} else {
			document.addEventListener("renderLoaded", renderDocumentation, {
				once: true
			});
		}
	}
}
