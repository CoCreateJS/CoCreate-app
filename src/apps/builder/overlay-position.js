(() => {
	const builder = document.currentScript?.closest(".builder-app");
	if (!builder) {
		console.error("Builder overlay positioning could not find its .builder-app root.");
		return;
	}

	const frame = builder.querySelector("#canvas");
	const toolbars = builder.querySelectorAll(".builder-selection-toolbar, .builder-hover-toolbar");
	const lastPositions = new WeakMap();

	function getAnchorRect(target) {
		if (!frame?.contentWindow || target.ownerDocument !== frame.contentDocument) return;

		const targetRect = target.getBoundingClientRect();
		const frameRect = frame.getBoundingClientRect();
		const scaleX = frame.offsetWidth ? frameRect.width / frame.offsetWidth : 1;
		const scaleY = frame.offsetHeight ? frameRect.height / frame.offsetHeight : 1;
		const left = frameRect.left + frame.clientLeft * scaleX + targetRect.left * scaleX;
		const top = frameRect.top + frame.clientTop * scaleY + targetRect.top * scaleY;
		const width = targetRect.width * scaleX;
		const height = targetRect.height * scaleY;

		return {
			left,
			top,
			right: left + width,
			bottom: top + height,
			width,
			height
		};
	}

	function positionToolbar(toolbar) {
		const target = toolbar.toolbar?.target;
		if (toolbar.style.display === "none" || !target?.isConnected) {
			lastPositions.delete(toolbar);
			return;
		}

		const rect = getAnchorRect(target);
		if (!rect) {
			lastPositions.delete(toolbar);
			return;
		}
		if (!toolbar.position?.place) {
			console.error("Builder overlay is missing its CoCreate-position target instance.", toolbar);
			return;
		}

		const previous = lastPositions.get(toolbar);
		if (
			previous?.target === target &&
			previous.left === rect.left &&
			previous.top === rect.top &&
			previous.width === rect.width &&
			previous.height === rect.height
		) return;

		lastPositions.set(toolbar, { target, ...rect });
		toolbar.position.place(
			{
				getAttribute: () => null,
				getBoundingClientRect: () => rect
			},
			{ placement: "top-start", offset: 0, padding: 8, collision: "flip shift" }
		);
	}

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) positionToolbar(mutation.target);
	});

	for (const toolbar of toolbars) {
		observer.observe(toolbar, { attributes: true, attributeFilter: ["style"] });
	}

	function repositionVisibleToolbars() {
		for (const toolbar of toolbars) positionToolbar(toolbar);
	}

	window.addEventListener("resize", repositionVisibleToolbars, { passive: true });
	window.addEventListener("scroll", repositionVisibleToolbars, { passive: true, capture: true });
})();
