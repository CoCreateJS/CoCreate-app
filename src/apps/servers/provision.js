(() => {
	const root = document.querySelector("[data-server-provision]:not([data-provision-ready])");
	if (!root) return;
	root.setAttribute("data-provision-ready", "");

	const providers = new Map();
	let step = 1;

	const field = (name) => root.querySelector(`[name="${name}"]`);
	const setOptions = (element, values, getValue, getLabel) => {
		element.replaceChildren(...values.map((item) => {
			const option = document.createElement("option");
			option.value = getValue(item);
			option.textContent = getLabel(item);
			return option;
		}));
	};
	const selectedProvider = () => root.querySelector('[name="server-provider"]:checked')?.value;
	const applyProvider = () => {
		const provider = selectedProvider();
		const profile = providers.get(provider);
		if (!profile) return;
		field("api").value = provider;
		field("image").value = profile.image;
		setOptions(
			field("region"),
			profile.regions,
			(region) => region.region,
			(region) => `${region.name} (${region.region}) · ${region.country}`
		);
		setOptions(
			field("vmType"),
			profile.instances,
			(instance) => instance.name,
			(instance) => `${instance.name} · ${instance.vCPU} vCPU · ${instance.memoryGb} GB`
		);
		applyInstance();
	};
	const applyInstance = () => {
		const profile = providers.get(selectedProvider());
		const instance = profile?.instances.find(({ name }) => name === field("vmType").value);
		field("image").value = instance?.image || profile?.image || "";
	};
	const waitForTransport = async () => {
		for (let attempt = 0; attempt < 40; attempt++) {
			const crud = globalThis.CoCreate?.crud;
			if (crud?.send) return { transport: crud, crud };
			const socket = globalThis.CoCreate?.socket;
			if (socket?.send) return { transport: socket, crud: null };
			await new Promise((resolve) => setTimeout(resolve, 250));
		}
		throw new Error("The CoCreate data transport is not available.");
	};
	const loadProviders = async () => {
		const status = root.querySelector("[data-provider-status]");
		try {
			const { transport, crud } = await waitForTransport();
			const data = {
				method: "object.read",
				array: "servers_config",
				filter: {
					query: { type: "autoscaler", enabled: true },
					limit: 100
				}
			};
			if (transport !== crud) {
				if (location.hostname.startsWith("dev.")) data.database = "dev";
				else if (location.hostname.startsWith("test.")) data.database = "test";
			}
			const response = await transport.send(data);
			const objects = Array.isArray(response)
				? response
				: Array.isArray(response?.object)
					? response.object
					: Array.isArray(response?.data?.object)
						? response.data.object
						: [];
			for (const object of objects) {
				if (!object.provider) continue;
				const cloud = object.config?.[`clouds.${object.provider}`] ||
					object.config?.clouds?.[object.provider];
				if (!cloud?.instances?.length || !cloud?.regions?.length) continue;
				providers.set(object.provider, cloud);
			}

			for (const input of root.querySelectorAll('[name="server-provider"]')) {
				input.disabled = !providers.has(input.value);
			}
			const first = root.querySelector('[name="server-provider"]:not(:disabled)');
			if (!first) throw new Error("No enabled cloud provider configurations were found.");
			first.checked = true;
			status.hidden = true;
			root.querySelector("[data-provision-next]").disabled = false;
			applyProvider();
		} catch (error) {
			status.className = "alert alert-danger py-2";
			status.textContent = error.message || "Unable to load provider configurations.";
		}
	};
	const request = () => ({
		api: field("api").value.trim(),
		method: "post",
		endpoint: "provision-server",
		data: {
			provider: selectedProvider(),
			region: field("region").value,
			zone: field("zone").value.trim() || undefined,
			vmType: field("vmType").value,
			image: field("image").value.trim(),
			name: field("name").value.trim(),
			spot: field("spot").checked,
			network: field("network").value,
			firewall: field("firewall").value.trim(),
			diskGb: Number(field("diskGb").value),
			startupProfile: field("startupProfile").value
		}
	});
	const render = () => {
		for (const section of root.querySelectorAll("[data-provision-step]")) {
			section.hidden = Number(section.dataset.provisionStep) !== step;
		}
		for (const indicator of root.querySelectorAll("[data-provision-indicator]")) {
			const active = Number(indicator.dataset.provisionIndicator) <= step;
			indicator.classList.toggle("bg-primary", active);
			indicator.classList.toggle("bg-secondary", !active);
		}
		root.querySelector("[data-provision-back]").hidden = step === 1;
		root.querySelector("[data-provision-next]").hidden = step === 4;
		root.querySelector("[data-provision-prepare]").hidden = step !== 4;
		if (step === 4) {
			root.querySelector("[data-provision-review]").textContent = JSON.stringify(request(), null, 2);
		}
	};

	root.addEventListener("change", (event) => {
		if (event.target.name === "server-provider") applyProvider();
		if (event.target.name === "vmType") applyInstance();
	});
	root.querySelector("[data-provision-next]").addEventListener("click", () => {
		if (step < 4) step++;
		render();
	});
	root.querySelector("[data-provision-back]").addEventListener("click", () => {
		if (step > 1) step--;
		render();
	});
	root.querySelector("[data-provision-prepare]").addEventListener("click", () => {
		root.querySelector("[data-provision-review]").textContent = JSON.stringify(request(), null, 2);
	});

	render();
	void loadProviders();
})();
