(() => {
	const initialized = Symbol.for("CoCreate.tableSelection");
	if (document[initialized]) return;
	document[initialized] = true;
	const selector = "table[data-row-selection]";

	const getRows = (table) => Array.from(table.querySelectorAll("tbody [data-select-row]")).filter(
		checkbox => checkbox.closest("table") === table && !checkbox.disabled &&
			!checkbox.closest("[template], template, [hidden]")
	);

	const update = (table) => {
		const all = table.querySelector("[data-select-all]");
		if (!all) return;
		const rows = getRows(table);
		const selected = rows.filter(checkbox => checkbox.checked);
		all.checked = rows.length > 0 && selected.length === rows.length;
		all.indeterminate = selected.length > 0 && selected.length < rows.length;
		all.disabled = rows.length === 0;
		for (const checkbox of rows) {
			const row = checkbox.closest("tr");
			row.classList.toggle("table-active", checkbox.checked);
		}
	};

	document.addEventListener("change", (event) => {
		const checkbox = event.target;
		if (!(checkbox instanceof HTMLInputElement)) return;
		if (!checkbox.matches("[data-select-all], [data-select-row]")) return;
		const table = checkbox.closest(selector);
		if (!table || checkbox.closest("[template]")) return;
		if (checkbox.hasAttribute("data-select-all")) {
			for (const row of getRows(table)) row.checked = checkbox.checked;
		}
		update(table);
	});

	// Rendered rows can be appended or replaced by filtering and pagination.
	new MutationObserver((mutations) => {
		const tables = new Set();
		for (const mutation of mutations) {
			const target = mutation.target;
			if (!(target instanceof Element)) continue;
			const table = target.closest(selector);
			if (table) tables.add(table);
			for (const node of mutation.addedNodes) {
				if (!(node instanceof Element)) continue;
				if (node.matches(selector)) tables.add(node);
				for (const added of node.querySelectorAll(selector)) tables.add(added);
			}
		}
		for (const table of tables) if (table.isConnected) update(table);
	}).observe(document.documentElement, { childList: true, subtree: true });

	for (const table of document.querySelectorAll(selector)) update(table);
})();
