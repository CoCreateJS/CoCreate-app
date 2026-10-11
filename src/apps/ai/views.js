// Code-fence rendering and syntax highlighting used by AI chat.
export function createCodeTools() {
	const highlightTimers = new WeakMap();
	const prismLanguageLoads = new Map();

	const loadPrismLanguage = (language) => {
		if (!prismLanguageLoads.has(language)) {
			prismLanguageLoads.set(
				language,
				new Promise((resolve, reject) => {
					const script = document.createElement("script");
					script.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${language}.min.js`;
					script.onload = resolve;
					script.onerror = () =>
						reject(
							new Error(`Unable to load Prism language: ${language}`)
						);
					document.head.append(script);
				}).catch((error) => {
					prismLanguageLoads.delete(language);
					console.error(error);
				})
			);
		}
		return prismLanguageLoads.get(language);
	};

	const highlightCodeBlocks = (element) => {
		clearTimeout(highlightTimers.get(element));
		let attempts = 0;
		const highlight = async () => {
			if (!globalThis.Prism && globalThis.CoCreate?.plugins?.init) {
				element.setAttribute(
					"plugin",
					'{"$Prism.highlightAllUnder":["$this"]}'
				);
				await globalThis.CoCreate.plugins.init(element);
			}
			if (globalThis.Prism?.highlightAllUnder) {
				const languages = [
					...element.querySelectorAll("code[class*='language-']")
				].map((code) =>
					[...code.classList]
						.find((name) => name.startsWith("language-"))
						?.slice(9)
				).filter(Boolean);
				const missing = [...new Set(languages)].filter(
					(language) => !globalThis.Prism.languages[language]
				);
				const autoloader = globalThis.Prism.plugins?.autoloader;
				if (missing.length && autoloader?.loadLanguages) {
					await new Promise((resolve) =>
						autoloader.loadLanguages(missing, resolve, resolve)
					);
				} else if (missing.length) {
					await Promise.all(missing.map(loadPrismLanguage));
				}
				globalThis.Prism.highlightAllUnder(element);
				highlightTimers.delete(element);
				return;
			}
			if (++attempts < 50) {
				highlightTimers.set(element, setTimeout(highlight, 100));
			} else {
				highlightTimers.delete(element);
			}
		};
		highlightTimers.set(element, setTimeout(highlight, 80));
	};

	const getCodeExtension = (language) =>
		({
			javascript: "js",
			js: "js",
			typescript: "ts",
			ts: "ts",
			html: "html",
			css: "css",
			json: "json",
			bash: "sh",
			shell: "sh",
			python: "py",
			php: "php",
			sql: "sql"
		})[language] || "txt";

	const createCodeBlock = (language, content) => {
		const block = document.createElement("section");
		block.className = "ai-code-block";
		const header = document.createElement("header");
		const label = document.createElement("span");
		label.textContent = language || "code";
		const copy = document.createElement("button");
		copy.type = "button";
		copy.textContent = "Copy raw";
		const menu = document.createElement("details");
		menu.className = "ai-code-menu";
		copy.addEventListener("click", async () => {
			await navigator.clipboard?.writeText(content);
			copy.textContent = "Copied";
			menu.open = false;
			setTimeout(() => {
				copy.textContent = "Copy raw";
			}, 1500);
		});
		const download = document.createElement("button");
		download.type = "button";
		download.textContent = "Download raw";
		download.addEventListener("click", () => {
			const url = URL.createObjectURL(
				new Blob([content], { type: "text/plain" })
			);
			const link = document.createElement("a");
			link.href = url;
			link.download = `cocreate-ai.${getCodeExtension(language)}`;
			link.click();
			URL.revokeObjectURL(url);
			menu.open = false;
		});
		const actions = document.createElement("div");
		actions.className = "ai-code-actions";
		const menuTrigger = document.createElement("summary");
		menuTrigger.setAttribute("aria-label", "Code options");
		menuTrigger.innerHTML =
			'<i src="/assets/svg/remix/more-2-fill.svg" aria-hidden="true"></i>';
		const menuOptions = document.createElement("div");
		menuOptions.append(download);
		menu.append(menuTrigger, menuOptions);
		actions.append(copy, menu);
		header.append(label, actions);

		const pre = document.createElement("pre");
		const code = document.createElement("code");
		if (language) code.className = `language-${language}`;
		if (language === "diff") {
			const lines = content.split("\n");
			lines.forEach((line, index) => {
				const row = document.createElement("span");
				row.className = "ai-diff-line";
				if (line.startsWith("+") && !line.startsWith("+++")) {
					row.classList.add("added");
				} else if (line.startsWith("-") && !line.startsWith("---")) {
					row.classList.add("removed");
				} else if (line.startsWith("@@")) {
					row.classList.add("meta");
				}
				row.textContent = line;
				code.append(row);
				if (index < lines.length - 1) code.append("\n");
			});
		} else {
			code.textContent = content;
		}
		pre.append(code);
		block.append(header, pre);
		return block;
	};

	const createJsonBlock = (content) => {
		try {
			const formatted = JSON.stringify(JSON.parse(content), null, 2);
			const block = createCodeBlock("json", formatted);
			block.classList.add("ai-json-block");
			const header = block.querySelector("header");
			const label = header.querySelector("span");
			label.textContent = "JSON data";
			const pre = block.querySelector("pre");
			const toggle = document.createElement("button");
			toggle.type = "button";
			toggle.textContent = "Collapse";
			toggle.setAttribute("aria-expanded", "true");
			toggle.addEventListener("click", () => {
				const expanded = toggle.getAttribute("aria-expanded") === "true";
				toggle.setAttribute("aria-expanded", String(!expanded));
				toggle.textContent = expanded ? "Expand" : "Collapse";
				pre.hidden = expanded;
			});
			header.querySelector(".ai-code-actions").prepend(toggle);
			return block;
		} catch {
			return createCodeBlock("json", content);
		}
	};

	return { createCodeBlock, createJsonBlock, highlightCodeBlocks };
}
