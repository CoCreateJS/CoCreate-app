(() => {
	const log = (stage, details = {}) => console.log("[Activities] " + stage, details);
	const connectionState = () => {
		const crud = window.CoCreate?.crud;
		const socket = crud?.socket;
		return {
			crudReady: typeof crud?.send === "function",
			database: crud?.database,
			socketAvailable: Boolean(socket),
			connected: socket?.connected,
			serverOrganization: socket?.serverOrganization,
			serverStorage: socket?.serverStorage,
			organizationBalance: socket?.organizationBalance,
			panelConnected: panel?.isConnected
		};
	};
	const panel = document.getElementById("activities-list");
	log("Script initialized", { panelFound: Boolean(panel), ...connectionState() });
	if (!panel || panel.dataset.initialized) {
		log("Initialization skipped", { alreadyInitialized: Boolean(panel?.dataset.initialized) });
		return;
	}
	panel.dataset.initialized = "true";
	let loading = false;

	const waitForConnection = (request) => new Promise((resolve, reject) => {
		const client = window.CoCreate.crud.socket;
		let settled = false;
		let checking = false;
		let previousState;
		const finish = (error) => {
			if (settled) return;
			settled = true;
			clearInterval(interval);
			clearTimeout(timeout);
			if (error) reject(error);
			else resolve();
		};
		const check = async () => {
			if (settled) return;
			if (!panel.isConnected) return finish(new Error("Activities panel closed."));
			if (checking) return;
			checking = true;
			try {
				if (!client?.getSockets) throw new Error("The database connection is unavailable.");
				if (client.serverOrganization === false || client.serverStorage === false || client.organizationBalance === false) {
					throw new Error("The server is not accepting database requests. Check the connection logs.");
				}
				const sockets = await client.getSockets(request);
				if (settled) return;
				const states = sockets.map(socket => ({ readyState: socket.readyState, connected: socket.connected }));
				const state = JSON.stringify(states);
				if (state !== previousState) {
					log("Request socket state", { array: request.array, sockets: states });
					previousState = state;
				}
				if (sockets.length && sockets.every(socket => socket.readyState === 1 && socket.connected)) {
					log("Connection ready; request can be sent", { array: request.array });
					finish();
				}
			} catch (error) {
				finish(error);
			} finally {
				checking = false;
			}
		};
		const interval = setInterval(check, 250);
		const timeout = setTimeout(() => {
			log("Connection wait timed out", { array: request.array, ...connectionState() });
			finish(new Error("Could not connect to the database. Please try again."));
		}, 30000);
		log("Waiting for request connection", { array: request.array, ...connectionState() });
		check();
	});

	const read = async (request) => {
		await waitForConnection(request);
		let timer;
		let progressTimer;
		let response;
		let timedOut = false;
		const started = performance.now();
		const payload = { method: "object.read", ...request };
		const progress = () => ({
			array: request.array,
			elapsedMs: Math.round(performance.now() - started),
			requestId: payload.uuid,
			status: payload.status,
			...connectionState()
		});
		log("Calling crud.send", { ...progress(), filter: JSON.stringify(request.filter) });
		try {
			const pending = window.CoCreate.crud.send(payload);
			log("crud.send returned; awaiting response", { ...progress(), promise: typeof pending?.then === "function" });
			progressTimer = setInterval(() => log("CRUD request still pending", progress()), 5000);
			response = await Promise.race([
				Promise.resolve(pending).then((result) => {
					log(timedOut ? "Late CRUD response received" : "CRUD response received", {
						...progress(),
						hasError: Boolean(result?.error),
						responseKeys: Object.keys(result || {}),
						recordCount: Array.isArray(result?.object) ? result.object.length : result?.object ? 1 : 0
					});
					return result;
				}),
				new Promise((_, reject) => {
					timer = setTimeout(() => {
						timedOut = true;
						log("CRUD request timed out", progress());
						reject(new Error("The " + request.array + " request timed out. Please try again."));
					}, 15000);
				})
			]);
		} catch (error) {
			console.error("[Activities] CRUD request failed", progress(), error);
			throw error;
		} finally {
			clearTimeout(timer);
			clearInterval(progressTimer);
		}
		if (response?.error) throw new Error("Unable to read " + request.array);
		const objects = response?.object;
		return Array.isArray(objects) ? objects : objects ? [objects] : [];
	};

	const showMessage = (message) => {
		const element = document.createElement("p");
		element.className = "text-muted mb-0";
		element.textContent = message;
		panel.replaceChildren(element);
	};

	const templateCache = new Map();
	const fetchTemplate = (url) => {
		if (!templateCache.has(url)) {
			templateCache.set(url, (async () => {
				if (new URL(url).origin !== window.location.origin) throw new Error("Card template must use the same site.");
				log("Fetching card template", { url });
				const state = sessionStorage.getItem("state");
				const response = await fetch(url, {
					headers: state ? { "X-State": state } : {},
					signal: AbortSignal.timeout(15000)
				});
				if (!response.ok) throw new Error("Template request failed (" + response.status + ").");
				const markup = await response.text();
				if (!markup.trim()) throw new Error("Card template is empty.");
				log("Card template fetched", { url, bytes: markup.length });
				return markup;
			})().catch(error => {
				templateCache.delete(url);
				throw error;
			}));
		}
		return templateCache.get(url);
	};

	const renderCard = async (form, card, activity, reference, template, records) => {
		try {
			const recordKey = activity.array + ":" + reference._id;
			if (!records.has(recordKey)) {
				records.set(recordKey, read({ array: activity.array, object: reference._id }));
			}
			const [markup, objects] = await Promise.all([fetchTemplate(template.url), records.get(recordKey)]);
			const record = objects.find(object => String(object._id) === String(reference._id));
			if (!record) throw new Error("The referenced record is no longer available.");
			if (!form.isConnected) return false;
			if (typeof window.CoCreate.render?.render !== "function") throw new Error("The card renderer is not ready.");
			card.innerHTML = markup;
			await window.CoCreate.render.render({ source: card, data: { object: [record] } });
			await window.CoCreate.elements.init(card.querySelectorAll("[key]"));
			log("Activity card rendered", { array: activity.array, recordId: reference._id });
			return true;
		} catch (error) {
			console.error("[Activities] Card rendering failed", { array: activity.array, recordId: reference._id, url: template.url }, error);
			if (form.isConnected) {
				card.replaceChildren();
				card.textContent = error.message || "Unable to render activity.";
				card.className = "text-muted";
			}
			return false;
		}
	};

	const load = async () => {
		if (loading || !panel.isConnected) {
			log("Load skipped", { loading, ...connectionState() });
			return;
		}
		log("Load started", connectionState());
		loading = true;
		panel.setAttribute("aria-busy", "true");
		showMessage("Loading apps...");
		try {
			const apps = await read({ array: "apps", filter: { limit: 0 } });
			log("Apps fetched; resolving templates", { count: apps.length });
			const templates = new Map();
			for (const app of apps) {
				if (!app.array || !app.path || !app.templates?.card) continue;
				const base = new URL(app.path.replace(/\/?$/, "/"), window.location.origin);
				const url = new URL(app.templates.card, base);
				if (!["http:", "https:"].includes(url.protocol)) continue;
				const generic = !Object.keys(app.filter?.query || {}).length;
				if (!templates.has(app.array) || generic) {
					templates.set(app.array, { url: url.href, appId: app._id });
				}
			}

			log("Templates resolved", { arrays: [...templates.keys()] });
			if (!panel.isConnected) {
				log("Stopped before activities request: panel removed");
				return;
			}
			showMessage("Loading activities...");
			const activities = await read({
				array: "activities",
				filter: {
					query: { array: "contacts" },
					sort: [{ key: "timestamp", direction: "desc" }],
					limit: 20
				}
			});
			log("Activities fetched; creating cards", { count: activities.length });
			if (!panel.isConnected) {
				log("Stopped before rendering: panel removed");
				return;
			}
			const fragment = document.createDocumentFragment();
			const cards = [];
			const records = new Map();
			for (const activity of activities) {
				const section = document.createElement("section");
				section.className = "activity-panel-item min-width:0";
				const template = templates.get(activity.array);
				const reference = Array.isArray(activity.object)
					? activity.object[0]
					: activity.object;
				if (reference?._id && template) {
					const form = document.createElement("form");
					form.setAttribute("array", activity.array);
					form.setAttribute("object", reference._id);
					if (template.appId) form.setAttribute("app-id", template.appId);
					const card = document.createElement("div");
					card.textContent = "Loading activity...";
					form.append(card);
					section.append(form);
					cards.push({ form, card, activity, reference, template });
				}
				if (!section.childElementCount) {
					const message = document.createElement("p");
					message.className = "text-muted mb-0";
					message.textContent = template
						? "No records referenced by this activity."
						: "No card template available for this activity.";
					section.append(message);
				}
				fragment.append(section);
			}
			panel.replaceChildren(fragment);
			log("Card containers inserted; rendering templates", {
				activities: activities.length,
				cards: cards.length
			});
			const results = await Promise.all(cards.map(({ form, card, activity, reference, template }) =>
				renderCard(form, card, activity, reference, template, records)
			));
			log("Card rendering finished", { rendered: results.filter(Boolean).length, failed: results.filter(result => !result).length });
			if (!activities.length) showMessage("No recent activities.");
		} catch (error) {
			console.error("[Activities] Unable to load activities:", error);
			if (panel.isConnected) {
				showMessage(error.message || "Unable to load activities.");
				const retry = document.createElement("button");
				retry.type = "button";
				retry.className = "btn btn-outline-secondary align-self-start";
				retry.textContent = "Retry";
				retry.addEventListener("click", load);
				panel.append(retry);
			}
		} finally {
			loading = false;
			panel.removeAttribute("aria-busy");
			log("Load finished", connectionState());
		}
	};

	if (typeof window.CoCreate?.crud?.send === "function") load();
	else {
		log("Waiting for crudLoaded", connectionState());
		document.addEventListener("crudLoaded", () => {
			log("crudLoaded received", connectionState());
			load();
		}, { once: true });
	}
})();
