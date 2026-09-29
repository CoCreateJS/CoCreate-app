(async () => {
    const { storageProviderLabels, storageValue, storageKeys, storageIsConfigured, storageIsEnabled, hasCredentialValue, formatCredentialLabel, createProviderInput } = await import("/apps/apis/providers/storage.js");
    const { cloudProviderLabels: providerLabels, cloudProviderFields, cloudProviderUrls, cloudValue: providerValue, cloudQuery } = await import("/apps/apis/providers/cloud.js");
    const initialize = (root) => {
        if (!root || root.hasAttribute("data-provision-ready")) return;
        root.setAttribute("data-provision-ready", "");
        const serverMode = Boolean(root.closest('[data-provision-mode="server"]'));
        if (serverMode) {
            root.dataset.createPanelTitle = "Server Provisioning";
            root.querySelector(":scope > .card-header > span").textContent =
                "Server Provisioning";
            root.querySelector("[data-provision-heading]").textContent = "Server Configuration";
            root.querySelector("[data-provision-description]").textContent =
                "Choose a cloud provider, select or configure a cluster, connect storage, and deploy.";
            root.querySelector("[data-provider-heading]").textContent = "Choose a cloud provider";
            root.querySelector("[data-provider-description]").textContent =
                "Select the provider that will deploy this server.";
            root.querySelector("[data-initial-provider-field]").hidden = true;
            for (const input of root.querySelectorAll('[name="cluster-provider"]')) {
                input.type = "radio";
            }
            const clusterInput = root.querySelector('[name="clusterName"]');
            const clusterField = root.querySelector("[data-cluster-name-field]");
            const clusterList = document.createElement("div");
            clusterList.className = "dropdown-menu w-100";
            clusterList.dataset.clusterOptions = "";
            clusterList.setAttribute("role", "listbox");
            clusterInput.autocomplete = "off";
            clusterInput.placeholder = "Search or enter a cluster name";
            clusterInput.setAttribute("aria-haspopup", "listbox");
            clusterInput.setAttribute("aria-expanded", "false");
            clusterField.classList.add("position-relative");
            clusterField.append(clusterList);
        }
        const control = (selector) => root.querySelector(selector);

        const providers = new Map();
        const apiConfigs = new Map();
        const existingClusters = [];
        let storageEntries = [];
        const cloudProviderInstanceNames = {
            aws: ["t3a.nano", "t3a.small", "t3a.medium", "t3a.large", "t3a.xlarge", "t3a.2xlarge", "c5a.4xlarge"],
            gcp: ["e2-micro", "e2-standard-2", "e2-standard-4", "e2-standard-8", "e2-standard-16", "e2-standard-32", "n2-standard-64"],
            azure: ["Standard_B1s", "Standard_B2s", "Standard_B4ms", "Standard_B8ms", "Standard_B16ms", "Standard_B32ms", "Standard_D64s_v5"],
            digitalocean: ["s-1vcpu-2gb", "s-2vcpu-8gb", "s-4vcpu-16gb", "s-8vcpu-32gb", "s-16vcpu-64gb", "s-32vcpu-128gb", "s-64vcpu-256gb"],
            oci: ["VM.Standard.E4.Flex-1v2g", "VM.Standard.E4.Flex-2v8g", "VM.Standard.E4.Flex-4v16g", "VM.Standard.E4.Flex-8v32g", "VM.Standard.E4.Flex-16v64g", "VM.Standard.E4.Flex-32v128g", "VM.Standard.E4.Flex-64v256g"],
            hetzner: ["cx11", "cx22", "cx32", "cx42", "cx52", "ccx43", "ccx63"],
            vultr: ["vc2-1c-2gb", "vc2-2c-8gb", "vc2-4c-16gb", "vc2-8c-32gb", "vc2-16c-64gb", "vc2-32c-128gb", "vc2-64c-256gb"],
            equinix: ["c3.small.x86", "c3.medium.x86", "c3.large.x86", "c3.xlarge.x86", "m3.large.x86", "m3.xlarge.x86", "n3.xlarge.x86"]
        };
        const cloudProviderInstanceSizes = [
            { vCPU: 1, memoryGb: 2 },
            { vCPU: 2, memoryGb: 8 },
            { vCPU: 4, memoryGb: 16 },
            { vCPU: 8, memoryGb: 32 },
            { vCPU: 16, memoryGb: 64 },
            { vCPU: 32, memoryGb: 128 },
            { vCPU: 64, memoryGb: 256 }
        ];
        const cloudProviderSizeOverrides = {
            aws: [
                { vCPU: 2, memoryGb: 0.5 },
                { vCPU: 2, memoryGb: 2 },
                { vCPU: 2, memoryGb: 4 },
                { vCPU: 2, memoryGb: 8 },
                { vCPU: 4, memoryGb: 16 },
                { vCPU: 8, memoryGb: 32 },
                { vCPU: 16, memoryGb: 32 }
            ]
        };
        let step = 1;
        let credentialEntries = [];
        const credentialDrafts = new Map();
        let credentialRequest = 0;
        let credentialSelection = "";
        let selectedExistingClusterId = "";
        let clusterRecord;
        let serverRecord;
        let completed = false;
        const defaultConfiguration = {
            autoscalingEnabled: true,
            spotEnabled: true,
            scaleOutCpuThreshold: 85,
            scaleOutMemoryThreshold: 85,
            scaleOutConsecutiveFlushes: 3,
            maxClusterSize: 0,
            scaleInCpuThreshold: 10,
            scaleInMemoryThreshold: 45,
            scaleInConsecutiveFlushes: 10,
            minClusterSize: 2,
            preservation: "continent",
            decommissionStrategy: "oldest",
            geoScaleEnabled: true,
            sheddingThreshold: 20,
            densityBy: "continent",
            verticalEnabled: true,
            maxNodesPerTier: 2,
            minVcpu: 1,
            minMemory: 2,
            maxVcpu: 64,
            maxMemory: 256
        };

        const field = (name) => root.querySelector(`[name="${name}"]`);
        const applyDefaultConfiguration = () => {
            for (const [name, value] of Object.entries(defaultConfiguration)) {
                const input = field(name);
                if (!input) continue;
                if (input.type === "checkbox") input.checked = value;
                else input.value = value;
            }
        };
        const clusterByName = () => {
            if (!serverMode) return;
            const name = field("clusterName").value.trim().toLowerCase();
            return existingClusters.find((cluster) =>
                String(cluster.name || "").trim().toLowerCase() === name
            );
        };
        const applyClusterConfiguration = (cluster) => {
            if (!cluster) return;
            const values = {
                autoscalingEnabled: cluster.autoscaling?.enabled ?? true,
                spotEnabled: cluster.spot?.enabled,
                scaleOutCpuThreshold: cluster.scaleOut?.cpuThreshold,
                scaleOutMemoryThreshold: cluster.scaleOut?.memoryThreshold,
                scaleOutConsecutiveFlushes: cluster.scaleOut?.consecutiveFlushes,
                maxClusterSize: cluster.scaleOut?.maxClusterSize,
                scaleInCpuThreshold: cluster.scaleIn?.cpuThreshold,
                scaleInMemoryThreshold: cluster.scaleIn?.memoryThreshold,
                scaleInConsecutiveFlushes: cluster.scaleIn?.consecutiveFlushes,
                minClusterSize: cluster.scaleIn?.minClusterSize,
                preservation: cluster.scaleIn?.preservation,
                decommissionStrategy: cluster.scaleIn?.decommissionStrategy,
                geoScaleEnabled: cluster.geoScale?.enabled,
                sheddingThreshold: cluster.geoScale?.sheddingThreshold,
                densityBy: cluster.geoScale?.densityBy,
                verticalEnabled: cluster.vertical?.enabled,
                maxNodesPerTier: cluster.vertical?.maxNodesPerTier,
                minVcpu: cluster.vertical?.min?.vCPU,
                minMemory: cluster.vertical?.min?.memoryGb,
                maxVcpu: cluster.vertical?.max?.vCPU,
                maxMemory: cluster.vertical?.max?.memoryGb
            };
            for (const [name, value] of Object.entries(values)) {
                if (value === undefined) continue;
                const input = field(name);
                if (input.type === "checkbox") input.checked = Boolean(value);
                else input.value = value;
            }
            syncEnabledSections();
        };
        const syncClusterSelection = () => {
            if (!serverMode) return;
            const cluster = clusterByName();
            if (!cluster) {
                if (selectedExistingClusterId) {
                    applyDefaultConfiguration();
                    syncEnabledSections();
                }
                selectedExistingClusterId = "";
                clusterRecord = undefined;
                return;
            }
            if (selectedExistingClusterId === cluster._id) return;
            selectedExistingClusterId = cluster._id;
            clusterRecord = undefined;
            applyClusterConfiguration(cluster);
        };
        const hideClusterOptions = () => {
            const list = root.querySelector("[data-cluster-options]");
            if (!list) return;
            list.classList.remove("show");
            field("clusterName")?.setAttribute("aria-expanded", "false");
        };
        const renderClusterOptions = () => {
            const list = root.querySelector("[data-cluster-options]");
            const input = field("clusterName");
            if (!list || !input) return;
            const query = input.value.trim().toLowerCase();
            const matches = existingClusters.filter((cluster) =>
                String(cluster.name || "").toLowerCase().includes(query)
            ).slice(0, 10);
            list.replaceChildren(...matches.map((cluster) => {
                const option = document.createElement("button");
                option.type = "button";
                option.className = "dropdown-item";
                option.dataset.clusterOption = cluster._id;
                option.setAttribute("role", "option");
                option.textContent = cluster.name || cluster._id;
                return option;
            }));
            const show = document.activeElement === input && matches.length > 0;
            list.classList.toggle("show", show);
            input.setAttribute("aria-expanded", String(show));
        };
        const numberValue = (name) => Number(field(name).value);
        const clusterConfiguration = () => ({
            autoscaling: {
                enabled: field("autoscalingEnabled").checked
            },
            spot: {
                enabled: field("spotEnabled").checked,
                fallbackToOnDemand: true
            },
            scaleOut: {
                cpuThreshold: numberValue("scaleOutCpuThreshold"),
                memoryThreshold: numberValue("scaleOutMemoryThreshold"),
                consecutiveFlushes: numberValue("scaleOutConsecutiveFlushes"),
                maxClusterSize: numberValue("maxClusterSize")
            },
            scaleIn: {
                cpuThreshold: numberValue("scaleInCpuThreshold"),
                memoryThreshold: numberValue("scaleInMemoryThreshold"),
                consecutiveFlushes: numberValue("scaleInConsecutiveFlushes"),
                preservation: field("preservation").value.trim(),
                minClusterSize: numberValue("minClusterSize"),
                decommissionStrategy: field("decommissionStrategy").value.trim()
            },
            geoScale: {
                enabled: field("geoScaleEnabled").checked,
                sheddingThreshold: numberValue("sheddingThreshold"),
                densityBy: field("densityBy").value.trim()
            },
            vertical: {
                enabled: field("verticalEnabled").checked,
                maxNodesPerTier: numberValue("maxNodesPerTier"),
                min: {
                    vCPU: numberValue("minVcpu"),
                    memoryGb: numberValue("minMemory")
                },
                max: {
                    vCPU: numberValue("maxVcpu"),
                    memoryGb: numberValue("maxMemory")
                }
            }
        });
        const syncEnabledSection = (name) => {
            const enabled = field(name).checked;
            const badge = root.querySelector(`[data-enabled-badge="${name}"]`);
            const fields = root.querySelectorAll(`[data-enabled-fields="${name}"]`);
            badge.textContent = enabled ? "Enabled" : "Disabled";
            badge.className = enabled
                ? "badge bg-success-subtle text-success"
                : "badge bg-secondary-subtle text-secondary";
            for (const section of fields) {
                section.hidden = !enabled;
                if (enabled) section.style.removeProperty("display");
                else section.style.setProperty("display", "none", "important");
            }
            if (name === "autoscalingEnabled") {
                const description = root.querySelector("[data-deployment-description]");
                description.textContent = serverMode
                    ? "Select a region where this server will be deployed."
                    : enabled
                        ? "Choose where to deploy the first server. As resource needs change, servers are automatically added or removed across your selected cloud providers according to the cluster’s scaling settings."
                        : "Choose where to deploy the first server. Additional servers can be added or removed manually while autoscaling is disabled.";
            }
        };
        const syncEnabledSections = () => {
            for (const name of ["autoscalingEnabled", "spotEnabled", "geoScaleEnabled", "verticalEnabled"]) {
                syncEnabledSection(name);
            }
        };
        const validateStep = (stepNumber) => [...root.querySelectorAll(
            `[data-provision-step="${stepNumber}"] [required]`
        )].filter((input) => !input.closest("[hidden]")).every((input) => input.reportValidity());
        const setOptions = (element, values, getValue, getLabel) => {
            element.replaceChildren(...values.map((item) => {
                const option = document.createElement("option");
                option.value = getValue(item);
                option.textContent = getLabel(item);
                return option;
            }));
        };
        const selectedProviders = () => [
            ...root.querySelectorAll('[name="cluster-provider"]:checked')
        ].map(({ value }) => value);
        const selectedProvider = () => field("initialProvider")?.value || selectedProviders()[0];
        const storageSelection = () => root.querySelector('[name="storage-selection"]:checked');
        const selectedStorageEntry = () => {
            const id = storageSelection()?.value;
            return storageEntries.find((entry) => entry._id === id);
        };
        const selectedStorageProvider = () => selectedStorageEntry()?.provider ||
            storageSelection()?.dataset.storageProvider || "";
        const storageConfiguration = () => {
            const existing = selectedStorageEntry();
            const name = field("storageName").value.trim();
            const provider = selectedStorageProvider();
            const values = storageFieldValues(existing);
            return {
                [name]: {
                    provider,
                    ...values
                }
            };
        };
        const initialVmType = () => {
            const instances = providers.get(selectedProvider())?.instances || [];
            return instances.find((instance) => instance.default)?.name ||
                instances[0]?.name;
        };
        const syncInitialProviders = () => {
            const values = selectedProviders();
            const select = field("initialProvider");
            const previous = select.value;
            setOptions(
                select,
                values,
                (value) => value,
                (value) => providerLabels[value] || value
            );
            if (values.includes(previous)) select.value = previous;
            control("[data-provision-next]").disabled = values.length === 0;
            applyProvider();
        };
        const applyProvider = () => {
            const provider = selectedProvider();
            const profile = providers.get(provider);
            if (!profile) return;
            setOptions(
                field("region"),
                profile.regions,
                (region) => region.region,
                (region) => `${region.name} (${region.region}) · ${region.country}`
            );
        };
        const getCrud = () => {
            const crud = globalThis.CoCreate?.crud;
            if (crud?.send) return crud;
        };
        const waitForCrud = () => {
            const crud = getCrud();
            if (crud) return Promise.resolve(crud);

            return new Promise((resolve) => {
                const handleLoaded = () => {
                    const crud = getCrud();
                    if (!crud) return;
                    document.removeEventListener("crudLoaded", handleLoaded);
                    resolve(crud);
                };
                document.addEventListener("crudLoaded", handleLoaded);
            });
        };
        const getSocket = () => {
            const socket = globalThis.CoCreate?.socket;
            if (socket?.send) return socket;
        };
        const waitForSocket = () => {
            const socket = getSocket();
            if (socket) return Promise.resolve(socket);

            return new Promise((resolve) => {
                const handleLoaded = () => {
                    const socket = getSocket();
                    if (!socket) return;
                    document.removeEventListener("socketLoaded", handleLoaded);
                    resolve(socket);
                };
                document.addEventListener("socketLoaded", handleLoaded);
            });
        };
        const loadProviderProfiles = () => {
            const status = root.querySelector(
                `[data-provision-step="${step}"] [data-step-status]`
            ) || root.querySelector("[data-cluster-status]");
            const locations = globalThis.CoCreate?.utils?.cloudProviders || [];
            providers.clear();
            for (const provider of selectedProviders()) {
                const names = cloudProviderInstanceNames[provider] || [];
                const regions = locations.filter((location) => location.provider === provider);
                if (!names.length || !regions.length) continue;
                const sizes = cloudProviderSizeOverrides[provider] ||
                    cloudProviderInstanceSizes;
                providers.set(provider, {
                    regions,
                    instances: names.map((name, index) => ({
                        name,
                        ...sizes[index]
                    }))
                });
            }
            const unavailable = selectedProviders().filter((provider) => !providers.has(provider));
            if (unavailable.length) {
                throw new Error(`Provider configuration is unavailable for: ${unavailable.join(", ")}.`);
            }
            status.hidden = true;
            applyProvider();
        };
        const loadClusters = async () => {
            if (!serverMode) return;
            const crud = await waitForCrud();
            const response = await crud.send({
                method: "object.read",
                array: "clusters",
                filter: {
                    sort: [{ key: "name", direction: "asc" }],
                    limit: 100
                }
            });
            assertResponse(response);
            existingClusters.splice(0, existingClusters.length, ...getResponseObjects(response));
            renderClusterOptions();
        };
        const loadStorageProviders = async () => {
            const status = root.querySelector("[data-cluster-status]");
            status.hidden = false;
            status.className = "alert alert-info py-2";
            status.textContent = "Loading storage connections…";
            const crud = await waitForCrud();
            const response = await crud.send({
                method: "object.read",
                array: "apis",
                filter: {
                    query: { type: "storage" },
                    sort: [{ key: "name", direction: "asc" }],
                    limit: 0
                }
            });
            assertResponse(response);
            storageEntries = getResponseObjects(response).filter(storageIsEnabled);
            renderStorageOptions();
            status.hidden = true;
        };
        const renderStorageOptions = () => {
            const container = root.querySelector("[data-storage-options]");
            const fields = root.querySelector("[data-storage-fields]");
            container.replaceChildren();
            const appendOption = (storage, value, configured = false) => {
                const option = document.createElement("div");
                option.className = "storage-provider-option border rounded";
                const label = document.createElement("label");
                label.className = "d-flex align-items-start gap-3 p-3";
                const input = document.createElement("input");
                input.type = "radio";
                input.name = "storage-selection";
                input.value = value;
                input.dataset.storageProvider = storage.provider;
                const icon = document.createElement("i");
                icon.className = "ri-database-2-line fs-24 text-primary";
                const text = document.createElement("span");
                text.className = "flex-grow-1";
                const name = document.createElement("strong");
                name.className = "d-block";
                name.textContent = storage.name || storageProviderLabels[storage.provider] || storage.provider;
                const provider = document.createElement("small");
                provider.className = "text-muted";
                provider.textContent = storageProviderLabels[storage.provider] || storage.provider;
                text.append(name, provider);
                label.append(input, icon, text);
                if (configured) {
                    const badge = document.createElement("span");
                    badge.className = "badge bg-success-subtle text-success ms-auto";
                    badge.textContent = "Configured";
                    label.append(badge);
                }
                option.append(label);
                container.append(option);
            };
            for (const storage of storageEntries) {
                appendOption(storage, storage._id, storageIsConfigured(storage));
            }
            if (!storageEntries.length) {
                const empty = document.createElement("p");
                empty.className = "text-muted";
                empty.textContent = "No storage providers are enabled. Enable a connection under Connections → Storage Providers.";
                container.append(empty);
            }

            container.append(fields);
            const existingStorage = serverMode
                ? Object.entries(clusterByName()?.storage || {})[0]
                : undefined;
            if (existingStorage && !storageSelection()) {
                const [name, configuration] = existingStorage;
                const match = storageEntries.find((entry) =>
                    entry._id === configuration?._id ||
                    (entry.name === name && entry.provider === configuration?.provider)
                );
                const input = match && container.querySelector(
                    `[name="storage-selection"][value="${CSS.escape(match._id)}"]`
                );
                if (input) input.checked = true;
            }
            renderStorageFields();
        };
        const renderStorageFields = () => {
            const selection = storageSelection();
            const fields = root.querySelector("[data-storage-fields]");
            const storage = selectedStorageEntry();
            const editable = Boolean(selection) && (!storage || !storageIsConfigured(storage));
            selection?.closest(".storage-provider-option")?.append(fields);
            fields.className = "border-top p-3 flex-column gap-3";
            fields.hidden = !editable;
            if (editable) fields.style.setProperty("display", "flex", "important");
            else fields.style.setProperty("display", "none", "important");
            if (!selection) return;
            const selectedProvider = selectedStorageProvider();
            field("storageName").value = storage?.name || selectedProvider;
            if (editable) renderStorageProviderFields(storage);
            else root.querySelector("[data-storage-provider-fields]").replaceChildren();
        };
        const saveStorageProvider = async () => {
            const existing = selectedStorageEntry();
            if (existing && storageIsConfigured(existing)) return true;
            const inputs = [...root.querySelectorAll("[data-storage-key]")];
            if (!inputs.every((input) => input.reportValidity())) return false;
            const object = {
                ...(existing?._id ? { _id: existing._id } : {}),
                name: field("storageName").value.trim(),
                type: "storage",
                provider: selectedStorageProvider(),
                ...storageFieldValues(existing),
                enabled: true
            };
            const crud = await waitForCrud();
            const response = await crud.send({
                method: existing?._id ? "object.update" : "object.create",
                array: "apis",
                object
            });
            assertResponse(response);
            const saved = getResponseObjects(response)[0] || object;
            if (existing) Object.assign(existing, saved);
            else storageEntries.push(saved);
            return true;
        };
        const getResponseObjects = (response) => Array.isArray(response)
            ? response
            : Array.isArray(response?.object)
                ? response.object
                : Array.isArray(response?.data?.object)
                    ? response.data.object
                    : [];
        const assertResponse = (response) => {
            const value = response?.error ?? response?.data?.error;
            const errors = value === undefined || value === null
                ? []
                : Array.isArray(value)
                    ? value
                    : [value];
            if (errors.length) {
                throw new Error(
                    errors.map((error) => error?.message || String(error)).join("; ")
                );
            }
        };
        const serverNameSegment = (value, fallback) => String(value || fallback)
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "") || fallback;
        const nextServerName = async (crud, cluster, provider, region) => {
            const prefix = [cluster.name || field("clusterName").value, provider, region]
                .map((value, index) => serverNameSegment(value, index === 0 ? "cluster" : "server"))
                .join("-");
            const response = await crud.send({
                method: "object.read",
                array: "servers",
                filter: {
                    query: { cluster_id: cluster._id },
                    limit: 1000
                }
            });
            assertResponse(response);
            const related = getResponseObjects(response).filter((server) =>
                server.name?.startsWith(`${prefix}-`) || (
                    server.infrastructure?.provider === provider &&
                    server.infrastructure?.region === region
                )
            );
            const sequence = related.reduce((highest, server) => {
                const suffix = Number(String(server.name || "").slice(prefix.length + 1));
                return Number.isInteger(suffix) && suffix > highest ? suffix : highest;
            }, related.length) + 1;
            return `${prefix}-${String(sequence).padStart(2, "0")}`;
        };
        const credentialKeys = (provider) => cloudProviderFields[provider] || ["key"];
        const captureCredentialDrafts = () => {
            for (const container of root.querySelectorAll("[data-provider-credential-fields]")) {
                const provider = container.closest(".cluster-provider-option")
                    ?.querySelector('[name="cluster-provider"]')?.value;
                if (!provider) continue;
                const inputs = [...container.querySelectorAll("[data-credential-key]")];
                if (!inputs.length) continue;
                credentialDrafts.set(provider, Object.fromEntries(
                    inputs.map((input) => [input.dataset.credentialKey, input.value])
                ));
            }
        };
        const renderStorageProviderFields = (storage = selectedStorageEntry()) => {
            const container = root.querySelector("[data-storage-provider-fields]");
            container.replaceChildren();
            const provider = selectedStorageProvider();
            const definition = storage?.provider === provider ? storage : { provider };
            for (const key of storageKeys(definition)) {
                const configured = hasCredentialValue(storageValue(storage, key));
                const label = document.createElement("label");
                label.className = "form-label mb-0";
                label.textContent = formatCredentialLabel(key);
                label.append(createProviderInput({ key, configured, storage: true }));
                container.append(label);
            }
        };
        const storageFieldValues = (existing) => {
            const values = {};
            const inputs = [...root.querySelectorAll("[data-storage-key]")];
            for (const input of inputs) {
                const key = input.dataset.storageKey;
                const value = input.value.trim();
                if (value !== "") values[key] = value;
                else {
                    const current = storageValue(existing, key);
                    if (current !== undefined) values[key] = current;
                }
            }
            if (!inputs.length && existing) {
                for (const key of storageKeys(existing)) {
                    const current = storageValue(existing, key);
                    if (current !== undefined) values[key] = current;
                }
            }
            return values;
        };
        const renderCredentialFields = () => {
            for (const badge of root.querySelectorAll("[data-provider-configured]")) {
                badge.remove();
            }
            for (const container of root.querySelectorAll("[data-provider-credential-fields]")) {
                container.replaceChildren();
                container.hidden = true;
                container.className = "";
            }

            for (const input of root.querySelectorAll('[name="cluster-provider"]')) {
                const provider = input.value;
                const api = apiConfigs.get(provider);
                const configured = api && credentialKeys(provider).every((key) =>
                    hasCredentialValue(providerValue(api, key))
                );
                if (!configured) continue;
                const badge = document.createElement("span");
                badge.className = "badge bg-success-subtle text-success ms-auto";
                badge.dataset.providerConfigured = "";
                badge.textContent = "Configured";
                input.closest(".cluster-provider-option")?.querySelector("label")
                    ?.append(badge);
            }

            for (const provider of selectedProviders()) {
                const input = [...root.querySelectorAll('[name="cluster-provider"]')]
                    .find((candidate) => candidate.value === provider);
                const container = input?.closest(".cluster-provider-option")
                    ?.querySelector("[data-provider-credential-fields]");
                if (!container) continue;

                const entry = credentialEntries.find((item) => item.provider === provider);
                if (!entry) continue;
                container.hidden = false;
                container.className = "border-top p-3";

                const fields = document.createElement("div");
                fields.className = "d-flex flex-column gap-3";
                for (const key of entry.keys) {
                    const existingValue = providerValue(entry.api, key);
                    const configured = hasCredentialValue(existingValue);
                    const label = document.createElement("label");
                    label.className = "form-label mb-0";
                    label.textContent = formatCredentialLabel(key);

                    const input = createProviderInput({ key, configured });
                    const draft = credentialDrafts.get(provider);
                    if (draft && Object.hasOwn(draft, key)) input.value = draft[key];
                    label.append(input);
                    fields.append(label);
                }
                container.append(fields);
                const providerUrl = cloudProviderUrls[provider];
                if (providerUrl) {
                    const link = document.createElement("a");
                    link.className = "d-inline-flex align-items-center gap-1 mt-3 text-decoration-none";
                    link.href = providerUrl;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.append(`Get ${providerLabels[provider] || formatCredentialLabel(provider)} credentials`);
                    const icon = document.createElement("i");
                    icon.className = "ri-external-link-line";
                    link.append(icon);
                    container.append(link);
                }
            }
        };
        const loadCredentials = async () => {
            captureCredentialDrafts();
            const requestId = ++credentialRequest;
            const providerNames = Object.keys(cloudProviderFields);
            const crud = await waitForCrud();
            const response = await crud.send({
                method: "object.read",
                array: "apis",
                filter: {
                    query: cloudQuery,
                    limit: 0
                }
            });
            assertResponse(response);
            if (requestId !== credentialRequest) return credentialEntries.length > 0;
            apiConfigs.clear();
            for (const api of getResponseObjects(response)) {
                if (api.provider && providerNames.includes(api.provider) && storageIsEnabled(api)) {
                    apiConfigs.set(api.provider, api);
                }
            }

            for (const input of root.querySelectorAll('[name="cluster-provider"]')) {
                const enabled = apiConfigs.has(input.value);
                input.disabled = !enabled;
                if (!enabled) input.checked = false;
                input.closest('.cluster-provider-option').hidden = !enabled;
            }
            const names = selectedProviders();
            credentialSelection = names.join("|");
            const status = root.querySelector('[data-provider-status]');
            status.hidden = apiConfigs.size > 0;
            if (!apiConfigs.size) {
                status.textContent = 'No cloud providers are enabled. Enable a connection under Connections → Cloud Providers.';
            }
            syncInitialProviders();
            credentialEntries = names.flatMap((provider) => {
                const api = apiConfigs.get(provider) || { name: provider, provider, enabled: true };
                const keys = credentialKeys(provider);
                const missing = keys.some((key) => !hasCredentialValue(
                    providerValue(api, key)
                ));
                return missing ? [{ provider, api, keys }] : [];
            });
            renderCredentialFields();
            return credentialEntries.length > 0;
        };
        const saveCredentials = async () => {
            const crud = await waitForCrud();
            for (const entry of credentialEntries) {
                const providerInput = [...root.querySelectorAll('[name="cluster-provider"]')]
                    .find((candidate) => candidate.value === entry.provider);
                const section = providerInput?.closest(".cluster-provider-option")
                    ?.querySelector("[data-provider-credential-fields]");
                const inputs = [...section.querySelectorAll("[data-credential-key]")];
                if (!inputs.every((input) => input.reportValidity())) return false;

                const object = entry.api._id
                    ? { _id: entry.api._id, type: "cloud" }
                    : { name: entry.provider, provider: entry.provider, type: "cloud", enabled: true };
                for (const input of inputs) {
                    if (input.value !== "") object[input.dataset.credentialKey] = input.value;
                }

                const response = await crud.send({
                    method: entry.api._id ? "object.update" : "object.create",
                    array: "apis",
                    object
                });
                assertResponse(response);
                credentialDrafts.delete(entry.provider);
            }
            return true;
        };
        const createClusterRecord = async () => {
            if (clusterRecord?._id) return clusterRecord;

            const crud = await waitForCrud();
            const existing = clusterByName();
            const providers = existing
                ? [...new Set([...(existing.providers || []), ...selectedProviders()])]
                : selectedProviders();
            const object = {
                ...(existing?._id ? { _id: existing._id } : {}),
                name: field("clusterName").value.trim(),
                providers,
                storage: storageConfiguration(),
                ...clusterConfiguration(),
                ...(!existing ? { status: "provisioning" } : {})
            };
            const response = await crud.send({
                method: existing ? "object.update" : "object.create",
                array: "clusters",
                object
            });
            assertResponse(response);
            clusterRecord = getResponseObjects(response)[0] ||
                (existing ? { ...existing, ...object } : undefined);
            if (!clusterRecord?._id) {
                throw new Error("The cluster record was not returned by CRUD.");
            }
            return clusterRecord;
        };
        const createServerRecord = async (cluster) => {
            if (serverRecord?._id) return serverRecord;

            const crud = await waitForCrud();
            const provider = selectedProvider();
            const apiId = apiConfigs.get(provider)?._id;
            if (!apiId) {
                throw new Error("Select a configured cloud provider before creating a server.");
            }
            const region = field("region").value;
            const profile = providers.get(provider);
            const vmType = initialVmType();
            const instance = profile?.instances.find(({ name }) => name === vmType);
            const name = await nextServerName(crud, cluster, provider, region);
            const data = {
                method: "object.create",
                array: "servers",
                object: {
                    name,
                    cluster_id: cluster._id,
                    api_id: apiId,
                    status: "provisioning",
                    totalWorkers: 0,
                    infrastructure: {
                        provider,
                        region,
                        vmType,
                        vCPU: instance?.vCPU,
                        memoryGb: instance?.memoryGb
                    }
                }
            };
            const response = await crud.send(data);
            assertResponse(response);
            serverRecord = getResponseObjects(response)[0];
            if (!serverRecord?._id) {
                throw new Error("The server record was not returned by CRUD.");
            }
            return serverRecord;
        };
        const loadStartupConfiguration = async (provider) => {
            const crud = await waitForCrud();
            const response = await crud.send({
                method: "object.read",
                array: "servers_config",
                filter: {
                    query: {
                        type: { $in: ["autoscaler", "startupscript"] },
                        enabled: true
                    },
                    limit: 100
                }
            });
            assertResponse(response);
            const configurations = getResponseObjects(response);
            const providerConfiguration = configurations.find((configuration) =>
                configuration.provider === provider
            );
            const sharedConfiguration = configurations.find((configuration) =>
                !configuration.provider && configuration.config?.startupScript
            );
            const sharedConfig = sharedConfiguration?.config || {};
            const providerConfig = providerConfiguration?.config || {};
            const cloudConfig = providerConfig[`clouds.${provider}`] || {};
            const startupScript = cloudConfig.startupScript ||
                providerConfig.startupScript || sharedConfig.startupScript;
            if (!startupScript) {
                throw new Error("The server startup script is not configured.");
            }
            const binaryUrl = cloudConfig.binaryUrl || providerConfig.binaryUrl ||
                sharedConfig.binaryUrl;
            if (!binaryUrl) {
                throw new Error("The server binary URL is not configured.");
            }
            const host = cloudConfig.host || providerConfig.host ||
                sharedConfig.host || window.location.hostname;
            return { startupScript, binaryUrl, host };
        };
        const updateDeploymentRecord = async ({ status, infrastructure, error }) => {
            const crud = await waitForCrud();
            const object = {
                _id: serverRecord._id,
                status
            };
            if (infrastructure) object.infrastructure = infrastructure;
            if (error !== undefined) object.provisioningError = error;
            const response = await crud.send({
                method: "object.update",
                array: "servers",
                object
            });
            assertResponse(response);
            Object.assign(serverRecord, getResponseObjects(response)[0] || object);

            if (!serverMode && clusterRecord?._id) {
                const clusterResponse = await crud.send({
                    method: "object.update",
                    array: "clusters",
                    object: {
                        _id: clusterRecord._id,
                        status
                    }
                });
                assertResponse(clusterResponse);
            }
        };
        const providerInstance = (response) => {
            const payload = response?.data;
            return payload?.Instances?.[0] ||
                payload?.instances?.[0] ||
                payload?.instance ||
                payload;
        };
        const encodeBase64 = (value) => {
            const bytes = new TextEncoder().encode(value);
            let binary = "";
            for (const byte of bytes) binary += String.fromCharCode(byte);
            return btoa(binary);
        };
        const provisionServer = async (cluster, server) => {
            const provider = server.infrastructure.provider;
            const storage = cluster.storage && Object.keys(cluster.storage).length
                ? cluster.storage
                : storageConfiguration();
            if (!storage || Object.keys(storage).length === 0) {
                throw new Error("A configured storage connection is required before deployment.");
            }
            const { startupScript, binaryUrl, host } =
                await loadStartupConfiguration(provider);
            const socket = await waitForSocket();
            const response = await socket.send({
                api: provider,
                method: "post",
                endpoint: "create-instance",
                data: {
                    server_id: server._id,
                    cluster_id: cluster._id,
                    region: server.infrastructure.region,
                    vmType: server.infrastructure.vmType,
                    vCPU: server.infrastructure.vCPU,
                    memoryGb: server.infrastructure.memoryGb,
                    spot: cluster.spot,
                    startupScript,
                    binaryUrl,
                    host,
                    storage: encodeBase64(JSON.stringify(storage)),
                    environment: [
                        `server_id=${server._id}`,
                        `cluster_id=${cluster._id}`
                    ].join("\n")
                },
                broadcast: false,
                broadcastClient: false
            });
            assertResponse(response);

            const instance = providerInstance(response);
            const vmId = instance?.InstanceId || instance?.instanceId ||
                instance?.vmId || instance?.id;
            const infrastructure = {
                ...server.infrastructure,
                ...(vmId ? { vmId: String(vmId) } : {})
            };
            await updateDeploymentRecord({
                status: "starting",
                infrastructure,
                error: null
            });
            return response;
        };
        const render = () => {
            for (const element of root.querySelectorAll("[data-provision-progress]")) {
                element.hidden = completed;
            }
            root.querySelector("[data-provision-complete]").hidden = !completed;
            for (const section of root.querySelectorAll("[data-provision-step]")) {
                section.hidden = completed || Number(section.dataset.provisionStep) !== step;
            }
            for (const indicator of root.querySelectorAll("[data-provision-indicator]")) {
                const indicatorStep = Number(indicator.dataset.provisionIndicator);
                const active = indicatorStep <= step;
                const previous = indicatorStep < step;
                indicator.classList.toggle("bg-secondary", active);
                indicator.classList.toggle("bg-primary", !active);
                indicator.setAttribute("aria-disabled", String(!previous));
                indicator.tabIndex = previous ? 0 : -1;
                if (indicatorStep === step) {
                    indicator.setAttribute("aria-current", "step");
                } else {
                    indicator.removeAttribute("aria-current");
                }
            }
            control("[data-provision-back]").hidden = completed || step === 1;
            control("[data-provision-next]").hidden = completed || step === 4;
            control("[data-provision-next]").disabled =
                (step === 1 && selectedProviders().length === 0) ||
                (step === 3 && !storageSelection());
            control("[data-provision-prepare]").hidden = completed || step !== 4;
            control("[data-provision-prepare]").disabled =
                step === 4 && !storageSelection();
            root.querySelectorAll("[data-provision-close]").forEach(button => {
                button.hidden = !completed;
            });
        };
        const setProvisioningState = (status = "provisioning", detail = "") => {
            const normalizedStatus = String(status || "provisioning").toLowerCase();
            const state = ["active", "running", "success", "succeeded"].includes(normalizedStatus)
                ? "success"
                : ["error", "failed", "failure"].includes(normalizedStatus)
                    ? "error"
                    : "provisioning";
            const subject = serverMode ? "server" : "cluster";
            const section = root.querySelector("[data-provision-complete]");
            const icon = root.querySelector("[data-provision-status-icon]");
            const title = root.querySelector("[data-provision-status-title]");
            const message = root.querySelector("[data-provision-complete-message]");
            const badge = root.querySelector("[data-provision-status-badge]");
            section.dataset.provisionState = state;

            if (state === "success") {
                icon.className = "avatar-lg d-inline-flex align-items-center justify-content-center rounded-circle bg-success-subtle text-success";
                icon.innerHTML = '<i src="/assets/svg/remix/check-line.svg" class="fs-48" aria-hidden="true"></i>';
                title.textContent = `${serverMode ? "Server" : "Cluster"} deployed`;
                message.textContent = detail || `Your ${subject} has been deployed.`;
                badge.className = "badge bg-success-subtle text-success";
                badge.textContent = "Success";
                return;
            }

            if (state === "error") {
                icon.className = "avatar-lg d-inline-flex align-items-center justify-content-center rounded-circle bg-danger-subtle text-danger";
                icon.innerHTML = '<i src="/assets/svg/remix/error-warning-line.svg" class="fs-32" aria-hidden="true"></i>';
                title.textContent = "Deployment failed";
                message.textContent = detail || `Your ${subject} could not be deployed.`;
                badge.className = "badge bg-danger-subtle text-danger";
                badge.textContent = "Error";
                return;
            }

            icon.className = "avatar-lg d-inline-flex align-items-center justify-content-center rounded-circle bg-info-subtle text-info";
            icon.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-label="Provisioning"></span>';
            title.textContent = `Deploying ${subject}`;
            message.textContent = detail || `Your ${subject} is being deployed.`;
            badge.className = "badge bg-info-subtle text-info";
            badge.textContent = "Provisioning";
        };
        const completeProvisioning = (status, detail) => {
            setProvisioningState(status, detail);
            completed = true;
            render();
        };
        root.addEventListener("input", (event) => {
            if (["autoscalingEnabled", "spotEnabled", "geoScaleEnabled", "verticalEnabled"].includes(event.target.name)) {
                syncEnabledSection(event.target.name);
            }
            if (event.target.name === "clusterName") {
                syncClusterSelection();
                renderClusterOptions();
            }
        });
        root.addEventListener("focusin", (event) => {
            if (event.target.name === "clusterName") renderClusterOptions();
        });
        root.addEventListener("focusout", (event) => {
            if (event.target.name !== "clusterName") return;
            setTimeout(() => {
                if (!root.querySelector("[data-cluster-options]")?.contains(document.activeElement)) {
                    hideClusterOptions();
                }
            }, 0);
        });
        root.addEventListener("change", async (event) => {
            if (["autoscalingEnabled", "spotEnabled", "geoScaleEnabled", "verticalEnabled"].includes(event.target.name)) {
                syncEnabledSection(event.target.name);
            }
            if (event.target.name === "cluster-provider") {
                syncInitialProviders();
                try {
                    await loadCredentials();
                } catch (error) {
                    const status = root.querySelector("[data-provider-status]");
                    status.hidden = false;
                    status.className = "alert alert-danger py-2";
                    status.textContent = error.message || "Unable to check provider credentials.";
                } finally {
                    render();
                }
            }
            if (event.target.name === "initialProvider") applyProvider();
            if (event.target.name === "storage-selection") {
                renderStorageFields();
                control("[data-provision-next]").disabled = false;
            }
        });
        root.addEventListener("click", (event) => {
            const clusterOption = event.target.closest("[data-cluster-option]");
            if (clusterOption && root.contains(clusterOption)) {
                const cluster = existingClusters.find(
                    (item) => String(item._id) === clusterOption.dataset.clusterOption
                );
                if (!cluster) return;
                field("clusterName").value = cluster.name || cluster._id;
                syncClusterSelection();
                hideClusterOptions();
                return;
            }
            const indicator = event.target.closest("[data-provision-indicator]");
            if (!indicator || !root.contains(indicator)) return;
            const targetStep = Number(indicator.dataset.provisionIndicator);
            if (!Number.isInteger(targetStep) || targetStep >= step) return;
            step = targetStep;
            render();
        });
        control("[data-provision-next]").addEventListener("click", async (event) => {
            const button = event.currentTarget;
            const status = root.querySelector(
                `[data-provision-step="${step}"] [data-step-status]`
            ) || root.querySelector("[data-provider-status]");
            button.disabled = true;
            try {
                if (step === 1) {
                    if (credentialSelection !== selectedProviders().join("|")) {
                        await loadCredentials();
                    }
                    if (credentialEntries.length) {
                        status.hidden = false;
                        status.className = "alert alert-info py-2";
                        status.textContent = "Saving provider credentials…";
                        if (!await saveCredentials()) return;
                    }
                    step = 2;
                } else if (step === 2) {
                    if (!validateStep(2)) return;
                    await loadStorageProviders();
                    step = 3;
                } else if (step === 3) {
                    if (!storageSelection() || !validateStep(3)) return;
                    await loadProviderProfiles();
                    if (!initialVmType()) {
                        throw new Error(
                            "No provider VM satisfies the configured minimum server size."
                        );
                    }
                    step = 4;
                }
                render();
            } catch (error) {
                status.hidden = false;
                status.className = "alert alert-danger py-2";
                status.textContent = error.message || "Unable to prepare the selected providers.";
            } finally {
                render();
            }
        });
        control("[data-provision-back]").addEventListener("click", () => {
            if (step > 1) step--;
            render();
        });
        control("[data-provision-prepare]").addEventListener("click", async (event) => {
            const button = event.currentTarget;
            if (!storageSelection() || !validateStep(4)) return;
            button.disabled = true;
            setProvisioningState("provisioning");
            completed = true;
            render();
            try {
                if (!await saveStorageProvider()) {
                    completed = false;
                    render();
                    button.disabled = false;
                    return;
                }
                const cluster = await createClusterRecord();
                const server = await createServerRecord(cluster);
                await provisionServer(cluster, server);
                completeProvisioning(
                    "success",
                    serverMode
                        ? "The provider accepted the server deployment."
                        : "The provider accepted the cluster's first server deployment."
                );
            } catch (error) {
                if (serverRecord?._id) {
                    try {
                        await updateDeploymentRecord({
                            status: "error",
                            error: error.message || String(error)
                        });
                    } catch (updateError) {
                        console.error("Unable to save the provisioning error:", updateError);
                    }
                }
                completeProvisioning(
                    "error",
                    error.message || `Unable to create the ${serverMode ? "server" : "cluster"}.`
                );
            }
        });

        applyDefaultConfiguration();
        const form = root.closest("form");
        if (form) {
            if (form.__clusterProvisionResetHandler) {
                form.removeEventListener("reset", form.__clusterProvisionResetHandler);
            }
            form.__clusterProvisionResetHandler = () => queueMicrotask(() => {
                if (!root.isConnected) return;
                step = 1;
                completed = false;
                clusterRecord = undefined;
                serverRecord = undefined;
                credentialDrafts.clear();
                selectedExistingClusterId = "";
                applyDefaultConfiguration();
                if (storageEntries.length) renderStorageOptions();
                syncEnabledSections();
                render();
            });
            form.addEventListener("reset", form.__clusterProvisionResetHandler);
        }
        syncEnabledSections();
        requestAnimationFrame(syncEnabledSections);
        setTimeout(syncEnabledSections, 0);
        window.addEventListener("pageshow", syncEnabledSections, { once: true });
        render();
        const loadInitialData = async () => {
            try {
                await loadCredentials();
            } catch (error) {
                const status = root.querySelector("[data-provider-status]");
                status.hidden = false;
                status.className = "alert alert-danger py-2";
                status.textContent = error.message || "Unable to check provider credentials.";
            }
            try {
                await loadClusters();
            } catch (error) {
                const status = root.querySelector("[data-cluster-status]");
                status.hidden = false;
                status.className = "alert alert-danger py-2 mb-0 mt-3";
                status.textContent = error.message || "Unable to load existing clusters.";
            }
        };
        loadInitialData();
    };
    for (const root of document.querySelectorAll(
        "[data-cluster-provision]:not([data-provision-ready])"
    )) {
        initialize(root);
    }
    const initializeObserver = () => {
        const observer = globalThis.CoCreate?.observer;
        if (!observer) return;
        CoCreate.clusterProvision ||= {};
        if (CoCreate.clusterProvision.observerInitialized) return;
        observer.init({
            name: "clusterProvision",
            types: ["addedNodes"],
            selector: "[data-cluster-provision]",
            callback: (mutation) => initialize(mutation.target)
        });
        CoCreate.clusterProvision.observerInitialized = true;
    };
    if (globalThis.CoCreate?.observer) initializeObserver();
    else document.addEventListener("observerLoaded", initializeObserver, { once: true });
})();
