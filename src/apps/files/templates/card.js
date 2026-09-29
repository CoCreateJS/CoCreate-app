(() => {
    const installed = Symbol.for('CoCreate.fileCards');
    if (document[installed]) return;
    document[installed] = true;
    const selector = '.files-media-card:not([template])';
    const versions = new WeakMap();
    function render(card) {
        if (!card.matches(selector) || card.closest('[template]')) return;
        const { mediaType: type = '', mediaPath: path = '' } = card.dataset;
        const version = JSON.stringify([type, path]);
        if (versions.get(card) === version) return;
        versions.set(card, version);
        const kind = type === 'text/directory' ? 'Folder' : type.startsWith('image/') ? 'Image' :
            type.startsWith('video/') ? 'Video' : type.startsWith('audio/') ? 'Audio' :
            type === 'application/pdf' ? 'PDF' : /^(application|text)\//.test(type) ? 'Document' : 'File';
        const icons = {
            Folder: 'folder-2-line.svg',
            Image: 'image-fill.svg',
            Video: 'video-line.svg',
            Audio: 'music-line.svg',
            PDF: 'file-pdf-fill.svg',
            Document: 'file-text-line.svg',
            File: 'file-line.svg'
        };
        const icon = `/assets/svg/remix/${icons[kind]}`;
        card.querySelector('.files-media-placeholder i').setAttribute('src', icon);
        card.querySelector('.files-media-file-icon').setAttribute('src', icon);
        card.querySelectorAll('[data-media-label]').forEach(label => label.textContent = kind);
        card.querySelector('.files-media-preview > img')?.remove();
        if (kind === 'Image' && path.startsWith('/') && !path.startsWith('//') && !path.includes('\\')) {
            const image = document.createElement('img');
            image.alt = '';
            image.loading = 'lazy';
            image.decoding = 'async';
            image.addEventListener('error', () => image.remove(), { once: true });
            image.src = path;
            card.querySelector('.files-media-preview').prepend(image);
        }
    }
    async function favoriteState(card) {
        const stars = card.querySelector('[data-media-stars]');
        const user = card.querySelector('[data-media-user]');
        if (!stars.getValue || !user.getValue) return;
        const [values, id] = await Promise.all([stars.getValue(), user.getValue()]);
        const active = Array.isArray(values) && values.includes(id);
        const button = card.querySelector('.files-media-favorite');
        button.setAttribute('aria-pressed', String(active));
        button.querySelector('i').setAttribute(
            'src',
            active
                ? '/assets/svg/remix/star-fill.svg'
                : '/assets/svg/remix/star-line.svg'
        );
        button.querySelector('[data-media-favorite-label]').textContent = active ? 'Remove from favorites' : 'Add to favorites';
        return { values: Array.isArray(values) ? values : [], id, active };
    }
    function scan(root) {
        const cards = [...root.querySelectorAll(selector)];
        if (root.matches?.(selector)) cards.unshift(root);
        for (const card of cards) { render(card); void favoriteState(card).catch(() => {}); }
    }
    document.addEventListener('input', event => {
        if (event.target.matches('[data-media-stars]')) {
            const card = event.target.closest(selector);
            if (card) void favoriteState(card).catch(() => {});
        }
    });
    document.addEventListener('click', async event => {
        const button = event.target.closest('.files-media-favorite');
        const card = button?.closest(selector);
        if (!card || button.disabled) return;
        button.disabled = true;
        const status = card.querySelector('.files-media-error');
        status.textContent = '';
        try {
            const current = await favoriteState(card);
            if (!current?.id || current.id === '$user_id') throw new Error('Sign in to save favorites.');
            const data = window.CoCreate?.elements?.getDataObject?.(card);
            const scope = {};
            for (const key of ['database', 'storage']) if (data?.[key]) scope[key] = data[key];
            if (!scope.database && localStorage.getItem('environment')) scope.database = localStorage.getItem('environment');
            const response = await window.CoCreate.crud.send({
                ...scope, method: 'object.update', array: 'files',
                object: { _id: card.getAttribute('object'), [current.active ? '$pull.starred' : '$addToSet.starred']: current.id }
            });
            if (!response || (response.error && (!Array.isArray(response.error) || response.error.length)))
                throw new Error('Could not save favorite. Try again.');
            const values = current.active ? current.values.filter(id => id !== current.id) : [...new Set([...current.values, current.id])];
            card.querySelector('[data-media-stars]').value = JSON.stringify(values);
            await favoriteState(card);
        } catch (error) {
            status.textContent = error.message || 'Could not save favorite. Try again.';
        } finally { button.disabled = false; }
    });
    new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes') render(mutation.target);
            else for (const node of mutation.addedNodes) if (node instanceof Element) scan(node);
        }
    }).observe(document.documentElement, { childList: true, subtree: true, attributes: true,
        attributeFilter: ['data-media-type', 'data-media-path'] });
    scan(document);
})();
