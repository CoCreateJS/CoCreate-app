(() => {
	const componentSelector = "[data-component-form]";
	const initializeClose = (button) => {
		const panel = button?.closest("#create-panel, #offcanvas-app");
		if (panel) button.setAttribute("aria-controls", panel.id);
	};
	const initialize = (component) => {
		if (!component || component.hasAttribute("data-component-form-ready")) return;
		const panel = component.closest("#create-panel, #offcanvas-app");
		if (!panel) return;
		const stateId = panel.id === "create-panel"
			? "create-panel-form"
			: "offcanvas-app-form";

		component.setAttribute("state-id", stateId);
		component.setAttribute("state-overwrite", "");
		for (const button of component.querySelectorAll("[data-component-form-close]")) {
			initializeClose(button);
		}
		component.setAttribute("data-component-form-ready", "");

		const initializeState = () => globalThis.CoCreate?.state?.initElement(component);
		if (globalThis.CoCreate?.state) initializeState();
		else document.addEventListener("stateLoaded", initializeState, { once: true });
	};

	const initializeAll = () => {
		for (const component of document.querySelectorAll(
			`${componentSelector}:not([data-component-form-ready])`
		)) initialize(component);
	};
	const restoreFormState = () => {
		for (const component of document.querySelectorAll(`${componentSelector}[state-id]`)) {
			globalThis.CoCreate?.state?.initElement(component);
		}
	};
	document.addEventListener("stateEnd", restoreFormState, true);

	initializeAll();
	const initializeObserver = () => {
		const observer = globalThis.CoCreate?.observer;
		if (!observer || globalThis.CoCreate.componentForm?.observerInitialized) return;
		globalThis.CoCreate.componentForm ||= {};
		observer.init({
			name: "componentForm",
			types: ["addedNodes"],
			selector: `${componentSelector}, [data-component-form-close]`,
			callback: (mutation) => {
				if (mutation.target.matches(componentSelector)) initialize(mutation.target);
				if (mutation.target.matches("[data-component-form-close]")) {
					initializeClose(mutation.target);
				}
			}
		});
		globalThis.CoCreate.componentForm.observerInitialized = true;
	};
	if (globalThis.CoCreate?.observer) initializeObserver();
	else document.addEventListener("observerLoaded", initializeObserver, { once: true });
})();
