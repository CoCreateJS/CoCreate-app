(() => {
    const script = document.currentScript;
    const root = script?.previousElementSibling;
    if (!root || root.dataset.clusterDeployReady === "true") return;
    root.dataset.clusterDeployReady = "true";

    const waitForCrud = () => {
        const crud = globalThis.CoCreate?.crud;
        if (crud?.send) return Promise.resolve(crud);
        return new Promise((resolve) => {
            const loaded = () => {
                const current = globalThis.CoCreate?.crud;
                if (!current?.send) return;
                document.removeEventListener("crudLoaded", loaded);
                resolve(current);
            };
            document.addEventListener("crudLoaded", loaded);
        });
    };

    const getResponseObjects = (response) => Array.isArray(response)
        ? response
        : Array.isArray(response?.object)
            ? response.object
            : Array.isArray(response?.data?.object)
                ? response.data.object
                : [];

    const profiles = new Map();
    const loadProfile = async (provider) => {
        if (profiles.has(provider)) return profiles.get(provider);
        const crud = await waitForCrud();
        const response = await crud.send({
            method: "object.read",
            array: "servers_config",
            filter: {
                query: { type: "autoscaler", provider, enabled: true },
                limit: 1
            }
        });
        const record = getResponseObjects(response)[0];
        const profile = record?.config?.[`clouds.${provider}`] || {};
        profiles.set(provider, profile);
        return profile;
    };

    const syncProvider = async () => {
        const select = root.querySelector(
            '#first-deployment-form [key="infrastructure.provider"]'
        );
        const apiId = select?.selectedOptions?.[0]?.dataset.apiId || "";
        for (const input of root.querySelectorAll(
            "#first-deployment-api-id, #first-deployment-infrastructure-api-id"
        )) {
            input.value = apiId;
        }
        const provider = select?.getValue?.() || select?.value;
        const requiredProvider = root.querySelector(
            "#first-deployment-provider-required"
        );
        if (requiredProvider) requiredProvider.value = provider || "";
        const profile = await loadProfile(provider);
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
        if (!instance) return;
        root.querySelector("#first-deployment-vm-type").value = instance.name;
        root.querySelector("#first-deployment-vcpu").value = instance.vCPU;
        root.querySelector("#first-deployment-memory").value = instance.memoryGb;
    };

    const syncEnvironment = (serverId, clusterId) => {
        root.querySelector("#first-deployment-server-id").value = serverId;
        root.querySelector("#first-deployment-environment").value = [
            `server_id=${serverId}`,
            `cluster_id=${clusterId}`
        ].join("\n");
    };

    root.addEventListener("change", (event) => {
        if (!event.target.matches('[key="infrastructure.provider"]')) return;
        syncProvider();
    });

    root.addEventListener("click", (event) => {
        if (!event.target.closest("#show-first-deployment")) return;
        syncProvider();
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
        const clusterId = root.querySelector("#first-deployment-cluster-id")
            ?.value;
        if (serverId && clusterId) syncEnvironment(serverId, clusterId);
    });
})();
