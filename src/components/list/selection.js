(() => {
    const installed = Symbol.for('CoCreate.listSelection');
    if (document[installed]) return;
    document[installed] = true;
    const selector = '[data-grid-selection], table[data-row-selection]';
    const itemSelector = '[data-select-card], tbody > tr';
    const rowCheckbox = item => item.querySelector('[data-select-row]');
    const isTable = grid => grid.matches('table[data-row-selection]');
    const states = new WeakMap();
    const interactive = 'a,button,input,textarea,select,label,[contenteditable="true"],[role="button"],[data-card-open]';
    const cards = grid => (isTable(grid)
        ? [...grid.querySelectorAll('tbody > tr')].filter(row => row.closest('table') === grid && rowCheckbox(row))
        : [...grid.querySelectorAll('[data-select-card]')].filter(card => card.closest('[data-grid-selection]') === grid)).filter(card => {
            const record = isTable(grid) ? rowCheckbox(card) : card;
            return !card.closest('[template],template,[hidden]') &&
                !card.matches('[disabled],[aria-disabled="true"]') && !record.disabled &&
                record.getAttribute('object') && !record.getAttribute('object').includes('{{');
        });
    const selected = card => rowCheckbox(card)?.checked ?? (card.getAttribute('aria-selected') === 'true');
    function setSelected(card, value) {
        const checkbox = rowCheckbox(card);
        if (checkbox) checkbox.checked = value;
        if (card.getAttribute('aria-selected') !== String(value)) card.setAttribute('aria-selected', String(value));
        if (checkbox && card.matches('tr')) card.classList.toggle('table-active', value);
    }

    function update(grid) {
        const items = cards(grid);
        const count = items.filter(selected).length;
        for (const item of items) setSelected(item, selected(item));
        const all = grid.querySelector('[data-select-all]');
        if (all) {
            all.checked = items.length > 0 && count === items.length;
            all.indeterminate = count > 0 && count < items.length;
            if (all.disabled !== (items.length === 0)) all.disabled = items.length === 0;
        }
        const header = grid.closest('.component-list')?.querySelector('.list-header');
        const summary = header?.querySelector('[data-selection-summary]');
        if (summary) {
            const hidden = count === 0;
            if (summary.hidden !== hidden) summary.hidden = hidden;
            const counter = summary.querySelector('[data-selection-count]');
            const text = `${count} selected`;
            if (counter.textContent !== text) counter.textContent = text;
        }
        grid.dispatchEvent(new CustomEvent('selectionchange', {
            bubbles: true, detail: { selected: items.filter(selected), loaded: items.length }
        }));
    }

    function focusCard(grid, card, focus = true) {
        for (const item of cards(grid)) item.tabIndex = item === card ? 0 : -1;
        if (focus) card.focus({ preventScroll: true });
    }

    function select(grid, card, { range = false, toggle = false } = {}) {
        const state = states.get(grid);
        const items = cards(grid);
        if (range && items.includes(state.anchor)) {
            const from = items.indexOf(state.anchor), to = items.indexOf(card);
            for (let i = 0; i < items.length; i++) {
                const inRange = i >= Math.min(from, to) && i <= Math.max(from, to);
                setSelected(items[i], inRange || (toggle && selected(items[i])));
            }
        } else {
            const value = !selected(card);
            for (const item of items) {
                if (!toggle || item === card) setSelected(item, item === card && (toggle ? value : true));
            }
            state.anchor = card;
        }
        focusCard(grid, card);
        update(grid);
    }

    function selectAll(grid, value) {
        for (const card of cards(grid)) setSelected(card, value);
        states.get(grid).anchor = null;
        update(grid);
    }

    function init(grid) {
        if (!states.has(grid)) states.set(grid, { anchor: null, identities: new WeakMap() });
        const state = states.get(grid);
        grid.setAttribute('role', 'grid');
        grid.setAttribute('aria-multiselectable', 'true');
        if (!grid.hasAttribute('aria-label')) grid.setAttribute('aria-label', 'Records');
        const items = cards(grid);
        for (const card of items) {
            const record = isTable(grid) ? rowCheckbox(card) : card;
            const identity = `${record.getAttribute('array')}:${record.getAttribute('object')}`;
            if (state.identities.get(card) !== identity) {
                setSelected(card, !state.identities.has(card) && isTable(grid) ? record.checked : false);
                if (state.anchor === card) state.anchor = null;
                state.identities.set(card, identity);
            }
            card.setAttribute('role', 'row');
            if (isTable(grid)) {
                for (const cell of card.cells) cell.setAttribute('role', 'gridcell');
            } else card.querySelector('.card-body')?.setAttribute('role', 'gridcell');
            if (!card.hasAttribute('tabindex')) card.tabIndex = -1;
        }
        if (!items.some(card => card.tabIndex === 0) && items.length) focusCard(grid, items[0], false);
        update(grid);
    }

    document.addEventListener('mousedown', event => {
        if (event.shiftKey && event.target.closest(selector) && !event.target.closest(interactive))
            event.preventDefault();
    });

    document.addEventListener('click', event => {
        const control = event.target.closest('[data-selection-all],[data-selection-clear]');
        if (control) {
            const grid = control.closest('.component-list')?.querySelector(selector);
            if (grid) selectAll(grid, control.hasAttribute('data-selection-all'));
            return;
        }
        const grid = event.target.closest(selector);
        if (!grid) return;
        const checkbox = event.target.closest('[data-select-row]');
        if (checkbox) {
            const card = checkbox.closest(itemSelector);
            const items = cards(grid);
            if (!items.includes(card)) return;
            const state = states.get(grid);
            if (event.shiftKey && items.includes(state.anchor)) {
                const from = items.indexOf(state.anchor), to = items.indexOf(card);
                const value = checkbox.checked;
                for (let i = Math.min(from, to); i <= Math.max(from, to); i++) setSelected(items[i], value);
            } else state.anchor = card;
            focusCard(grid, card, false);
            return;
        }
        if (event.target.closest(interactive)) return;
        const card = event.target.closest(itemSelector);
        if (!cards(grid).includes(card)) return;
        select(grid, card, { toggle: event.ctrlKey || event.metaKey, range: event.shiftKey });
    });

    document.addEventListener('change', event => {
        const checkbox = event.target;
        if (!checkbox.matches('[data-select-row],[data-select-all]')) return;
        const grid = checkbox.closest(selector);
        if (!grid || checkbox.closest('[template],template,[hidden]')) return;
        if (checkbox.hasAttribute('data-select-all')) selectAll(grid, checkbox.checked);
        else update(grid);
    });

    document.addEventListener('keydown', event => {
        const grid = event.target.closest(selector);
        if (!grid || event.target.closest('input:not([data-select-row]):not([data-select-all]),textarea,select,[contenteditable="true"]')) return;
        const items = cards(grid);
        const card = event.target.closest(itemSelector);
        if (!items.includes(card)) return;
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
            event.preventDefault(); selectAll(grid, true); return;
        }
        if (event.key === 'Escape') {
            event.preventDefault(); selectAll(grid, false); return;
        }
        if (event.target !== card) return;
        if (event.key === ' ' || event.key === 'Spacebar') {
            event.preventDefault(); select(grid, card, { toggle: true, range: event.shiftKey }); return;
        }
        if (event.key === 'Enter') {
            const link = card.querySelector('[data-card-open], a[state-to="offcanvas-app-view"], a[href]');
            if (link) { event.preventDefault(); link.click(); }
            return;
        }
        const index = items.indexOf(card);
        let next;
        if (event.key === 'Home') next = items[0];
        else if (event.key === 'End') next = items.at(-1);
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            const rtl = getComputedStyle(grid).direction === 'rtl';
            const step = (event.key === 'ArrowRight') !== rtl ? 1 : -1;
            next = items[index + step];
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            const box = card.getBoundingClientRect();
            const direction = event.key === 'ArrowDown' ? 1 : -1;
            next = items.map(item => ({ item, box: item.getBoundingClientRect() }))
                .filter(candidate => (candidate.box.top - box.top) * direction > 1)
                .sort((a, b) => Math.abs(a.box.top - box.top) - Math.abs(b.box.top - box.top) ||
                    Math.abs(a.box.left - box.left) - Math.abs(b.box.left - box.left))[0]?.item;
        } else return;
        event.preventDefault();
        if (next) {
            if (event.shiftKey) {
                if (!cards(grid).includes(states.get(grid).anchor)) states.get(grid).anchor = card;
                select(grid, next, { range: true, toggle: event.ctrlKey || event.metaKey });
            }
            else focusCard(grid, next);
            next.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        }
    });

    new MutationObserver(mutations => {
        const grids = new Set();
        for (const mutation of mutations) {
            if (mutation.target instanceof Element) {
                const grid = mutation.target.closest(selector);
                if (grid) grids.add(grid);
            }
            for (const node of mutation.addedNodes) {
                if (!(node instanceof Element)) continue;
                if (node.matches(selector)) grids.add(node);
                node.querySelectorAll(selector).forEach(grid => grids.add(grid));
                if (node.matches('.list-header') || node.querySelector('.list-header')) {
                    const list = node.closest('.component-list');
                    list?.querySelectorAll(selector).forEach(grid => grids.add(grid));
                }
            }
        }
        for (const grid of grids) if (grid.isConnected) init(grid);
        if (!document.querySelector(selector)) {
            document.querySelectorAll('[data-selection-summary]:not([hidden])').forEach(summary => { summary.hidden = true; });
        }
    }).observe(document.documentElement, {
        subtree: true, childList: true, attributes: true, attributeFilter: ['object', 'hidden', 'disabled']
    });
    document.querySelectorAll(selector).forEach(init);
})();
