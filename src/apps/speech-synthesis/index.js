(() => {
	const app = document.querySelector(
		"[data-speech-synthesis-app]:not([data-speech-synthesis-ready])"
	);
	if (!app) return;
	app.setAttribute("data-speech-synthesis-ready", "");

	const config = {
		name: "Default voice",
		voice: "",
		lang: "en-US",
		rate: 1,
		pitch: 1,
		volume: 1,
		text: "Welcome to CoCreate. Use this view to configure and test speech synthesis."
	};

	const api = () => globalThis.CoCreate?.speechSynthesis;
	const apiReady = () => typeof api()?.speak === "function";

	function setStatus(status, className = "text-muted") {
		for (const element of app.querySelectorAll("[data-speech-status]")) {
			element.className = `${className} fs-12 mt-2`;
			element.textContent = status;
		}
	}

	function updateControls() {
		const ready = apiReady();
		for (const control of app.querySelectorAll("[data-speech-action]"))
			control.disabled = !ready;
		setStatus(ready ? "Ready" : "Loading speech synthesis…");
	}

	function renderDetails() {
		for (const element of app.querySelectorAll("[data-speech-output]")) {
			const key = element.dataset.speechOutput;
			const value = key === "voice" ? config.voice || "Browser default" : config[key];
			element.textContent = value ?? "";
		}
	}

	function populateVoices() {
		const voices = api()?.getVoices?.() || [];
		for (const select of app.querySelectorAll("[data-speech-voices]")) {
			const selected = config.voice;
			select.replaceChildren(new Option("Browser default", ""));
			for (const voice of voices) {
				const option = new Option(`${voice.name} (${voice.lang})`, voice.name);
				select.add(option);
			}
			select.value = selected;
		}
	}

	function initializeForm(form) {
		if (form.hasAttribute("data-speech-form-ready")) return;
		form.setAttribute("data-speech-form-ready", "");
		for (const [key, value] of Object.entries(config)) {
			if (form.elements[key]) form.elements[key].value = value;
		}
		form.addEventListener("input", ({ target }) => {
			if (!target.name) return;
			config[target.name] = target.type === "range" ? Number(target.value) : target.value;
			const output = form.querySelector(
				`[data-speech-range-output="${target.name}"]`
			);
			if (output) output.value = target.value;
			renderDetails();
		});
		populateVoices();
	}

	function initializeDetails(details) {
		if (details.hasAttribute("data-speech-details-ready")) return;
		details.setAttribute("data-speech-details-ready", "");
		details.addEventListener("click", ({ target }) => {
			const control = target.closest("[data-speech-action]");
			if (!control || control.disabled) return;
			const action = control.dataset.speechAction;
			if (action === "speak") {
				const utterance = api().speak(config.text, config, control);
				if (!utterance) setStatus("Unable to start speech", "text-danger");
				return;
			}
			api()?.[action]?.();
			if (action === "pause") setStatus("Paused", "text-warning");
			if (action === "resume") setStatus("Speaking", "text-success");
			if (action === "cancel") setStatus("Stopped");
		});
		details.addEventListener("speechSynthesisStart", () =>
			setStatus("Speaking", "text-success")
		);
		details.addEventListener("speechSynthesisPause", () =>
			setStatus("Paused", "text-warning")
		);
		details.addEventListener("speechSynthesisResume", () =>
			setStatus("Speaking", "text-success")
		);
		details.addEventListener("speechSynthesisEnd", () => setStatus("Finished"));
		details.addEventListener("speechSynthesisCancel", () => setStatus("Stopped"));
		details.addEventListener("speechSynthesisError", () =>
			setStatus("Speech synthesis failed", "text-danger")
		);
		renderDetails();
		updateControls();
	}

	function initializeContents(root = app) {
		for (const form of root.querySelectorAll?.("[data-speech-form]") || [])
			initializeForm(form);
		for (const details of root.querySelectorAll?.("[data-speech-details]") || [])
			initializeDetails(details);
	}

	app.addEventListener("click", ({ target }) => {
		const tab = target.closest("[data-speech-view]");
		if (!tab) return;
		for (const item of app.querySelectorAll("[data-speech-view]")) {
			const active = item === tab;
			item.classList.toggle("active", active);
			item.setAttribute("aria-selected", active);
		}
		for (const panel of app.querySelectorAll("[data-speech-panel]"))
			panel.hidden = panel.dataset.speechPanel !== tab.dataset.speechView;
	});

	initializeContents();

	globalThis.speechSynthesis?.addEventListener("voiceschanged", populateVoices);
	document.addEventListener("speechSynthesisLoaded", () => {
		populateVoices();
		updateControls();
	});
})();
