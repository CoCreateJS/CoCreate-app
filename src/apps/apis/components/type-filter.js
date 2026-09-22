(() => {
	const group = document.querySelector('[aria-label="API categories"]');
	const header = group?.closest('.list-header');
	if (!header || group.dataset.responsiveFilters) return;
	group.dataset.responsiveFilters = 'true';
	const menu = group.querySelector('#apiTypeMoreMenu');
	const dropdown = menu.parentElement;
	const categories = ['storage', 'cloud', 'routing', 'ai'].map((type) => {
		const input = group.querySelector(`#api-type-${type}`);
		const label = input.nextElementSibling;
		const item = document.createElement('li');
		item.setAttribute('role', 'presentation');
		return { input, label, item, classes: label.className,
			breakpoint: type === 'storage' || type === 'cloud' ? 640 : 860 };
	});
	const observer = new ResizeObserver(([entry]) => {
		if (!group.isConnected) {
			observer.disconnect();
			return;
		}
		const focused = document.activeElement;
		// Reverse insertion keeps the original category order in both locations.
		for (const category of [...categories].reverse()) {
			const { input, label, item, classes, breakpoint } = category;
			if (entry.contentRect.width <= breakpoint) {
				if (input.parentElement === item) continue;
				label.className = 'dropdown-item';
				item.append(input, label);
				menu.prepend(item);
			} else if (input.parentElement === item) {
				label.className = classes;
				const next = categories[categories.indexOf(category) + 1]?.input;
				const anchor = next?.parentElement === group ? next : dropdown;
				group.insertBefore(input, anchor);
				group.insertBefore(label, anchor);
				item.remove();
			}
		}
		if (focused?.matches('input[name="api-type"]') && group.contains(focused)) {
			const target = menu.contains(focused) && menu.getAttribute('aria-hidden') !== 'false'
				? group.querySelector('#apiTypeMoreButton') : focused;
			target.focus({ preventScroll: true });
		}
	});
	observer.observe(header);
})();
