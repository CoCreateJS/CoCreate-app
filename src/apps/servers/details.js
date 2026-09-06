(() => {
    if (window.__serverDetailsControls) return;
    window.__serverDetailsControls = true;

    const renderWorkerCards = (details) => {
        const count = Number(
            details.querySelector('[key="totalWorkers"]')?.textContent
        );
        const container = details.querySelector("[data-worker-cards]");
        const firstCard = container?.querySelector('[data-worker-card="1"]');
        if (!container || !firstCard || !Number.isInteger(count) || count < 2) {
            return;
        }

        for (let worker = 2; worker <= count; worker++) {
            if (container.querySelector(`[data-worker-card="${worker}"]`)) {
                continue;
            }

            const card = firstCard.cloneNode(true);
            card.dataset.workerCard = worker;
            card.querySelector("h6").textContent = `Worker ${worker}`;

            for (const element of card.querySelectorAll("[key]")) {
                element.setAttribute(
                    "key",
                    element.getAttribute("key").replace("worker1.", `worker${worker}.`)
                );
                if (element.matches("input")) element.checked = false;
                else element.textContent = "";
            }

            for (const control of card.querySelectorAll("[data-worker]")) {
                control.dataset.worker = worker;
            }

            container.append(card);
        }
    };

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            const details = mutation.target.closest?.("[data-server-details]");
            if (details) renderWorkerCards(details);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    for (const details of document.querySelectorAll("[data-server-details]")) {
        renderWorkerCards(details);
    }

    document.addEventListener("click", async (event) => {
        const action = event.target.closest("[data-server-action]");
        if (!action) return;

        const method = action.dataset.serverAction;
        const details = action.closest("[data-server-details]");
        const form = details?.closest("form");
        const serverId =
            form?.getAttribute("object") ||
            details?.querySelector("[data-server-id]")?.textContent?.trim();
        const socket = window.CoCreate?.socket;

        if (!serverId || !socket?.send) return;
        if (!window.confirm(`Are you sure you want to ${method} this server?`)) {
            return;
        }

        action.disabled = true;
        try {
            const response = await socket.send({
                method,
                server: serverId,
                master: true
            });
            if (response?.error || response?.success === false) {
                throw new Error(response.error || `Unable to ${method} server`);
            }
        } catch (error) {
            action.disabled = false;
            console.error(`Unable to ${method} server ${serverId}:`, error);
        }
    });

    document.addEventListener("change", async (event) => {
        const control = event.target.closest("[data-server-control]");
        if (!control) return;

        const details = control.closest("[data-server-details]");
        const form = details?.closest("form");
        const serverId =
            form?.getAttribute("object") ||
            details?.querySelector("[data-server-id]")?.textContent?.trim();
        const organizationId = details
            ?.querySelector('[key="organization_id"]')
            ?.textContent?.trim();
        const socket = window.CoCreate?.socket;
        const previousValue = !control.checked;

        if (!serverId || !socket?.send) {
            control.checked = previousValue;
            return;
        }

        const data = {
            method: control.dataset.serverControl,
            server: serverId,
            worker: Number(control.dataset.worker),
            value: control.checked
        };

        if (data.method === "shed") {
            data.organizations = control.checked && organizationId
                ? [organizationId]
                : false;
        }

        control.disabled = true;
        try {
            const response = await socket.send(data);
            if (response?.error || response?.success === false) {
                throw new Error(response.error || "Server control failed");
            }
        } catch (error) {
            control.checked = previousValue;
            console.error(`Unable to ${data.method} worker ${data.worker}:`, error);
        } finally {
            control.disabled = false;
        }
    });
})();
