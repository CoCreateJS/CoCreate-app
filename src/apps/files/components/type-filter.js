(() => {
	const group = document.querySelector('[aria-label="File categories"]');
	const header = group?.closest('.list-header');
	if (!header || group.dataset.responsiveFilters) return;
	group.dataset.responsiveFilters = 'true';
	const menu = group.querySelector('#fileTypeMoreMenu');
	const dropdown = menu.parentElement;
	const categories = ['images', 'videos', 'audio', 'docs', 'favorites'].map((type) => {
		const input = group.querySelector(`#file-type-${type}`);
		const label = input.nextElementSibling;
		const item = document.createElement('li');
		item.setAttribute('role', 'presentation');
		return { input, label, item, classes: label.className,
			breakpoint: type === 'images' ? 640 : type === 'videos' ? 860 : 1100 };
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
        dropdown.hidden = !menu.children.length;
		if (focused?.matches('input[name="file-type"]') && group.contains(focused)) {
			const target = menu.contains(focused) && menu.getAttribute('aria-hidden') !== 'false'
				? group.querySelector('#fileTypeMoreButton') : focused;
			target.focus({ preventScroll: true });
		}
	});
	observer.observe(header);
})();
