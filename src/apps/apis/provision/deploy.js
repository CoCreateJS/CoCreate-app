(() => {
    const script = document.currentScript;
    const root = script?.previousElementSibling;
    if (!root || root.dataset.clusterDeployReady === "true") return;
    root.dataset.clusterDeployReady = "true";

    const loadProfile = (provider) => {
        const records = root.querySelectorAll(
            '#first-deployment-profiles [data-provider][data-enabled="true"]'
        );
        const record = Array.from(records).find(
            (item) => item.dataset.provider === provider
        );
        const config = record?.querySelector("pre")?.textContent;
        if (!config) return {};
        try {
            return JSON.parse(config)[`clouds.${provider}`] || {};
        } catch {
            return {};
        }
    };

    const syncProvider = () => {
        const select = root.querySelector(
            '#first-deployment-form [key="infrastructure.provider"]'
        );
        const provider = select?.getValue?.() || select?.value;
        const profile = loadProfile(provider);
        syncRegions(profile);
        syncInstance(profile);
    };

    const syncRegions = (profile = {}) => {
        const provider = root.querySelector(
            '#first-deployment-form [key="infrastructure.provider"]'
        );
        const providerValue = provider?.getValue?.() || provider?.value;
        const select = root.querySelector(
            '#first-deployment-form [key="infrastructure.region"]'
        );
        if (!select) return;

        const regions = profile.regions?.length
            ? profile.regions
            : (globalThis.CoCreate?.utils?.cloudProviders || [])
                .filter((region) => region.provider === providerValue);
        select.replaceChildren(...regions.map((region) => {
            const option = document.createElement("option");
            option.value = region.region;
            option.textContent = region.name
                ? `${region.name} (${region.region})`
                : region.region;
            return option;
        }));
    };

    const syncInstance = (profile = {}) => {
        const instances = profile.instances || [];
        const instance = instances.find((candidate) => candidate.default) ||
            instances[0];
        root.querySelector("#first-deployment-vm-type").value = instance?.name || "";
        root.querySelector("#first-deployment-vcpu").value = instance?.vCPU ?? "";
        root.querySelector("#first-deployment-memory").value = instance?.memoryGb ?? "";
    };

    root.addEventListener("change", (event) => {
        if (!event.target.matches('[key="infrastructure.provider"]')) return;
        syncProvider();
    });

    root.addEventListener("fetchedData", (event) => {
        if (event.target.id === "first-deployment-profiles") syncProvider();
    });

    root.addEventListener("click", (event) => {
        if (!event.target.closest("#show-first-deployment")) return;
        const selected = root.querySelector(
            '#cluster-storage-providers-list input[key="storageProviders"]:checked'
        );
        const url = selected?.closest(".apis-provider-option")
            ?.querySelector('[key="url"]')?.value || selected?.dataset.apiUrl || "";
        const storage = root.querySelector("#first-deployment-storage");
        if (storage) storage.value = url;
    });

    root.addEventListener("click", (event) => {
        if (!event.target.closest("#prepare-server-api")) return;
        const serverId = root.querySelector("#first-deployment-server-id")
            ?.value || root.querySelector("#first-deployment-form")
            ?.getAttribute("object");
        if (serverId) root.querySelector("#first-deployment-server-id").value = serverId;
    });
})();
