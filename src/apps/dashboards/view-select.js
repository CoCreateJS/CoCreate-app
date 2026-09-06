(() => {
	for (const select of document.querySelectorAll(
		"[data-dashboard-view-select]:not([data-dashboard-view-select-ready])"
	)) {
		select.setAttribute("data-dashboard-view-select-ready", "");
		select.addEventListener("change", () => {
			if (!select.value) return;
			const stateAction = document.createElement("button");
			stateAction.type = "button";
			stateAction.hidden = true;
			stateAction.setAttribute("state-to", "adminView");
			stateAction.setAttribute("state.src", select.value);
			document.body.appendChild(stateAction);
			stateAction.click();
			stateAction.remove();
		});
	}
})();
