(() => {
	const app = document.querySelector("[data-speech-recognition-app]:not([data-recognition-ready])");
	if (!app) return;
	app.setAttribute("data-recognition-ready", "");
	const trigger = app.querySelector("[speech-recognition]");
	const abort = app.querySelector("[data-recognition-abort]");
	const status = app.querySelector("[data-recognition-status]");
	const setStatus = (value, className = "text-muted") => {
		status.className = `${className} fs-12 width:100%`;
		status.textContent = value;
	};
	const setReady = () => {
		trigger.disabled = false;
		setStatus("Ready");
	};
	for (const input of app.querySelectorAll("[name]")) input.addEventListener("input", () => {
		const attribute = `speech-recognition-${input.name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
		trigger.setAttribute(attribute, input.type === "checkbox" ? input.checked : input.value);
	});
	app.addEventListener("speechRecognitionStart", () => { abort.disabled = false; setStatus("Listening…", "text-success"); });
	app.addEventListener("speechRecognitionResult", ({ detail }) => setStatus(detail.isFinal ? "Transcript updated" : "Listening…", "text-success"));
	app.addEventListener("speechRecognitionEnd", () => { abort.disabled = true; setStatus("Stopped"); });
	app.addEventListener("speechRecognitionError", ({ detail }) => { abort.disabled = true; setStatus(detail.event?.error || detail.error?.message || "Recognition failed", "text-danger"); });
	abort.addEventListener("click", () => CoCreate.speechRecognition?.abort?.());
	document.addEventListener("speechRecognitionLoaded", setReady);
	if (typeof CoCreate.speechRecognition?.start === "function") setReady();
})();
