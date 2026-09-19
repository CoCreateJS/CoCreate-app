(async () => {
    const shared = await import('/apps/storage-providers/shared.js');
    const cloud = await import('/apps/cloud-providers/shared.js');
    const routing = await import('/apps/routing-providers/shared.js');
    const ai = await import('/apps/ai-providers/shared.js');
    const { watchProviderChanges } = await import('/apps/storage-providers/live.js');
    const create = (tag, className, text) => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (text !== undefined) el.textContent = text;
        return el;
    };
    const responseObjects = response => {
        if (!response) throw new Error('No server confirmation received.');
        const error = response.error || response.data?.error;
        if (error && (!Array.isArray(error) || error.length))
            throw new Error([].concat(error).map(e => e.message || String(e)).join('; '));
        return response.object || response.data?.object || [];
    };
    async function initialize(root) {
        if (!root || root.dataset.storageReady) return;
        root.dataset.storageReady = 'true';
        const type = root.dataset.providerType || 'storage';
        const config = { storage: shared, cloud, routing, ai }[type];
        const labels = config[`${type}ProviderLabels`];
        const storageKeys = config[`${type}Keys`];
        const storageValue = config[`${type}Value`];
        const storageIsConfigured = config[`${type}IsConfigured`];
        const { storageIsEnabled, hasCredentialValue, createProviderInput, formatCredentialLabel } = shared;

        const status = root.querySelector('[data-storage-status]');
        const rows = root.querySelector('[data-storage-rows]');
        let crud;
        let entries = [];
        const cards = new Map();
        const subscriptionKeys = () => {
            const keys = [JSON.stringify({ array: 'apis' })];
            if (crud.database) keys.push(JSON.stringify({ array: 'apis', database: crud.database }));
            return keys;
        };
        const save = async (entry, changes) => {
            const response = await crud.send({
                method: entry._id ? 'object.update' : 'object.create', array: 'apis',
                subscriptionKeys: subscriptionKeys(),
                object: entry._id ? { _id: entry._id, type, ...changes } : {
                    name: entry.name, type, provider: entry.provider,
                    enabled: storageIsEnabled(entry), ...changes
                }
            });
            const object = responseObjects(response)[0];
            if (!entry._id && !object?._id) throw new Error('The server did not confirm creation. Please reload before retrying.');
            Object.assign(entry, changes, object?.$update || {}, object?._id ? { _id: object._id } : {});
            render();
        };
        const createEditor = entry => {
            const form = create('form', 'border-top p-3');
            form.setAttribute('crud', 'false');
            const body = create('div', 'd-flex flex-column gap-3');
            const nameLabel = create('label', 'form-label mb-0', 'Connection name');
            const name = create('input', 'form-control mt-1');
            name.required = true;
            name.value = entry.name;
            name.defaultValue = entry.name;
            name.dataset.providerName = 'true';
            nameLabel.append(name);
            body.append(nameLabel);
            const inputs = [];
            for (const key of storageKeys(entry)) {
                const label = create('label', 'form-label mb-0', type === 'routing' && entry.provider === 'cloudflare' && key === 'key' ? 'API token' : type === 'ai' && entry.provider === 'copilot' ? 'GitHub token' : config[`${type}FieldLabels`]?.[key] || formatCredentialLabel(key));
                const input = createProviderInput({ key, configured: hasCredentialValue(storageValue(entry, key)), storage: true });
                label.append(input);
                body.append(label);
                inputs.push(input);
            }
            const credentialUrl = config[`${type}ProviderUrls`][entry.provider];
            if (credentialUrl) {
                const link = create('a', 'text-decoration-none', `Get ${labels[entry.provider]} credentials ↗`);
                link.href = credentialUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                body.append(link);
            }

            const feedback = create('p', 'mb-0');
            feedback.setAttribute('role', 'status');
            body.append(feedback);
            const footer = create('div', 'd-flex justify-content-end');
            const submit = create('button', 'btn btn-success', 'Save');
            submit.type = 'submit';
            footer.append(submit);
            body.append(footer);
            form.append(body);
            form.addEventListener('submit', async event => {
                event.preventDefault();
                if (!form.reportValidity() || submit.disabled) return;
                submit.disabled = true;
                feedback.textContent = 'Saving…';
                try {
                    const changes = { name: name.value.trim() };
                    if (!changes.name) throw new Error('Enter a connection name.');
                    for (const input of inputs) {
                        const value = input.value.trim();
                        if (value) changes[input.dataset.storageKey] = value;
                    }
                    await save(entry, changes);
                    for (const input of inputs) {
                        input.value = '';
                        input.required = false;
                        input.placeholder = '••••••••';
                    }
                    feedback.textContent = 'Saved';
                } catch (error) { feedback.textContent = error.message; }
                finally { submit.disabled = false; }
            });
            return form;
        };
        const render = () => {
            for (const [entry, card] of cards) {
                if (!entries.includes(entry)) {
                    card.row.remove();
                    cards.delete(entry);
                }
            }
            entries.sort((a, b) =>
                Number(storageIsConfigured(b)) - Number(storageIsConfigured(a)) ||
                String(a.name || labels[a.provider] || a.provider || '').localeCompare(
                    String(b.name || labels[b.provider] || b.provider || ''),
                    undefined, { sensitivity: 'base', numeric: true }
                )
            );
            for (const entry of entries) {
                let card = cards.get(entry);
                if (!card) {
                    const row = root.querySelector('[data-storage-card-template]').content.firstElementChild.cloneNode(true);
                    if (Object.hasOwn(labels, entry.provider) && (type !== 'routing' || ['cloudflare', 'bunny'].includes(entry.provider))) {
                        const fallback = row.querySelector('i');
                        const icon = create('img', 'storage-provider-brand');
                        icon.src = `/assets/images/providers/${entry.provider}.svg`;
                        icon.alt = '';
                        icon.width = 28;
                        icon.height = 28;
                        icon.addEventListener('error', () => icon.replaceWith(fallback), { once: true });
                        fallback.replaceWith(icon);
                    }
                    const edit = row.querySelector('input[name="storage-expansion"]');
                    edit.setAttribute('aria-expanded', 'false');
                    const name = row.querySelector('strong');
                    const disabled = create('span', 'badge text-muted', 'Disabled');
                    const subtitle = row.querySelector('label > span > small');
                    subtitle.classList.add('d-block');
                    subtitle.textContent = labels[entry.provider] || entry.provider;
                    const badge = create('span', 'badge bg-success-subtle text-success', 'Configured');
                    const badges = create('span', 'd-flex flex-wrap justify-content-end align-items-center gap-1 ms-auto');
                    badges.append(disabled, badge);
                    row.querySelector('label').append(badges);
                    const fields = row.querySelector('[data-provider-credential-fields]');
                    edit.addEventListener('change', () => {
                        if (!fields.firstElementChild) {
                            const form = createEditor(entry);
                            form.firstElementChild.prepend(label);
                            fields.append(form);
                        }
                        fields.hidden = !edit.checked;
                        edit.setAttribute('aria-expanded', String(edit.checked));
                    });
                    const label = create('label', 'form-check form-switch mb-0 flex-shrink-0 align-self-start');
                    const toggle = create('input', 'form-check-input');
                    toggle.type = 'checkbox';
                    toggle.setAttribute('role', 'switch');
                    toggle.addEventListener('change', async () => {
                        const previous = storageIsEnabled(entry);
                        toggle.disabled = true;
                        edit.disabled = true;
                        try {
                            await save(entry, { enabled: toggle.checked });
                            status.hidden = true;
                        } catch (error) {
                            toggle.checked = previous;
                            status.hidden = false;
                            status.textContent = error.message;
                        } finally { toggle.disabled = false; edit.disabled = false; }
                    });
                    label.append(toggle, create('span', 'form-check-label', 'Enabled'));
                    rows.append(row);
                    card = { row, name, badge, edit, toggle, disabled };
                    cards.set(entry, card);
                }
                rows.append(card.row);
                const configured = storageIsConfigured(entry);
                card.name.textContent = entry.name;
                const nameInput = card.row.querySelector('[data-provider-name]');
                if (nameInput) {
                    if (nameInput.value === nameInput.defaultValue) nameInput.value = entry.name;
                    nameInput.defaultValue = entry.name;
                }
                for (const input of card.row.querySelectorAll('[data-storage-key]')) {
                    const configured = hasCredentialValue(storageValue(entry, input.dataset.storageKey));
                    input.required = !configured;
                    input.placeholder = configured ? '••••••••' : `Enter ${formatCredentialLabel(input.dataset.storageKey)}`;
                }
                card.badge.hidden = !configured;
                card.disabled.hidden = storageIsEnabled(entry);
                card.edit.setAttribute('aria-label', `${configured ? 'Edit' : 'Configure'} ${entry.name}`);
                card.toggle.setAttribute('aria-label', `Enable ${entry.name}`);
                card.toggle.checked = storageIsEnabled(entry);
            }
        };
        try {
            if (!window.CoCreate?.crud) await new Promise((resolve, reject) => {
                const loaded = () => { clearTimeout(timer); resolve(); };
                const timer = setTimeout(() => { document.removeEventListener('crudLoaded', loaded); reject(new Error('Provider connections are not available yet. Reload to retry.')); }, 15000);
                document.addEventListener('crudLoaded', loaded, { once: true });
            });
            crud = window.CoCreate.crud;
            let loading = false;
            let pending = false;
            const refresh = async () => {
                if (!root.isConnected) return;
                if (loading) { pending = true; return; }
                loading = true;
                try {
                    const next = responseObjects(await crud.send({
                        method: 'object.read', array: 'apis',
                        subscription: subscriptionKeys(),
                        filter: {
                            query: config[`${type}Query`] || { type },
                            sort: [{ key: 'name', direction: 'asc' }], limit: 0
                        }
                    }, { cache: false }));
                    if (!root.isConnected) return;
                    const previous = new Map(entries.map(entry => [entry._id, entry]));
                    entries = next.map(record => {
                        const entry = previous.get(record._id);
                        if (!entry || entry === record || entry.provider !== record.provider) return record;
                        for (const key of Object.keys(entry)) delete entry[key];
                        Object.assign(entry, record);
                        return entry;
                    });
                    render();
                    status.textContent = entries.length ? '' : `No ${type} providers found.`;
                    status.hidden = entries.length > 0;
                } catch (error) {
                    if (root.isConnected) {
                        status.hidden = false;
                        status.textContent = error.message;
                    }
                } finally {
                    loading = false;
                    if (pending) { pending = false; refresh(); }
                }
            };
            watchProviderChanges(crud, root, refresh);
            await refresh();
        } catch (error) { status.textContent = error.message; }
    }
    document.querySelectorAll('[data-storage-providers]').forEach(initialize);
})();
