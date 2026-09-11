(() => {
	const grid = document.getElementById("grid");
	if (!grid || grid.dataset.gridInitialized) return;
	grid.dataset.gridInitialized = "true";
	let current;

	const refresh = async () => {
		const template = Array.from(grid.children).find(child => child.matches("[template], template"));
		const array = grid.getAttribute("array");
		const src = grid.getAttribute("src");
		if (!grid.isConnected || !array || !template || array.includes("{{")) return;
		if (!window.CoCreate?.crud?.send || !window.CoCreate?.render?.render || !grid.getFilter) return;
		if (current?.template === template && current.array === array && current.src === src) return;
		const request = { template, array, src };
		current = request;
		try {
			const filter = await grid.getFilter();
			const response = await window.CoCreate.crud.send({
				method: "object.read",
				array,
				filter: { ...filter, overwrite: true }
			});
			if (!grid.isConnected || current !== request || template.parentElement !== grid) return;
			if (response?.error) throw new Error("Unable to read " + array);
			await window.CoCreate.render.render({ source: grid, data: response });
		} catch (error) {
			if (current === request) current = undefined;
			console.error("[Grid] Unable to render cards", { array, src }, error);
		}
	};

	// A new card template needs a read even when the collection stays the same.
	new MutationObserver(refresh).observe(grid, {
		childList: true,
		attributes: true,
		attributeFilter: ["array", "src"]
	});
	for (const event of ["crudLoaded", "renderLoaded", "filterLoaded"]) {
		document.addEventListener(event, refresh, { once: true });
	}
	refresh();
})();
