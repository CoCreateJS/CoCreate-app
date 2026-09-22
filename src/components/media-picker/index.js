(() => {
    const installed = Symbol.for('CoCreate.mediaPicker');
    if (document[installed]) return;
    document[installed] = true;
    const contexts = new WeakMap();
    const initializedGrids = new WeakSet();
    const selector = '[data-picker-open]';
    let sequence = 0;
    const uploadedPaths = new WeakMap();
    const attribute = (element, name, value) => {
        if (element.getAttribute(name) !== value) element.setAttribute(name, value);
    };

    function position(popup) {
        const trigger = contexts.get(popup)?.trigger;
        if (!trigger?.isConnected) { popup.remove(); return; }
        const box = trigger.getBoundingClientRect();
        const width = Math.min(380, innerWidth - 24);
        popup.style.left = `${Math.max(12, Math.min(box.left, innerWidth - width - 12))}px`;
        const height = popup.offsetHeight;
        const top = box.bottom + 8;
        popup.style.top = `${Math.max(12, top + height <= innerHeight - 12 ? top : box.top - height - 8)}px`;
    }
    function close(popup) {
        const trigger = contexts.get(popup).trigger;
        popup.setAttribute('aria-hidden', 'true');
        popup.classList.remove('show');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus({ preventScroll: true });
    }
    function configure(popup) {
        const context = contexts.get(popup);
        const grid = popup.querySelector('[data-picker-results]');
        if (!context || !grid) return;
        const { trigger } = context;
        context.path = trigger.closest('[media-path]')?.getAttribute('media-path') || trigger.getAttribute('path') || '/media/avatars/';
        const data = window.CoCreate?.elements?.getDataObject?.(context.target);
        for (const attribute of ['database', 'storage']) {
            const value = data?.[attribute] || (attribute === 'database' ? localStorage.getItem('environment') : '');
            for (const element of [grid, ...popup.querySelectorAll('[data-picker-upload]')]) {
                if (value && element.getAttribute(attribute) !== value) element.setAttribute(attribute, value);
            }
        }
        attribute(grid, 'id', `${popup.id}-results`);
        attribute(grid, 'filter-query-key', trigger.getAttribute('filter-query-key') || 'content-type.$regex');
        attribute(grid, 'filter-query-value', trigger.getAttribute('filter-query-value') || '^image/');
        const accept = trigger.getAttribute('accept') || 'image/*';
        for (const input of popup.querySelectorAll('[data-picker-upload]')) {
            attribute(input, 'accept', accept);
            attribute(input, 'path', context.path);
        }
        popup.querySelector('[data-picker-camera]').hidden = !/(image|video)\//.test(accept);
        position(popup);
        if (!initializedGrids.has(grid)) {
            initializedGrids.add(grid);
            // Let source insertion and attribute observers finish before the first read.
            setTimeout(async () => {
                if (!grid.isConnected) return;
                try {
                    await window.CoCreate.elements.init(grid);
                    // init may have already registered this grid before its scope was ready.
                    // Rebuild the completed filter and explicitly request the initial results.
                    if (grid.getFilter && grid.setFilter) grid.setFilter(await grid.getFilter());
                } catch (error) {
                    initializedGrids.delete(grid);
                    popup.querySelector('[role="status"]').textContent = 'Could not load images. Close and reopen the picker to retry.';
                    console.error('Could not initialize media picker:', error);
                }
            }, 0);
        }
    }
    function init(trigger) {
        if (trigger.dataset.pickerReady) return;
        trigger.dataset.pickerReady = 'true';
        const field = trigger.closest('[data-media-field]');
        const target = field?.querySelector('[data-media-value]');
        if (!target) return;
        const id = `media-picker-${++sequence}`;
        const popup = document.createElement('div');
        popup.id = id;
        popup.className = 'dropdown-menu media-picker-dropdown';
        popup.setAttribute('role', 'dialog');
        popup.setAttribute('aria-label', 'Choose image');
        popup.setAttribute('aria-hidden', 'true');
        popup.setAttribute('aria-close-on', 'outside');
        // Keep the picker out of the editing form and its scrolling/clipping area.
        popup.setAttribute('crud', 'false');
        document.body.append(popup);
        contexts.set(popup, { trigger, target, field,
            path: trigger.closest('[media-path]')?.getAttribute('media-path') || trigger.getAttribute('path') || '/media/avatars/' });
        trigger.setAttribute('aria-controls', id);
        trigger.setAttribute('filter-query', `$document #${id}-results`);
        trigger.setAttribute('state-to', id);
        trigger.setAttribute('state.src', '/components/media-picker/index.html');
        popup.setAttribute('state-id', id);
        trigger.addEventListener('click', () => {
            // src is populated on first open; subsequent opens reuse the component.
            if (!popup.hasAttribute('src')) popup.setAttribute('src', '/components/media-picker/index.html');
            configure(popup);
        });
        const observer = new MutationObserver(mutations => {
            if (mutations.some(m => m.type === 'attributes')) configure(popup);
            if (mutations.some(m => m.addedNodes.length)) configure(popup);
        });
        observer.observe(popup, { childList: true, subtree: true, attributes: true, attributeFilter: ['aria-hidden'] });
        contexts.get(popup).observer = observer;
    }
    async function choose(popup, file) {
        const context = contexts.get(popup);
        if (!context.target.isConnected) throw new Error('The image field is no longer available.');
        if (!file.pathname?.startsWith('/') || file.pathname.startsWith('//') || file.pathname.includes('\\'))
            throw new Error('This image does not have a usable pathname.');
        const value = context.target.getAttribute('media-value') === 'src' ? file.pathname : [{
            file_id: file._id, pathname: file.pathname, src: file.pathname, name: file.name
        }];
        await context.target.setValue(value, false);
        context.field.querySelector('img').src = file.pathname;
        close(popup);
    }
    document.addEventListener('click', async event => {
        const popup = event.target.closest('.media-picker-dropdown');
        if (!popup) return;
        if (event.target.closest('[data-picker-close]')) { close(popup); return; }
        const saveButton = event.target.closest('[data-picker-save]');
        if (saveButton) {
            const context = contexts.get(popup);
            const pending = context?.pendingUpload;
            if (!pending || saveButton.disabled) return;
            const { input, file } = pending;
            const status = popup.querySelector('[role="status"]');
            saveButton.disabled = true;
            input.dataset.saving = 'true';
            try {
                status.textContent = 'Uploading…';
                const responses = await input.save();
                const records = (Array.isArray(responses) ? responses : [responses])
                    .filter(response => response && !response.error && response.success !== false)
                    .flatMap(response => response.object || []);
                const saved = records.find(record => record?._id);
                if (!saved) throw new Error('Upload could not be confirmed. Please try again.');
                if (!uploadedPaths.has(input)) uploadedPaths.set(input, new Set());
                uploadedPaths.get(input).add(file.pathname);
                await choose(popup, { ...file, ...saved });
                delete context.pendingUpload;
                saveButton.hidden = true;
                status.textContent = '';
            } catch (error) { status.textContent = error.message; }
            finally { saveButton.disabled = false; delete input.dataset.saving; }
            return;
        }
        const image = event.target.closest('[data-picker-image]:not([template])');
        if (!image) return;
        try { await choose(popup, { _id: image.dataset.fileId, pathname: image.dataset.path, name: image.dataset.name }); }
        catch (error) { popup.querySelector('[role="status"]').textContent = error.message; }
    });
    // CoCreate-file emits filesSelected after reading and storing the native files.
    // Saving stays in CoCreate-elements; this only prepares the destination and
    // connects the saved library file to the field that opened the picker.
    document.addEventListener('filesSelected', async event => {
        const input = event.target;
        if (!input.matches('[data-picker-upload]') || input.dataset.saving) return;
        const popup = input.closest('.media-picker-dropdown');
        const context = contexts.get(popup);
        if (!context || !input.getFiles || !input.save) return;
        input.dataset.saving = 'true';
        const status = popup.querySelector('[role="status"]');
        try {
            const files = await input.getFiles();
            if (!files.length) return;
            const file = { ...files[0] };
            if (uploadedPaths.get(input)?.has(file.pathname)) return;
            const accepted = input.accept.split(',').map(type => type.trim().toLowerCase());
            const mime = (file['content-type'] || file.type || '').toLowerCase();
            if (!accepted.some(type => type === '*/*' || type === mime ||
                (type.endsWith('/*') && mime.startsWith(type.slice(0, -1))) ||
                (type.startsWith('.') && file.name.toLowerCase().endsWith(type))))
                throw new Error('Choose a file of the allowed type.');
            const path = context.path.replace(/\/?$/, '/');
            if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\') || path.split('/').some(part => part === '..' || part === '.'))
                throw new Error('The upload destination is invalid.');
            file.name = `${crypto.randomUUID()}-${file.name.replace(/[\\/]/g, '-')}`;
            file.path = path;
            file.pathname = path + file.name;
            delete file._id;
            file.id = file.pathname;
            input.setAttribute('object', '');
            input.setValue([file]);
            context.pendingUpload = { input, file };
            popup.querySelector('[data-picker-save]').hidden = false;
            status.textContent = `${file.name} ready to upload. Click Save upload to continue.`;
        } catch (error) { status.textContent = error.message; }
        finally { delete input.dataset.saving; }
    }, true);
    function scan(root) {
        if (root.matches?.(selector)) init(root);
        root.querySelectorAll(selector).forEach(init);
    }
    new MutationObserver(mutations => {
        for (const mutation of mutations) for (const node of mutation.addedNodes)
            if (node instanceof Element) scan(node);
        if (mutations.some(mutation => mutation.removedNodes.length)) {
            for (const popup of document.querySelectorAll('.media-picker-dropdown')) {
                const context = contexts.get(popup);
                if (context && !context.trigger.isConnected) { context.observer.disconnect(); popup.remove(); }
            }
        }
    }).observe(document.documentElement, { subtree: true, childList: true });
    window.addEventListener('resize', () => document.querySelectorAll('.media-picker-dropdown.show').forEach(position));
    document.addEventListener('scroll', () => document.querySelectorAll('.media-picker-dropdown.show').forEach(position), true);
    scan(document);
})();
