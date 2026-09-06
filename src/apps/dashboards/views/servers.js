(() => {
	const mapElement = document.querySelector(
		"[data-server-map]:not([data-server-map-ready])"
	);
	if (!mapElement) return;
	mapElement.setAttribute("data-server-map-ready", "");

	const recordsElement = mapElement.closest(".card-body")?.querySelector(
		"[data-server-map-records]"
	);
	if (!recordsElement) return;

	let renderTimer;
	let telemetryTimer;
	let attempts = 0;
	let telemetryRequestId = 0;
	let serverStatesPromise;
	const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;"
	})[character]);
	const colors = {
		running: "#0ab39c",
		cordoned: "#f7b84b",
		shedding: "#299cdb",
		draining: "#d29922",
		rebooting: "#405189",
		stopped: "#f06548",
		unknown: "#878a99"
	};
	const getWorkers = (server) => Object.entries(server || {})
		.filter(([key, worker]) => /^worker\d+$/.test(key) && worker && typeof worker === "object")
		.map(([, worker]) => worker);
	const getServerState = (server = {}) => {
		const topLevelStatus = String(server.status || "unknown").toLowerCase();
		const workers = getWorkers(server);
		const processStatuses = [server.master, ...workers]
			.map((processState) => String(processState?.status || "").toLowerCase())
			.filter(Boolean);
		const lifecycle = topLevelStatus === "rebooting" || topLevelStatus === "stopped"
			? topLevelStatus
			: processStatuses.some((status) => status === "running")
				? "running"
				: processStatuses.length && processStatuses.every((status) => status === "stopped")
					? "stopped"
					: topLevelStatus;
		const flags = {
			cordoned: workers.some((worker) => worker.isCordoned || worker.isCordon),
			shedding: workers.some((worker) => worker.isShedding),
			draining: workers.some((worker) => worker.isDraining)
		};
		const effective = lifecycle === "stopped" || lifecycle === "rebooting"
			? lifecycle
			: flags.draining
				? "draining"
				: flags.shedding
					? "shedding"
					: flags.cordoned
						? "cordoned"
						: lifecycle;
		return { lifecycle, flags, effective };
	};
	const renderStateSummary = (servers) => {
		const summary = document.querySelector("[data-server-state-summary]");
		if (!summary) return;
		const counts = {
			total: servers.length,
			running: 0,
			cordoned: 0,
			shedding: 0,
			draining: 0,
			rebooting: 0,
			stopped: 0
		};
		servers.forEach((server) => {
			const state = getServerState(server);
			if (state.lifecycle in counts) counts[state.lifecycle]++;
			Object.entries(state.flags).forEach(([name, active]) => {
				if (active) counts[name]++;
			});
		});
		Object.entries(counts).forEach(([name, count]) => {
			const element = summary.querySelector(`[data-state-count="${name}"]`);
			if (element) element.textContent = count;
		});
	};
	const loadServerStates = () => {
		if (serverStatesPromise) return serverStatesPromise;
		const crud = globalThis.CoCreate?.crud;
		if (!crud?.send) return Promise.resolve(new globalThis.Map());
		serverStatesPromise = crud.send({
					method: "object.read",
					array: "servers",
					filter: { limit: 500 }
				}).then((response) => {
					const servers = Array.isArray(response?.object)
						? response.object
						: [];
					renderStateSummary(servers);
					return new globalThis.Map(
						servers.map((server) => [String(server._id), server])
					);
				})
				.catch(() => new globalThis.Map());
		return serverStatesPromise;
	};

	const renderTelemetry = async (records, serverStates = new globalThis.Map()) => {
		const summary = document.querySelector("[data-active-telemetry-summary]");
		const crud = globalThis.CoCreate?.crud;
		if (!summary || !crud?.send) return;

		const active = records.filter((record) => {
			const server = serverStates.get(record.dataset.serverId);
			return server
				? getServerState(server).lifecycle === "running"
				: record.dataset.status === "running";
		});
		const requestId = ++telemetryRequestId;
		summary.querySelector("[data-active-server-count]").textContent = active.length;

		const responses = await Promise.all(active.map((record) => crud.send({
			method: "object.read",
			array: "servers_telemetry",
			filter: {
				query: { serverId: record.dataset.serverId },
				sort: [{ key: "timestamp", direction: "desc" }],
				limit: 1,
				key: {
					serverId: 1,
					timestamp: 1,
					"cpu.avg": 1,
					"memory.avg_used_pct": 1
				}
			}
		})));
		if (requestId !== telemetryRequestId || !summary.isConnected) return;

		const serverTelemetry = responses.map((response, index) => ({
			serverId: active[index].dataset.serverId,
			sample: response?.object?.[0]
		})).filter(({ sample }) => Boolean(sample));
		const samples = serverTelemetry.map(({ sample }) => sample);
		const average = (values) => values.length
			? (values.reduce((total, value) => total + value, 0) / values.length).toFixed(2)
			: "—";
		const cpu = samples.map((sample) => Number(sample.cpu?.avg)).filter(Number.isFinite);
		const memory = samples.map((sample) => Number(sample.memory?.avg_used_pct)).filter(Number.isFinite);
		const latest = samples.reduce((value, sample) => {
			const timestamp = new Date(sample.timestamp).getTime();
			return Number.isFinite(timestamp) && timestamp > value ? timestamp : value;
		}, 0);

		const telemetryByServer = new globalThis.Map(
			serverTelemetry.map(({ serverId, sample }) => [String(serverId), sample])
		);
		for (const row of document.querySelectorAll(
			"[data-server-row]:not([template])"
		)) {
			const sample = telemetryByServer.get(row.dataset.serverId);
			const serverCpu = Number(sample?.cpu?.avg);
			const serverMemory = Number(sample?.memory?.avg_used_pct);
			row.querySelector("[data-server-cpu]").textContent = Number.isFinite(serverCpu)
				? serverCpu.toFixed(2)
				: "—";
			row.querySelector("[data-server-memory]").textContent = Number.isFinite(serverMemory)
				? serverMemory.toFixed(2)
				: "—";
		}

		summary.querySelector("[data-telemetry-sample-count]").textContent = samples.length;
		document.querySelectorAll("[data-average-cpu]").forEach((element) => {
			element.textContent = average(cpu);
		});
		document.querySelectorAll("[data-average-memory]").forEach((element) => {
			element.textContent = average(memory);
		});
		summary.querySelector("[data-latest-sample]").textContent = latest
			? new Date(latest).toLocaleString()
			: "—";
	};
	const scheduleTelemetry = () => {
		clearTimeout(telemetryTimer);
		telemetryTimer = setTimeout(() => {
			const records = [...recordsElement.querySelectorAll(
				"[data-server-map-record]:not([template])"
			)];
			if (records.length) {
				void loadServerStates().then((serverStates) => renderTelemetry(records, serverStates));
			}
		}, 250);
	};

	const renderMap = async () => {
		const Map = globalThis.jsVectorMap;
		if (!Map) {
			if (attempts++ < 50) renderTimer = setTimeout(renderMap, 100);
			return;
		}

		const allRecords = [...recordsElement.querySelectorAll(
			"[data-server-map-record]:not([template])"
		)];
		if (!allRecords.length) return;
		const serverStates = await loadServerStates();
		void renderTelemetry(allRecords, serverStates);

		const records = allRecords.filter((record) => {
			const latitude = Number(record.dataset.latitude);
			const longitude = Number(record.dataset.longitude);
			return Number.isFinite(latitude) && Number.isFinite(longitude);
		});
		if (!records.length) return;

		mapElement.jsVectorMap?.destroy?.();
		mapElement.innerHTML = "";
		mapElement.jsVectorMap = new Map({
			map: "world",
			selector: "#server-world-map",
			zoomOnScroll: false,
			zoomButtons: true,
			markersSelectable: false,
			markers: records.map((record) => {
				const server = serverStates.get(record.dataset.serverId);
				const status = server
					? getServerState(server).effective
					: record.dataset.draining === "true"
						? "draining"
						: record.dataset.shedding === "true"
							? "shedding"
							: record.dataset.cordoned === "true"
								? "cordoned"
								: record.dataset.status || "unknown";
				return {
					name: [
						record.dataset.host,
						record.dataset.provider,
						record.dataset.region,
						status
					].filter(Boolean).join(" · "),
					coords: [
						Number(record.dataset.latitude),
						Number(record.dataset.longitude)
					],
					style: {
						initial: {
							r: 7,
							fill: colors[status] || "#878a99",
							stroke: "#ffffff",
							strokeWidth: 3
						}
					}
				};
			}),
			regionStyle: {
				initial: {
					stroke: "#9599ad",
					strokeWidth: 0.25,
					fill: "#e9ebec",
					fillOpacity: 1
				}
			},
			markerStyle: {
				initial: { r: 7, fill: "#878a99", stroke: "#ffffff", strokeWidth: 3 }
			},
			labels: {
				markers: {
					render: (_marker, index) => records[Number(index)]?.dataset.host || "Server"
				}
			},
			onMarkerTooltipShow: (_event, tooltip, index) => {
				const record = records[Number(index)];
				if (!record) return;
				const server = serverStates.get(record.dataset.serverId);
				const status = server
					? getServerState(server).effective
					: record.dataset.status || "unknown";
				const location = [
					record.dataset.provider,
					record.dataset.region
				].filter(Boolean).join(" · ") || "Location unavailable";
				const content = `
					<div class="server-map-tooltip">
						<strong>${escapeHtml(record.dataset.host || "Server")}</strong>
						<span>${escapeHtml(location)}</span>
						<span>State: ${escapeHtml(status.replace(/^./, (value) => value.toUpperCase()))}</span>
					</div>
				`;
				const tooltipElement = tooltip.getElement?.() || tooltip.selector || tooltip._tooltip;
				if (tooltipElement instanceof Element) {
					tooltipElement.innerHTML = content;
				} else {
					tooltip.text(`${record.dataset.host || "Server"} · ${location} · ${status}`);
				}
			},
			onMarkerClick: (_event, index) => {
				records[Number(index)]?.querySelector("button")?.click();
			}
		});
	};

	const scheduleRender = () => {
		clearTimeout(renderTimer);
		serverStatesPromise = undefined;
		renderTimer = setTimeout(renderMap, 100);
	};

	new MutationObserver(scheduleRender).observe(recordsElement, {
		childList: true,
		subtree: true
	});
	const telemetrySubscription = document.querySelector("[data-telemetry-subscription]");
	if (telemetrySubscription) {
		new MutationObserver(scheduleTelemetry).observe(telemetrySubscription, {
			attributes: true,
			characterData: true,
			childList: true,
			subtree: true
		});
	}
	scheduleRender();
})();
