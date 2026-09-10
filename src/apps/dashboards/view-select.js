(() => {
	const dashboardView = document.querySelector("#dashboard-view");

	for (const select of document.querySelectorAll(
		"[data-dashboard-view-select]:not([data-dashboard-view-select-ready])"
	)) {
		select.setAttribute("data-dashboard-view-select-ready", "");

		const syncSelect = () => {
			const src = dashboardView?.getAttribute("src");
			if (src && select.querySelector(`option[value="${src}"]`)) {
				select.value = src;
			}
		};

		syncSelect();
		if (dashboardView) {
			new MutationObserver(syncSelect).observe(dashboardView, {
				attributeFilter: ["src"]
			});
		}

		select.addEventListener("change", () => {
			if (!select.value) return;
			const stateAction = document.createElement("button");
			stateAction.type = "button";
			stateAction.hidden = true;
			stateAction.setAttribute("state-to", "dashboardView");
			stateAction.setAttribute("state.src", select.value);
			document.body.appendChild(stateAction);
			stateAction.click();
			stateAction.remove();
		});
	}
})();
