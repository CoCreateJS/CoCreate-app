(() => {
    const shell = document.querySelector("[data-ai-chat]:not([data-ai-initialized])");
    if (!shell) return;
    shell.setAttribute("data-ai-initialized", "");

    const models = {
        copilot: ["gpt-5-mini"],
        openai: [
            "gpt-5.6-terra",
            "gpt-5.6-sol",
            "gpt-5.6-luna",
            "gpt-5.5",
            "gpt-5.5-pro",
            "gpt-5.4",
            "gpt-5.4-pro",
            "gpt-5.4-mini",
            "gpt-5.4-nano",
            "gpt-5.3-codex",
            "gpt-5.2",
            "gpt-5.2-pro",
            "gpt-5.1",
            "gpt-5-pro",
            "gpt-5",
            "gpt-5-mini",
            "gpt-4.1"
        ],
        gemini: ["gemini-1.5-flash", "gemini-1.5-pro"]
    };
    const messageScroll = shell.querySelector(".ai-message-scroll");
    const messages = shell.querySelector(".ai-messages");
    const emptyView = messages.querySelector(".ai-empty").cloneNode(true);
    const form = shell.querySelector(".ai-composer");
    const prompt = shell.querySelector(".ai-prompt");
	const dictate = shell.querySelector(".ai-dictate");
    const send = shell.querySelector(".ai-send");
    const stop = shell.querySelector(".ai-stop");
    const steerQueue = shell.querySelector(".ai-steer-queue");
    const steerCount = shell.querySelector(".ai-steer-count");
    const steerItems = shell.querySelector(".ai-steer-items");
    const provider = shell.querySelector(".ai-provider");
    const model = shell.querySelector(".ai-model");
    const modelValue = shell.querySelector(".ai-model-value");
	const modelOptions = shell.querySelector(".ai-model-options");
	const status = shell.querySelector(".ai-status");
	const panelDock = shell.querySelector(".ai-chat-panel-dock");
	const panelClose = shell.querySelector(".ai-chat-panel-close");
	const threadList = shell.querySelector(".ai-thread-list");
	const sidebar = shell.querySelector(".ai-sidebar");
	const threadScroll = shell.querySelector(".ai-thread-scroll");
	const sidebarToggle = shell.querySelector(".ai-sidebar-toggle");
	const sidebarBackdrop = shell.querySelector(".ai-sidebar-backdrop");
	const streams = new Map();
	const queuedSteers = new Map();
	const highlightTimers = new WeakMap();
	const messageRecords = new Map();
	const messageHistoryPageSize = 20;
	let messageHistoryExhausted = true;
	let messageHistoryLoading = false;
	let messageHistoryOffset = 0;
	let conversationMessagesNested = false;
	let recognizing = false;
	let activeBranchLeafId;
	let editingMessage;
	const messageTime = (message) =>
		new Date(message?.created?.on || 0).getTime();
	const getLatestDescendant = (message) => {
		let current = message;
		while (current) {
			const children = [...messageRecords.values()]
				.filter((candidate) =>
					String(candidate.parent_id || "") === String(current._id)
				)
				.sort((a, b) => messageTime(a) - messageTime(b));
			if (!children.length) break;
			current = children.at(-1);
		}
		return current;
	};
	const renderActiveBranch = async (message) => {
		const leaf = getLatestDescendant(message);
		activeBranchLeafId = leaf?._id ? String(leaf._id) : undefined;
		const path = [];
		let current = leaf;
		while (current) {
			path.push(current);
			current = messageRecords.get(String(current.parent_id));
		}
		messages.replaceChildren();
		for (const record of path.reverse()) {
			addMessage(record.role || "assistant", record.content || "", record.views || [], record);
		}
		if (conversationId && leaf?._id) {
			await socket.send({
				method: "object.update",
				array: "ai-conversations",
				object: { _id: conversationId, active_message_id: leaf._id }
			});
		}
	};
	let socket;
	let listeningSocket;
	let socketRetryTimer;
	let socketRetryDelay = 250;
	let conversationRestoreStarted = false;
	let retrySocketConnection = () => {};
	const menuCloseRoot = document;
	const compactDockQuery = globalThis.matchMedia("(max-width: 860px)");
	if (menuCloseRoot.aiCodeMenuCloseHandler) {
		menuCloseRoot.removeEventListener("click", menuCloseRoot.aiCodeMenuCloseHandler);
	}
	menuCloseRoot.aiCodeMenuCloseHandler = (event) => {
		for (const menu of shell.querySelectorAll(".ai-code-menu[open]")) {
			const trigger = menu.querySelector(":scope > summary");
			if (!trigger?.contains(event.target)) menu.open = false;
		}
	};
	menuCloseRoot.addEventListener("click", menuCloseRoot.aiCodeMenuCloseHandler);
	const configureDockButton = () => {
		if (!panelDock) return;
		const dockIcon = panelDock.querySelector("i");
		if (shell.closest("#ai-chat-panel")) {
			panelDock.title = "Dock left";
			panelDock.setAttribute("aria-label", "Dock AI chat in main view");
			panelDock.setAttribute("aria-controls", "ai-chat-panel");
			panelDock.setAttribute("aria-close", "");
			dockIcon?.setAttribute("src", "/assets/svg/sidebar-fold-line.svg");
			if (panelClose) panelClose.hidden = false;
		} else {
			panelDock.title = "Dock right";
			panelDock.setAttribute("aria-label", "Dock AI chat in side panel");
			panelDock.setAttribute("aria-controls", "ai-chat-panel");
			panelDock.removeAttribute("aria-close");
			dockIcon?.setAttribute("src", "/assets/svg/sidebar-unfold-line.svg");
			if (panelClose) panelClose.hidden = true;
		}
	};
	configureDockButton();
	panelDock?.addEventListener("click", () => {
		const appPath = "/apps/ai/index.html";
		const mainView = document.querySelector("#main-view");
		const panel = document.querySelector("#ai-chat-panel");
		const panelContent = document.querySelector(".ai-chat-panel-content");
		const navbarButton = document.querySelector("#ai-chat-button");
		if (!mainView || !panel || !panelContent || !navbarButton) return;
		const dockLeft = Boolean(shell.closest("#ai-chat-panel"));
		if (!dockLeft && compactDockQuery.matches) return;
		shell.setAttribute("render-clone", "");
		if (dockLeft) {
			mainView.setAttribute("src", "");
			mainView.replaceChildren(shell);
			panelContent.setAttribute("src", "");
			panel.setAttribute("aria-hidden", "true");
			navbarButton.setAttribute("state-to", "adminView");
			navbarButton.setAttribute("state.src", appPath);
			navbarButton.setAttribute("aria-controls", "");
			CoCreate.state.setState({
				adminView: { src: appPath },
				"ai-chat-btn": {
					"state-to": "adminView",
					"state.src": appPath,
					"aria-controls": ""
				},
				"ai-chat-panel-content": { src: "" },
				"ai-chat-panel": { "aria-hidden": "true" }
			});
		} else {
			panelContent.setAttribute("src", "");
			panelContent.replaceChildren(shell);
			panel.setAttribute("aria-hidden", "false");
			mainView.setAttribute("src", "");
			navbarButton.setAttribute("state-to", "ai-chat-panel-content");
			navbarButton.setAttribute("state.src", appPath);
			navbarButton.setAttribute("aria-controls", "ai-chat-panel");
			CoCreate.state.setState({
				adminView: { src: "" },
				"ai-chat-btn": {
					"state-to": "ai-chat-panel-content",
					"state.src": appPath,
					"aria-controls": "ai-chat-panel"
				},
				"ai-chat-panel-content": { src: appPath },
				"ai-chat-panel": { "aria-hidden": "false" }
			});
		}
		configureDockButton();
		requestAnimationFrame(() => requestAnimationFrame(() => {
			shell.removeAttribute("render-clone");
		}));
	});
	const enforceCompactDock = () => {
		const panel = document.querySelector("#ai-chat-panel");
		if (
			!compactDockQuery.matches ||
			!panelDock ||
			!panel?.contains(shell) ||
			panel.getAttribute("aria-hidden") !== "false"
		) return;
		panelDock.click();
	};
	compactDockQuery.addEventListener("change", enforceCompactDock);
	requestAnimationFrame(enforceCompactDock);
	let conversationId;
    let conversationLoadId;

	const makeId = () =>
		crypto.randomUUID?.() ||
		`ai-${Date.now()}-${Math.random().toString(16).slice(2)}`;
	const aiObserverNames = new Set();
	const initAIObserver = (config) => {
		const name = config.name || `AIChat-${makeId()}`;
		let initialized = false;
		let disposed = false;
		const initialize = () => {
			if (disposed || initialized || !globalThis.CoCreate?.observer) return;
			initialized = true;
			aiObserverNames.add(name);
			CoCreate.observer.init({ ...config, name });
		};
		if (globalThis.CoCreate?.observer) initialize();
		else document.addEventListener("observerLoaded", initialize, { once: true });
		return () => {
			disposed = true;
			document.removeEventListener("observerLoaded", initialize);
			if (initialized) globalThis.CoCreate?.observer?.uninit(name);
			aiObserverNames.delete(name);
		};
	};

	const scrollDown = () => {
		const scrollElement =
			messageScroll.querySelector(".simplebar-content-wrapper") ||
			messageScroll;
		scrollElement.scrollTop = scrollElement.scrollHeight;
	};
	const prismLanguageLoads = new Map();
	const loadPrismLanguage = (language) => {
		if (!prismLanguageLoads.has(language)) {
			prismLanguageLoads.set(language, new Promise((resolve, reject) => {
				const script = document.createElement("script");
				script.src = `https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-${language}.min.js`;
				script.onload = resolve;
				script.onerror = () => reject(
					new Error(`Unable to load Prism language: ${language}`)
				);
				document.head.append(script);
			}).catch((error) => {
				prismLanguageLoads.delete(language);
				console.error(error);
			}));
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
				const languages = [...element.querySelectorAll("code[class*='language-']")]
					.map((code) => [...code.classList]
						.find((name) => name.startsWith("language-"))?.slice(9))
					.filter(Boolean);
				const missing = [...new Set(languages)]
					.filter((language) => !globalThis.Prism.languages[language]);
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

    const setStatus = (label, state = "") => {
        status.textContent = label;
        status.className = `ai-status ${state}`;
    };

	const updateComposerActions = () => {
		send.hidden = !recognizing && !prompt.value.trim();
	};

    const setBusy = (busy) => {
        send.disabled = false;
        stop.hidden = !busy;
        stop.disabled = false;
        prompt.disabled = false;
		updateComposerActions();
    };

	if (dictate) {
		shell.addEventListener("speechRecognitionStart", (event) => {
			if (event.target !== dictate) return;
			recognizing = true;
			dictate.setAttribute("aria-label", "Stop dictation");
			dictate.setAttribute("title", "Listening… click to stop");
			updateComposerActions();
		});
		shell.addEventListener("speechRecognitionEnd", (event) => {
			if (event.target !== dictate) return;
			recognizing = false;
			dictate.setAttribute("aria-label", "Start dictation");
			dictate.setAttribute("title", "Start dictation");
			updateComposerActions();
		});
		shell.addEventListener("speechRecognitionError", (event) => {
			if (event.target !== dictate) return;
			recognizing = false;
			const error = event.detail?.event?.error || event.detail?.error?.message;
			dictate.setAttribute("aria-label", "Start dictation");
			dictate.setAttribute(
				"title",
				error ? `Dictation failed ${error}` : "Dictation failed"
			);
			updateComposerActions();
		});
	}

    const updateSteerQueue = () => {
        steerQueue.hidden = queuedSteers.size === 0;
        if (queuedSteers.size) steerQueue.open = true;
        steerCount.textContent = `${queuedSteers.size} queued message${queuedSteers.size === 1 ? "" : "s"}`;
    };

    const addQueuedSteer = (queueId, content) => {
        const item = document.createElement("div");
        item.className = "ai-steer-item";
        item.dataset.queueId = queueId;
        const label = document.createElement("span");
        label.textContent = content;
        const steer = document.createElement("button");
        steer.type = "button";
        steer.className = "ai-steer-now";
        steer.textContent = "Steer";
        steer.addEventListener("click", () => {
            const streamId = streams.keys().next().value;
            if (streamId) void submitSteer(queueId, streamId);
        });
        item.append(label, steer);
        queuedSteers.set(queueId, { content, element: item });
        steerItems.append(item);
        updateSteerQueue();
    };

    const clearSteerQueue = () => {
        queuedSteers.clear();
        steerItems.replaceChildren();
        steerQueue.open = false;
        updateSteerQueue();
    };

    const resizePrompt = () => {
        prompt.style.height = "auto";
        prompt.style.height = `${Math.min(prompt.scrollHeight, 170)}px`;
    };

    const appendInlineMarkdown = (target, content) => {
        const inline = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^\s)]+)\)/g;
        let cursor = 0;
        let match;
        while ((match = inline.exec(content))) {
            if (match.index > cursor) {
                target.append(document.createTextNode(content.slice(cursor, match.index)));
            }
            if (match[1]) {
                const code = document.createElement("code");
                code.textContent = match[1];
                target.append(code);
            } else if (match[2]) {
                const strong = document.createElement("strong");
                strong.textContent = match[2];
                target.append(strong);
            } else {
                const href = match[4];
                if (/^(https?:\/\/|\/)/i.test(href)) {
                    const link = document.createElement("a");
                    link.href = href;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.textContent = match[3];
                    target.append(link);
                } else {
                    target.append(document.createTextNode(match[0]));
                }
            }
            cursor = inline.lastIndex;
        }
        if (cursor < content.length) target.append(document.createTextNode(content.slice(cursor)));
    };

    const appendBasicMarkdown = (target, content) => {
        const lines = content.split("\n");
        let list;
        const closeList = () => {
            if (list) target.append(list);
            list = null;
        };

        lines.forEach((line, index) => {
            const heading = line.match(/^(#{1,3})\s+(.+)$/);
            const item = line.match(/^[-*]\s+(.+)$/);
            if (heading) {
                closeList();
                const element = document.createElement(`h${heading[1].length + 1}`);
                appendInlineMarkdown(element, heading[2]);
                target.append(element);
            } else if (item) {
                if (!list) list = document.createElement("ul");
                const element = document.createElement("li");
                appendInlineMarkdown(element, item[1]);
                list.append(element);
            } else {
                closeList();
                appendInlineMarkdown(target, line);
                if (index < lines.length - 1) target.append(document.createElement("br"));
            }
        });
        closeList();
    };

    const appendMarkdown = (target, content) => {
        if (!content) return;
        if (!globalThis.marked?.parse || !globalThis.DOMPurify?.sanitize) {
            appendBasicMarkdown(target, content);
            return;
        }

        const template = document.createElement("template");
        template.innerHTML = globalThis.DOMPurify.sanitize(
            globalThis.marked.parse(content, {
                gfm: true,
                breaks: true
            }), {
                ADD_ATTR: [
                    "storage", "database", "array", "object", "key",
                    "value-type", "filter-key", "filter-query-key",
                    "filter-query-value", "filter-operator", "filter-search",
                    "filter-sort-key", "filter-sort-order", "filter-limit",
                    "filter-index"
                ]
            }
        );

        for (const link of template.content.querySelectorAll("a")) {
            link.target = "_blank";
            link.rel = "noopener noreferrer";
        }
        for (const image of template.content.querySelectorAll("img")) {
            image.loading = "lazy";
        }

        target.append(template.content);
    };

	const initializeCrudLists = (body) => {
		for (const list of body.querySelectorAll(
			"[data-ai-crud-list]:not([data-ai-crud-list-ready])"
		)) {
			const items = list.querySelectorAll("[data-ai-crud-reference]");
			if (!items.length) continue;
			list.setAttribute("data-ai-crud-list-ready", "");
			const listGroup = list.querySelector(":scope > .list-group");
			for (const [index, item] of items.entries()) {
				if (index >= 4) item.classList.add("d-none");
			}
			if (items.length > 4 && !list.querySelector("[data-ai-crud-more]")) {
				const more = document.createElement("button");
				more.type = "button";
				more.className =
					"list-group-item list-group-item-action text-center text-muted";
				more.setAttribute("data-ai-crud-more", "");
				more.setAttribute("aria-expanded", "false");
				more.textContent = `${items.length - 4} more`;
				listGroup.append(more);
			}
			list.querySelector("[data-ai-crud-more]")?.addEventListener("click", (event) => {
				const button = event.currentTarget;
				const expanded = button.getAttribute("aria-expanded") === "true";
				for (const [index, item] of items.entries()) {
					item.classList.toggle("d-none", expanded && index >= 4);
				}
				button.setAttribute("aria-expanded", String(!expanded));
				button.textContent = expanded
					? `${items.length - 4} more`
					: "Show less";
			});

			for (const item of items) {
				const itemButton = item.querySelector("[data-ai-crud-item]");
				if (!itemButton) continue;
				const chevron = document.createElement("i");
				chevron.className = "ai-crud-list-chevron ri-arrow-down-s-line";
				chevron.setAttribute("aria-hidden", "true");
				itemButton.append(chevron);
				itemButton.setAttribute("aria-expanded", "false");
				itemButton.addEventListener("click", async () => {
					let details = item.querySelector(":scope > .ai-crud-list-details");
					if (details) {
						const expanded = itemButton.getAttribute("aria-expanded") === "true";
						details.hidden = expanded;
						itemButton.setAttribute("aria-expanded", String(!expanded));
						chevron.classList.toggle("ri-arrow-down-s-line", expanded);
						chevron.classList.toggle("ri-arrow-up-s-line", !expanded);
						return;
					}
					details = document.createElement("div");
					details.className = "ai-crud-list-details";
					const pre = document.createElement("pre");
					const code = document.createElement("code");
					for (const attribute of [
						"storage", "database", "array", "object", "key", "data-pathname",
						"data-app-path"
					]) {
						if (attribute === "key") {
							code.setAttribute("key", item.dataset.key || "{}");
						} else if (item.hasAttribute(attribute)) {
							code.setAttribute(attribute, item.getAttribute(attribute));
						}
					}
					const appPath = await item.querySelector(".ai-crud-app-path")?.getValue?.();
					if (appPath) code.dataset.appPath = appPath;
					const language = item.dataset.language;
					if (language) code.className = `language-${language}`;
					if (item.dataset.display) code.dataset.display = item.dataset.display;
					if ((item.dataset.key || "{}") === "{}") {
						code.setAttribute("value-type", "object");
					}
					pre.append(code);
					details.append(pre);
					item.append(details);
					itemButton.setAttribute("aria-expanded", "true");
					chevron.classList.replace("ri-arrow-down-s-line", "ri-arrow-up-s-line");
					initializeCrudViews(details);
				});
			}
			if (items.length === 1 && list.dataset.display !== "list") {
				items[0].querySelector("[data-ai-crud-item]")?.click();
			}
		}
	};

	const templateCache = new Map();
	const appCache = new Map();

	const fetchTemplate = async (pathname) => {
		if (!templateCache.has(pathname)) {
			templateCache.set(pathname, fetch(pathname).then((response) => {
				if (!response.ok) {
					throw new Error(`Unable to load ${pathname} (${response.status})`);
				}
				return response.text();
			}).catch((error) => {
				templateCache.delete(pathname);
				throw error;
			}));
		}
		return templateCache.get(pathname);
	};

	const getAppRecord = async (appId) => {
		if (!appId || !window.CoCreate?.crud?.send) return;
		if (!appCache.has(appId)) {
			appCache.set(appId, window.CoCreate.crud.send({
				method: "object.read",
				array: "apps",
				object: appId
			}).then((response) => Array.isArray(response?.object)
				? response.object[0]
				: response?.object
			).catch((error) => {
				appCache.delete(appId);
				throw error;
			}));
		}
		return appCache.get(appId);
	};

	const firstItemValue = (item, key) => {
		const value = item?.[key];
		return Array.isArray(value) ? value[0] : value;
	};

	const createCrudItem = (markup) => {
		const button = document.createElement("button");
		button.type = "button";
		button.className =
			"ai-crud-list-item list-group-item-action d-flex align-items-center width:100%";
		button.setAttribute("data-ai-crud-item", "");
		button.innerHTML = markup || '<div class="d-flex align-items-center gap-2"><span class="avatar-xs rounded-circle position-relative overflow-hidden flex-shrink-0"><span class="avatar-title bg-primary-subtle text-primary"><i class="ri-database-2-line"></i></span></span><span class="flex-grow-1 text-start text-truncate"><span key="name"></span></span></div>';
		return button;
	};

	const createCrudView = async (view) => {
		const shellMarkup = await fetchTemplate("/apps/ai/templates/crud.html");
		const shellTemplate = document.createElement("template");
		shellTemplate.innerHTML = shellMarkup;
		const list = shellTemplate.content.firstElementChild.cloneNode(true);
		if (view.app_id) list.setAttribute("app-id", view.app_id);
		list.dataset.display = view.display || "list";
		const listGroup = list.querySelector(":scope > .list-group");
		const app = await getAppRecord(view.app_id);
		const appPath = app?.path?.replace(/\/$/, "");
		const relativeListPath = app?.templates?.list || "templates/list.html";
		const listPath = relativeListPath.startsWith("/")
			? relativeListPath
			: appPath && `${appPath}/${relativeListPath}`;
		let itemMarkup;
		if (listPath) {
			try {
				itemMarkup = await fetchTemplate(listPath);
			} catch (error) {
				console.error("Unable to load AI CRUD list template:", error);
			}
		}

		for (const item of view.items || []) {
			const form = document.createElement("form");
			form.className = "list-group-item p-0";
			form.setAttribute("data-ai-crud-reference", "");
			form.setAttribute("data-crud-key", "{}");
			form.setAttribute("data-key", item?.key || "{}");
			form.setAttribute("data-language", item?.language || "json");
			form.setAttribute("data-display", view.display || "list");
			form.setAttribute("autocomplete", "off");
			for (const [attribute, value] of Object.entries({
				storage: firstItemValue(item, "$storage"),
				database: firstItemValue(item, "$database"),
				array: firstItemValue(item, "$array"),
				object: item?._id,
				"app-id": view.app_id,
				"data-app-path": appPath
			})) {
				if (value !== undefined && value !== null && value !== "") {
					form.setAttribute(attribute, value);
				}
			}
			form.append(createCrudItem(itemMarkup));
			listGroup.append(form);
		}
		return list;
	};

	const renderStructuredViews = async (body, views = [], { defer = false } = {}) => {
		if (!views.length) return;
		while (
			body.lastChild?.nodeType === Node.TEXT_NODE &&
			!body.lastChild.textContent.trim()
		) {
			body.lastChild.remove();
		}
		const staging = defer ? document.createElement("div") : body;
		for (const view of views) {
			if (view?.type !== "crud") continue;
			try {
				staging.append(await createCrudView(view));
			} catch (error) {
				console.error("Unable to render AI CRUD view:", error);
			}
		}
		if (defer) body.append(...staging.childNodes);
		initializeCrudLists(body);
	};

    const initializeCrudViews = (body) => {
        const initializedReferences = new Set();
        for (const code of body.querySelectorAll("pre > code[array]")) {
            const reference = JSON.stringify([
                code.getAttribute("storage"),
                code.getAttribute("database"),
                code.getAttribute("array"),
                code.getAttribute("object"),
                code.getAttribute("key")
            ]);
            if (initializedReferences.has(reference)) {
                const block = code.closest(".ai-code-block");
                (block || code.parentElement)?.remove();
                continue;
            }
            initializedReferences.add(reference);
            if (code.dataset.aiCrudInitialized === "true") continue;
            code.dataset.aiCrudInitialized = "true";
            const pre = code.parentElement;
            const editor = document.createElement("textarea");
            editor.setAttribute("type", "code");
            editor.setAttribute("lang", [...code.classList]
                .find((name) => name.startsWith("language-"))?.slice(9) || "text");
            for (const name of [
				"storage", "database", "array", "object", "key", "data-pathname",
				"data-app-path", "data-display"
            ]) {
                if (code.hasAttribute(name)) editor.setAttribute(name, code.getAttribute(name));
            }
			if (editor.getAttribute("key") === "{}") {
				editor.setAttribute("value-type", "object");
			}
            code.removeAttribute("array");
            code.removeAttribute("object");
            code.removeAttribute("key");
            const block = document.createElement("section");
            block.className = "ai-code-block ai-crud-code-block";
            const header = document.createElement("header");
            const language = editor.getAttribute("lang");
            const label = document.createElement("span");
            label.textContent = language;
            const actions = document.createElement("div");
            actions.className = "ai-code-actions";
            const edit = document.createElement("button");
            edit.type = "button";
            const setEditAction = (action) => {
                const states = {
                    edit: ["ri-pencil-line", "Edit"],
                    save: ["ri-save-line", "Save"],
                    saving: ["ri-loader-4-line", "Saving"],
                    retry: ["ri-refresh-line", "Retry save"]
                };
                const [icon, label] = states[action];
                edit.dataset.action = action;
                edit.innerHTML = `<i class="${icon}" aria-hidden="true"></i><span>${label}</span>`;
                edit.setAttribute("aria-label", label);
                edit.title = label;
            };
            setEditAction("edit");
			edit.hidden = true;
            let activeForm;
			let activeJsonEditor;
            let collectFormValues;
			let originalFormData;
            let editing = false;
            let originalValue = "";
			let codeDirty = false;
			let jsonDirty = false;
			const isFileSource = editor.getAttribute("array") === "files" &&
				["src", "content"].includes(editor.getAttribute("key"));
			const editTabs = document.createElement("ul");
			editTabs.className =
				"ai-edit-tabs nav nav-tabs nav-tabs-custom nav-success";
			editTabs.setAttribute("role", "tablist");
			const createViewTab = (text) => {
				const item = document.createElement("li");
				item.className = "nav-item";
				const tab = document.createElement("a");
				tab.className = "nav-link text-decoration-none";
				tab.setAttribute("role", "tab");
				tab.setAttribute("aria-selected", "false");
				tab.textContent = text;
				item.append(tab);
				editTabs.append(item);
				return tab;
			};
			const detailsTab = createViewTab("Details");
			const formTab = createViewTab("Form");
			formTab.parentElement.hidden =
				editor.getAttribute("key") !== "{}" && !isFileSource;
			const jsonTab = createViewTab("JSON");
			jsonTab.parentElement.hidden = !isFileSource;
			const codeTab = createViewTab(
				editor.getAttribute("key") === "{}" ? "JSON" : "Code"
			);
			const previewLanguages = new Set(["html", "markup", "markdown", "md"]);
			const previewTab = createViewTab("Preview");
			previewTab.parentElement.hidden =
				!previewLanguages.has(editor.getAttribute("lang"));
            const cancel = document.createElement("button");
            cancel.type = "button";
			cancel.className = "btn btn-light";
            cancel.textContent = "Cancel";
            cancel.setAttribute("aria-label", "Cancel");
            cancel.title = "Cancel";
            cancel.hidden = true;
			cancel.addEventListener("click", async () => {
				if (activeForm && originalFormData !== undefined) {
					await activeForm.setValue(structuredClone(originalFormData));
				} else if (activeJsonEditor) {
					activeJsonEditor.value = originalValue;
					activeJsonEditor.dispatchEvent(new Event("input", { bubbles: true }));
				} else {
					editor.value = originalValue;
					editor.dispatchEvent(new Event("input", { bubbles: true }));
				}
				codeDirty = false;
				jsonDirty = false;
				setEditAction("save");
				edit.hidden = true;
			});
            edit.addEventListener("click", async () => {
                if (activeForm) {
                    activeForm.requestSubmit();
                    return;
                }
				if (activeJsonEditor) {
					const validation = window.CoCreate?.codearea?.validate?.(activeJsonEditor);
					if (validation && !validation.valid) {
						activeJsonEditor.reportValidity?.();
						return;
					}
					edit.disabled = true;
					setEditAction("saving");
					try {
						const object = JSON.parse(activeJsonEditor.value);
						await window.CoCreate.crud.send({
							method: "object.update",
							...(editor.hasAttribute("storage") && {
								storage: editor.getAttribute("storage")
							}),
							...(editor.hasAttribute("database") && {
								database: editor.getAttribute("database")
							}),
							array: editor.getAttribute("array"),
							object
						});
						jsonDirty = false;
						editing = false;
						detailsView.click();
					} catch (error) {
						setEditAction("retry");
						edit.title = error.message;
					} finally {
						edit.disabled = false;
					}
					return;
				}
                if (!editing) {
                    startEdit();
                    return;
                }
                const validation = window.CoCreate?.codearea?.validate?.(editor);
                if (validation && !validation.valid) {
                    editor.reportValidity?.();
                    return;
                }
                edit.disabled = true;
                setEditAction("saving");
                try {
                    await editor.save?.();
					codeDirty = false;
                    editing = false;
                    detailsView.click();
                } catch (error) {
                    setEditAction("retry");
                    edit.title = error.message;
                } finally {
                    edit.disabled = false;
                }
            });
            const copy = document.createElement("button");
            copy.type = "button";
			copy.className = "ai-code-copy";
            copy.innerHTML = '<i class="ri-file-copy-line" aria-hidden="true"></i>';
            copy.setAttribute("aria-label", "Copy");
            copy.title = "Copy";
			copy.hidden = true;
            copy.addEventListener("click", async () => {
				await navigator.clipboard?.writeText(
					activeJsonEditor?.value ?? editor.value
				);
                copy.innerHTML = '<i class="ri-check-line" aria-hidden="true"></i>';
                copy.setAttribute("aria-label", "Copied");
                copy.title = "Copied";
                setTimeout(() => {
                    copy.innerHTML = '<i class="ri-file-copy-line" aria-hidden="true"></i>';
                    copy.setAttribute("aria-label", "Copy");
                    copy.title = "Copy";
                }, 1500);
            });
            const menu = document.createElement("details");
            menu.className = "ai-code-menu";
            menu.setAttribute("aria-close-on", "anywhere");
            const menuTrigger = document.createElement("summary");
            menuTrigger.setAttribute("aria-label", "More code options");
            menuTrigger.setAttribute("aria-expanded", "false");
            menuTrigger.innerHTML = '<i class="ri-more-2-fill" aria-hidden="true"></i>';
            menu.addEventListener("toggle", () => {
                menuTrigger.setAttribute("aria-expanded", String(menu.open));
            });
            const menuOptions = document.createElement("div");
            const view = document.createElement("div");
            view.className = "ai-code-view";
            const detailsPanel = document.createElement("div");
            detailsPanel.className = "ai-code-details";
            detailsPanel.hidden = true;
            const detailsContent = document.createElement("div");
            detailsContent.className = "ai-code-details-content";
            const detailsTitle = document.createElement("strong");
            const detailsPre = document.createElement("pre");
            const detailsCode = document.createElement("code");
            detailsPre.append(detailsCode);
            detailsContent.append(detailsTitle, detailsPre);
            detailsPanel.append(detailsContent);
			let preview;
			const destroyPreview = () => {
				preview?.remove();
				preview = undefined;
				previewTab.classList.remove("active");
				previewTab.setAttribute("aria-selected", "false");
			};
            let activeView = "code";
			const appPath = (editor.dataset.appPath || editor.getAttribute("array"))
				.replace(/^\/apps\//, "")
				.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
				.replaceAll("_", "-")
				.toLowerCase();
			const beginEditing = () => {
				if (editing) return;
				originalValue = editor.value;
				editing = true;
			};
            const showCode = () => {
				beginEditing();
				destroyPreview();
                activeView = "code";
                activeForm = undefined;
				activeJsonEditor = undefined;
                collectFormValues = undefined;
				detailsPanel.querySelector(".ai-crud-json-codearea")?.remove();
                detailsPanel.hidden = true;
                detailsPanel.classList.remove("ai-code-detail-view");
                detailsPanel.classList.remove("ai-app-details-view");
                label.textContent = "Edit";
                codearea.hidden = false;
                setEditAction("save");
				edit.hidden = !codeDirty;
				copy.hidden = false;
				cancel.hidden = false;
                editTabs.hidden = false;
				detailsTab.classList.remove("active");
				detailsTab.setAttribute("aria-selected", "false");
                formTab.classList.remove("active");
                formTab.setAttribute("aria-selected", "false");
				jsonTab.classList.remove("active");
				jsonTab.setAttribute("aria-selected", "false");
                codeTab.classList.add("active");
                codeTab.setAttribute("aria-selected", "true");
                menu.open = false;
                requestAnimationFrame(resizeCodearea);
            };
            const showDetails = (title, value, languageName = "") => {
				destroyPreview();
                activeView = title;
                activeForm = undefined;
				activeJsonEditor = undefined;
                collectFormValues = undefined;
				detailsPanel.querySelector(".ai-crud-json-codearea")?.remove();
                detailsPanel.classList.remove("ai-app-details-view");
                detailsPanel.querySelector(".ai-crud-form")?.remove();
                detailsPanel.querySelector(".ai-crud-configurations")?.remove();
                detailsPanel.querySelector(".ai-crud-details-view")?.remove();
                detailsPanel.classList.add("ai-code-detail-view");
                label.textContent = title;
                codearea.hidden = true;
                setEditAction("edit");
				edit.hidden = true;
				copy.hidden = true;
                cancel.hidden = true;
				editTabs.hidden = false;
                detailsPre.hidden = false;
                detailsTitle.hidden = true;
                detailsCode.className = languageName ? `language-${languageName}` : "";
                detailsCode.textContent = typeof value === "string"
                    ? value
                    : JSON.stringify(value, null, 2);
                detailsPanel.hidden = false;
                menu.open = false;
                highlightCodeBlocks(detailsPanel);
            };
            const showForm = async () => {
				beginEditing();
				destroyPreview();
                activeView = "Form";
				activeJsonEditor = undefined;
                detailsPanel.classList.remove("ai-app-details-view");
				detailsPanel.querySelector(".ai-crud-json-codearea")?.remove();
				let object = {};
				if (!isFileSource) {
					try {
						object = JSON.parse(editor.value);
					} catch {
						showDetails("Form", "The current value is not valid JSON.");
						return;
					}
				}
                if (!object || Array.isArray(object) || typeof object !== "object") {
                    showDetails("Form", "Form view requires a JSON object.");
                    return;
                }
				originalFormData = structuredClone(object);
                detailsPanel.querySelector(".ai-crud-form")?.remove();
                detailsPanel.querySelector(".ai-crud-configurations")?.remove();
                detailsPanel.querySelector(".ai-crud-details-view")?.remove();
                detailsPanel.classList.add("ai-code-detail-view");
                detailsPre.hidden = true;
                detailsTitle.hidden = true;
                label.textContent = "Edit";
                detailsPanel.hidden = false;
                codearea.hidden = true;
                menu.open = false;
                const form = document.createElement("form");
                form.className = "ai-crud-form";
                for (const name of ["storage", "database", "array", "object"]) {
                    if (editor.hasAttribute(name)) {
                        form.setAttribute(name, editor.getAttribute(name));
                    }
                }
                activeForm = form;
                setEditAction("save");
				edit.hidden = true;
				copy.hidden = true;
                cancel.hidden = false;
                editTabs.hidden = false;
				detailsTab.classList.remove("active");
				detailsTab.setAttribute("aria-selected", "false");
                formTab.classList.add("active");
                formTab.setAttribute("aria-selected", "true");
				jsonTab.classList.remove("active");
				jsonTab.setAttribute("aria-selected", "false");
                codeTab.classList.remove("active");
                codeTab.setAttribute("aria-selected", "false");
                const formContent = document.createElement("div");
                formContent.className = "ai-crud-form-content";
				const formObserverId = makeId();
				formContent.setAttribute("data-ai-form-content", formObserverId);
				const stopFormObserver = initAIObserver({
					types: ["addedNodes"],
					selector: `[data-ai-form-content="${formObserverId}"] > *`,
					callback: async () => {
					const nestedForm = formContent.querySelector(":scope > form");
					if (nestedForm) {
                        nestedForm.querySelector(":scope > .card-header")?.remove();
                        nestedForm.querySelector(":scope > .card-footer")?.remove();
                        nestedForm.replaceWith(...nestedForm.childNodes);
					}
					if (!formContent.firstElementChild) return;
					stopFormObserver();
					formContent.removeAttribute("data-ai-form-content");
					await window.CoCreate?.elements?.init?.(form);
					const formValue = await form.getValue?.();
					if (formValue && typeof formValue === "object") {
						originalFormData = structuredClone(formValue);
					}
					}
				});
                form.append(formContent);
                detailsContent.append(form);
				const markFormChanged = () => {
					edit.hidden = false;
				};
				form.addEventListener("input", markFormChanged);
				form.addEventListener("change", markFormChanged);
                formContent.setAttribute(
                    "src",
                    `/apps/${appPath}/form.html?view=${Date.now()}`
                );
                window.CoCreate?.elements?.init?.(form);
                collectFormValues = async () => {
                    const updatedValues = {};
                    for (const control of form.elements) {
                        if (!control.name) continue;
                        if (["object", "array", "json"].includes(
                            control.getAttribute("value-type")
                        ) && control.tagName === "TEXTAREA") {
                            try {
                                JSON.parse(control.value);
                                control.setCustomValidity("");
                            } catch {
                                control.setCustomValidity("Enter valid JSON.");
                                control.reportValidity();
                                return null;
                            }
                        }
                        updatedValues[control.name] = await control.getValue();
                    }
                    return window.CoCreate.utils.dotNotationToObject(
                        updatedValues,
                        structuredClone(object)
                    );
                };
                form.addEventListener("submit", async (event) => {
                    event.preventDefault();
					if (isFileSource) {
						edit.disabled = true;
						setEditAction("saving");
						try {
							await form.save?.();
							editing = false;
							detailsView.click();
						} catch (error) {
							setEditAction("retry");
							edit.title = error.message;
						} finally {
							edit.disabled = false;
						}
						return;
					}
                    const updated = await collectFormValues();
                    if (!updated) return;
                    edit.disabled = true;
                    setEditAction("saving");
                    try {
                        editor.value = JSON.stringify(updated, null, 2);
                        editor.dispatchEvent(new Event("input", { bubbles: true }));
                        await editor.save?.();
                        editing = false;
                        detailsView.click();
                    } catch (error) {
                        setEditAction("retry");
                        edit.title = error.message;
                    } finally {
                        edit.disabled = false;
                        if (edit.dataset.action === "saving") setEditAction("save");
                    }
                });
                detailsPanel.hidden = false;
                menu.open = false;
            };
            const startEdit = async () => {
                if (!editing) {
                    originalValue = editor.value;
                    editing = true;
                }
                if (editor.getAttribute("key") === "{}") await showForm();
                else showCode();
            };
            formTab.addEventListener("click", showForm);
			const showJson = async () => {
				beginEditing();
				destroyPreview();
				activeView = "JSON";
				activeForm = undefined;
				collectFormValues = undefined;
				detailsPanel.querySelector(".ai-crud-form")?.remove();
				detailsPanel.querySelector(".ai-crud-configurations")?.remove();
				detailsPanel.querySelector(".ai-crud-details-view")?.remove();
				detailsPanel.querySelector(".ai-crud-json-codearea")?.remove();
				detailsPre.hidden = true;
				codearea.hidden = true;
				detailsPanel.hidden = false;
				detailsPanel.classList.add("ai-code-detail-view");
				const jsonCodearea = document.createElement("codearea");
				jsonCodearea.className = "ai-crud-codearea ai-crud-json-codearea";
				const jsonEditor = document.createElement("textarea");
				jsonEditor.setAttribute("type", "code");
				jsonEditor.setAttribute("lang", "json");
				for (const name of ["storage", "database", "array", "object"]) {
					if (editor.hasAttribute(name)) {
						jsonEditor.setAttribute(name, editor.getAttribute(name));
					}
				}
				jsonEditor.setAttribute("key", "{}");
				jsonEditor.setAttribute("value-type", "object");
				jsonCodearea.append(jsonEditor);
				detailsContent.append(jsonCodearea);
				activeJsonEditor = jsonEditor;
				jsonDirty = false;
				setEditAction("save");
				edit.hidden = true;
				copy.hidden = false;
                cancel.hidden = false;
				window.CoCreate?.codearea?.initElement?.(jsonEditor);
				window.CoCreate?.elements?.init?.(jsonEditor);
				const resizeJson = () => {
					jsonEditor.style.height = "auto";
					jsonEditor.style.height = `${jsonEditor.scrollHeight}px`;
					jsonCodearea.style.height = `${jsonEditor.scrollHeight}px`;
				};
				jsonEditor.addEventListener("beforeinput", () => {
					jsonDirty = true;
					edit.hidden = false;
				});
				jsonEditor.addEventListener("input", () =>
					requestAnimationFrame(resizeJson)
				);
				requestAnimationFrame(resizeJson);
				label.textContent = "Edit";
				editTabs.hidden = false;
				detailsTab.classList.remove("active");
				detailsTab.setAttribute("aria-selected", "false");
				formTab.classList.remove("active");
				formTab.setAttribute("aria-selected", "false");
				jsonTab.classList.add("active");
				jsonTab.setAttribute("aria-selected", "true");
				codeTab.classList.remove("active");
				codeTab.setAttribute("aria-selected", "false");
			};
            jsonTab.addEventListener("click", showJson);
            codeTab.addEventListener("click", async () => {
				if (!isFileSource && activeForm && collectFormValues) {
                    const updated = await collectFormValues();
                    if (!updated) return;
                    editor.value = JSON.stringify(updated, null, 2);
                    editor.dispatchEvent(new Event("input", { bubbles: true }));
                }
                showCode();
            });
            const detailsView = document.createElement("button");
            detailsView.type = "button";
            detailsView.textContent = "Details";
            detailsView.addEventListener("click", async () => {
                if (editing) {
                    editor.value = originalValue;
                    editor.dispatchEvent(new Event("input", { bubbles: true }));
                    editing = false;
                }
                showDetails("Details", "Loading…");
				detailsTab.classList.add("active");
				detailsTab.setAttribute("aria-selected", "true");
				formTab.classList.remove("active");
				formTab.setAttribute("aria-selected", "false");
				jsonTab.classList.remove("active");
				jsonTab.setAttribute("aria-selected", "false");
				codeTab.classList.remove("active");
				codeTab.setAttribute("aria-selected", "false");
                try {
                    if (activeView !== "Details") return;
                    detailsPre.hidden = true;
                    detailsPanel.classList.add("ai-app-details-view");
                    const details = document.createElement("form");
                    details.className = "ai-crud-details-view";
                    details.addEventListener("submit", (event) => event.preventDefault());
                    const array = editor.getAttribute("array");
                    const object = editor.getAttribute("object");
                    details.setAttribute("array", array);
                    details.setAttribute("object", object);
					const detailsObserverId = makeId();
					details.setAttribute("data-ai-details-content", detailsObserverId);
					const stopDetailsObserver = initAIObserver({
						types: ["addedNodes"],
						selector: `[data-ai-details-content="${detailsObserverId}"] > *`,
						callback: () => {
						const content = details.firstElementChild;
						if (!content) return;
                        content.removeAttribute("state-id");
                        content.setAttribute("array", array);
                        content.setAttribute("object", object);
						stopDetailsObserver();
						details.removeAttribute("data-ai-details-content");
						window.CoCreate?.elements?.init?.(content);
						}
					});
                    detailsContent.append(details);
                    const path = `/apps/${appPath}/details.html`;
                    details.setAttribute("src", `${path}?view=${Date.now()}`);
                    window.CoCreate?.elements?.init?.(details);
                } catch (error) {
                    showDetails("Details", error.message || "Unable to load details view");
                }
            });
			detailsTab.addEventListener("click", () => detailsView.click());
            const download = document.createElement("button");
            download.type = "button";
            download.textContent = "Download";
            download.addEventListener("click", () => {
                const url = URL.createObjectURL(new Blob([editor.value], {
                    type: "text/plain"
                }));
                const link = document.createElement("a");
                link.href = url;
                link.download = `cocreate-ai.${getCodeExtension(language)}`;
                link.click();
                URL.revokeObjectURL(url);
                menu.open = false;
            });
			const remove = document.createElement("button");
			remove.type = "button";
			remove.textContent = "Delete";
			remove.addEventListener("click", async () => {
				menu.open = false;
				if (!window.confirm("Delete this item?")) return;
				remove.disabled = true;
				try {
					await window.CoCreate.crud.send({
						method: "object.delete",
						array: editor.getAttribute("array"),
						object: [{ _id: editor.getAttribute("object") }]
					});
					const item = block.closest("[data-ai-crud-reference]");
					const list = item?.closest("[data-ai-crud-list]");
					item?.remove();
					if (list && !list.querySelector("[data-ai-crud-reference]")) {
						list.remove();
					}
				} catch (error) {
					remove.disabled = false;
					remove.title = error.message || "Unable to delete item";
				}
			});
			menuOptions.append(download, remove);
            menu.append(menuTrigger, menuOptions);
			actions.append(menu);
			header.append(editTabs, actions);
            const codearea = document.createElement("codearea");
            codearea.className = "ai-crud-codearea";
			const footer = document.createElement("footer");
			footer.className = "ai-code-footer";
			footer.hidden = true;
			edit.className = "btn btn-success btn-spinner";
			footer.append(cancel, edit);
			const editObserverId = makeId();
			edit.setAttribute("data-ai-save-action", editObserverId);
			initAIObserver({
				types: ["attributes"],
				attributeFilter: ["hidden"],
				selector: `[data-ai-save-action="${editObserverId}"]`,
				callback: () => {
					footer.hidden = edit.hidden;
					cancel.hidden = edit.hidden;
				}
			});
			previewTab.addEventListener("click", () => {
				if (preview) return;
				const previewLanguage = editor.getAttribute("lang");
				if (!previewLanguages.has(previewLanguage)) return;
				activeView = "Preview";
				activeForm = undefined;
				activeJsonEditor = undefined;
				collectFormValues = undefined;
				detailsPanel.hidden = true;
				preview = document.createElement("div");
				preview.className = "ai-code-preview";
				if (["html", "markup"].includes(previewLanguage)) {
					const frame = document.createElement("iframe");
					frame.setAttribute("sandbox", "allow-same-origin allow-scripts");
					frame.title = "HTML preview";
					frame.addEventListener("load", () => {
						const documentElement = frame.contentDocument?.documentElement;
						if (documentElement) {
							frame.style.height = `${documentElement.scrollHeight}px`;
						}
					});
					frame.srcdoc = editor.value;
					preview.append(frame);
				} else {
					const markdown = document.createElement("div");
					markdown.className = "ai-markdown-preview";
					appendMarkdown(markdown, editor.value);
					preview.append(markdown);
				}
				codearea.hidden = true;
				copy.hidden = true;
				edit.hidden = true;
				view.append(preview);
				for (const tab of [detailsTab, formTab, jsonTab, codeTab]) {
					tab.classList.remove("active");
					tab.setAttribute("aria-selected", "false");
				}
				previewTab.classList.add("active");
				previewTab.setAttribute("aria-selected", "true");
			});
            const resizeCodearea = () => {
                if (codearea.hidden) return;
                editor.style.height = "auto";
				const height = editor.scrollHeight;
                editor.style.height = `${height}px`;
                codearea.style.height = `${height}px`;
            };
            editor.addEventListener("input", () => requestAnimationFrame(resizeCodearea));
			editor.addEventListener("beforeinput", () => {
				codeDirty = true;
				if (activeView === "code") edit.hidden = false;
			});
            pre.replaceWith(block);
            codearea.append(pre, editor);
            view.append(detailsPanel, codearea, copy);
            block.append(header, view, footer);
            window.CoCreate?.elements?.init?.(editor);
			if (editor.dataset.display === "code" || editor.dataset.display === "form") {
				void startEdit();
			} else {
				detailsView.click();
			}
        }
    };

    const getCodeExtension = (language) => ({
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
            const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
            const link = document.createElement("a");
            link.href = url;
            link.download = `cocreate-ai.${getCodeExtension(language)}`;
            link.click();
            URL.revokeObjectURL(url);
            menu.open = false;
        });
        const actions = document.createElement("div");
        actions.className = "ai-code-actions";
        const menu = document.createElement("details");
        menu.className = "ai-code-menu";
        const menuTrigger = document.createElement("summary");
        menuTrigger.setAttribute("aria-label", "Code options");
        menuTrigger.innerHTML = '<i class="ri-more-2-fill" aria-hidden="true"></i>';
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

    const renderMessageContent = (
		body,
		content = "",
		{ initializeCrud = true, views = [], deferViews = false } = {}
	) => {
        body.dataset.content = content;
        body.replaceChildren();

        const codeFence = /```([^\n`]*)\n([\s\S]*?)```/g;
        let cursor = 0;
        let match;
        while ((match = codeFence.exec(content))) {
            appendMarkdown(body, content.slice(cursor, match.index));
            const language = match[1].trim().toLowerCase();
            body.append(
                language === "json"
                    ? createJsonBlock(match[2])
                    : createCodeBlock(language, match[2])
            );
            cursor = codeFence.lastIndex;
        }

        const trailing = content.slice(cursor);
		const pendingFence = trailing.lastIndexOf("```");
		appendMarkdown(body, pendingFence === -1 ? trailing : trailing.slice(0, pendingFence));
		while (
			body.lastChild?.nodeType === Node.TEXT_NODE &&
			!body.lastChild.textContent.trim()
		) {
			body.lastChild.remove();
		}
		while (body.lastElementChild?.tagName === "BR") {
			body.lastElementChild.remove();
		}
		highlightCodeBlocks(body);
		if (initializeCrud) {
			initializeCrudLists(body);
			initializeCrudViews(body);
			void renderStructuredViews(body, views, { defer: deferViews });
		}
	};

    const getCodeLanguage = (filePath = "") => ({
        js: "javascript",
        mjs: "javascript",
        ts: "typescript",
        html: "html",
        css: "css",
        json: "json",
        sh: "bash",
        bash: "bash",
        py: "python",
        php: "php",
        sql: "sql"
    })[filePath.split(".").pop().toLowerCase()] || "";

    const isFileChangeTool = (tool) => {
        const method = tool.input?.method || "";
        return (tool.name === "crud" && tool.input?.array === "files" &&
                /\.(create|update|delete)$/.test(method)) ||
            ["write_virtual_file", "delete_virtual_file", "write_project_file",
                "delete_project_file", "write_local_file", "delete_local_file"]
                .includes(tool.name);
    };

    const fileChangeDetails = (tool) => {
        const change = tool.result?.change;
        const inputObjects = Array.isArray(tool.input?.object)
            ? tool.input.object
            : tool.input?.object ? [tool.input.object] : [];
        if (change) return [change];
        if (tool.name === "crud") {
            const action = tool.input?.method?.split(".")[1] || "change";
            const records = Array.isArray(tool.result?.object)
                ? tool.result.object
                : inputObjects;
            return records.map((record) => ({
                action,
                path: record.pathname || record.path || record.name || record._id,
                before: null,
                after: action === "delete" ? null : record
            }));
        }
        return [{
            action: tool.name.startsWith("delete") ? "delete" : "update",
            path: tool.result?.path || tool.input?.filePath || "File",
            before: null,
            after: tool.input?.content === undefined
                ? null
                : { src: tool.input.content }
        }];
    };

    const createSimpleDiff = (before = "", after = "") => {
        if (before === after) return "No content changes";
        const oldLines = String(before).split("\n");
        const newLines = String(after).split("\n");
        let start = 0;
        while (oldLines[start] === newLines[start] &&
            start < oldLines.length && start < newLines.length) start++;
        let oldEnd = oldLines.length - 1;
        let newEnd = newLines.length - 1;
        while (oldEnd >= start && newEnd >= start &&
            oldLines[oldEnd] === newLines[newEnd]) {
            oldEnd--;
            newEnd--;
        }
        return [
            `@@ line ${start + 1} @@`,
            ...oldLines.slice(start, oldEnd + 1).map((line) => `-${line}`),
            ...newLines.slice(start, newEnd + 1).map((line) => `+${line}`)
        ].join("\n");
    };

    const getDiffStats = (change) => {
        const before = change.before?.src ?? change.before?.content ?? "";
        const after = change.after?.src ?? change.after?.content ?? "";
        const lines = createSimpleDiff(before, after).split("\n");
        return {
            added: lines.filter((line) => line.startsWith("+")).length,
            removed: lines.filter((line) => line.startsWith("-")).length
        };
    };

    const canUndoFileChange = (change) =>
        (change.action === "create" && change.after?.pathname) ||
        (change.action === "update" && change.before?._id) ||
        (change.action === "delete" && change.before);

    const undoFileChanges = async (changes) => {
        const crud = window.CoCreate?.crud;
        if (!crud?.send) throw new Error("CoCreate CRUD is unavailable.");
        for (const change of [...changes].reverse()) {
            if (change.action === "create") {
                await crud.send({
                    method: "object.delete",
                    array: "files",
                    filter: { query: { pathname: change.after.pathname } }
                });
            } else if (change.action === "update") {
                await crud.send({
                    method: "object.update",
                    array: "files",
                    object: [change.before]
                });
            } else if (change.action === "delete") {
                await crud.send({
                    method: "object.create",
                    array: "files",
                    object: [change.before]
                });
            }
        }
    };

    const renderFileChanges = (stream, tool, results) => {
        let card = results.querySelector(".ai-tool-file-changes");
        if (!card) {
            card = document.createElement("section");
            card.className = "ai-tool-result ai-tool-file-changes";
            card.fileChanges = new Map();
            results.append(card);
        }

        card.fileChanges.set(tool.id, {
            status: tool.status,
            changes: fileChangeDetails(tool)
        });
        const entries = [...card.fileChanges.values()];
        const changes = entries.flatMap((entry) => entry.changes);
        const stats = changes.reduce((total, change) => {
            const value = getDiffStats(change);
            total.added += value.added;
            total.removed += value.removed;
            return total;
        }, { added: 0, removed: 0 });
        const running = entries.some((entry) => entry.status === "running");
        const failed = entries.some((entry) => entry.status === "error");
        const reversible = !running && !failed && changes.length &&
            changes.every(canUndoFileChange);

        card.replaceChildren();
        const heading = document.createElement("header");
        heading.className = "ai-file-change-heading";
        const icon = document.createElement("i");
        icon.className = "ri-file-edit-line";
        const copy = document.createElement("div");
        const title = document.createElement("strong");
        title.textContent = running
            ? `Editing ${changes.length} file${changes.length === 1 ? "" : "s"}`
            : `Edited ${changes.length} file${changes.length === 1 ? "" : "s"}`;
        const totals = document.createElement("span");
        totals.className = "ai-file-change-stats";
        totals.innerHTML = `<b>+${stats.added}</b> <em>-${stats.removed}</em>`;
        copy.append(title, totals);
        const actions = document.createElement("div");
        actions.className = "ai-file-change-actions";
        const undo = document.createElement("button");
        undo.type = "button";
        undo.textContent = "Undo ↶";
        undo.disabled = !reversible;
        undo.title = reversible ? "Undo these file changes" : "Original file data is unavailable";
        const review = document.createElement("button");
        review.type = "button";
        review.textContent = "Review";
        actions.append(undo, review);
        heading.append(icon, copy, actions);

        const list = document.createElement("div");
        list.className = "ai-file-change-list";
        for (const change of changes) {
            const row = document.createElement("div");
            row.className = "ai-file-change";
            const pathname = document.createElement("span");
            pathname.textContent = change.path || "File";
            const changeStats = getDiffStats(change);
            const counts = document.createElement("span");
            counts.className = "ai-file-change-stats";
            counts.innerHTML = `<b>+${changeStats.added}</b> <em>-${changeStats.removed}</em>`;
            row.append(pathname, counts);
            list.append(row);
        }

        const reviewPanel = document.createElement("div");
        reviewPanel.className = "ai-file-review";
        reviewPanel.hidden = true;
        for (const change of changes) {
            const before = change.before?.src ?? change.before?.content;
            const after = change.after?.src ?? change.after?.content;
            if (before === undefined && after === undefined) continue;
            const label = document.createElement("strong");
            label.textContent = change.path || "File";
            reviewPanel.append(
                label,
                createCodeBlock("diff", createSimpleDiff(before ?? "", after ?? ""))
            );
        }
        review.addEventListener("click", () => {
            reviewPanel.hidden = !reviewPanel.hidden;
            review.textContent = reviewPanel.hidden ? "Review" : "Close";
        });
        undo.addEventListener("click", async () => {
            undo.disabled = true;
            undo.textContent = "Undoing…";
            try {
                await undoFileChanges(changes);
                undo.textContent = "Undone";
                card.classList.add("undone");
            } catch (error) {
                undo.disabled = false;
                undo.textContent = "Retry undo";
                undo.title = error.message;
            }
        });
		card.append(heading, list, reviewPanel);
		highlightCodeBlocks(reviewPanel);
    };

    const renderToolResult = (stream, tool) => {
        let results = stream.element.querySelector(".ai-tool-results");
        if (!results) {
            results = document.createElement("div");
            results.className = "ai-tool-results";
            stream.element.append(results);
        }

        if (isFileChangeTool(tool)) {
            renderFileChanges(stream, tool, results);
            return;
        }

        let card = results.querySelector(`[data-tool-id="${tool.id}"]`);
        if (!card) {
            card = document.createElement("details");
            card.className = "ai-tool-result";
            card.dataset.toolId = tool.id;
            card.open = tool.status === "error";
            const summary = document.createElement("summary");
            const title = document.createElement("span");
            title.className = "ai-tool-title";
            summary.append(title);
            card.append(summary);
            results.append(card);
        }

        const isCrud = tool.name === "crud";
        const references = Array.isArray(tool.result?.references)
            ? tool.result.references.filter((reference) =>
                reference?.array && reference?.object && reference?.key)
            : [];
        const records = Array.isArray(tool.result?.object)
            ? tool.result.object.filter((record) => record && typeof record === "object")
            : [];
        if (records.length || references.length) card.open = true;
        card.className = `ai-tool-result ${tool.status}`;
        const title = card.querySelector(":scope > summary .ai-tool-title");
        const label = isCrud ? getCrudCardTitle(tool) : tool.name;
        const resultCount = references.length || records.length;
        title.textContent = resultCount
            ? `${label} · ${resultCount} record${resultCount === 1 ? "" : "s"}`
            : `${label} · ${tool.status}`;
        card.querySelector(".ai-tool-records")?.remove();
        card.querySelector(".ai-tool-object-views")?.remove();
        card.querySelector(".ai-tool-file")?.remove();
        card.querySelector(".ai-tool-raw")?.remove();
        card.querySelector(".ai-tool-menu")?.remove();
        const fileContent = typeof tool.result?.content === "string"
            ? tool.result.content
            : typeof tool.result?.src === "string" ? tool.result.src : undefined;
        if (fileContent !== undefined) {
            card.open = true;
            const file = document.createElement("section");
            file.className = "ai-tool-file";
            const name = document.createElement("strong");
            name.textContent = tool.result.path || tool.result.filePath || tool.result.name || "File";
            file.append(name);
            file.append(createCodeBlock(getCodeLanguage(name.textContent), fileContent));
            card.append(file);
        }
        if (records.length) {
            const preview = document.createElement("div");
            preview.className = "ai-tool-records";
            for (const record of records.slice(0, 8)) {
                const recordCard = document.createElement("article");
                recordCard.className = "ai-tool-record";
                const title = document.createElement("strong");
                title.textContent = record.name || record.title || record.subject || record.email || record._id;
                recordCard.append(title);

                const fields = Object.entries(record)
                    .filter(([key, value]) => !["_id", "name", "title", "subject"].includes(key) &&
                        ["string", "number", "boolean"].includes(typeof value))
                    .slice(0, 4);
                for (const [key, value] of fields) {
                    const field = document.createElement("span");
                    field.textContent = `${key.replaceAll("_", " ")}: ${value}`;
                    recordCard.append(field);
                }
                preview.append(recordCard);
            }
            card.append(preview);
        }
        if (references.length) {
            const views = document.createElement("div");
            views.className = "ai-tool-object-views";
            card.append(views);
            for (const reference of references.slice(0, 8)) {
                const language = reference.key === "{}"
                    ? "json"
                    : getCodeLanguage(reference.path || reference.name || "");
                const block = createCodeBlock(language, "Loading…");
                const label = block.querySelector("header > span");
                label.textContent = reference.path || reference.name || reference.object;
                const code = block.querySelector("code");
                for (const attribute of ["storage", "database", "array", "object", "key"]) {
                    if (reference[attribute] !== undefined) {
                        code.setAttribute(attribute, reference[attribute]);
                    }
                }
                code.setAttribute("value-type", "text");
                code.setValue = (value) => {
                    code.textContent = reference.key === "{}"
                        ? JSON.stringify(value, null, 2)
                        : String(value ?? "");
                    highlightCodeBlocks(block);
                };
                views.append(block);
                window.CoCreate?.elements?.init?.(code);
            }
        }
        if (tool.status !== "running") {
            const raw = document.createElement("details");
            raw.className = "ai-tool-raw";
            const rawSummary = document.createElement("summary");
            rawSummary.textContent = "Raw response";
            const pre = document.createElement("pre");
            const code = document.createElement("code");
            code.textContent = JSON.stringify(
                tool.status === "error" ? { error: tool.error } : tool.result,
                null,
                2
            );
            pre.append(code);
            raw.append(rawSummary, pre);
            if (isCrud) {
                raw.hidden = true;
                raw.addEventListener("toggle", () => {
                    if (!raw.open) raw.hidden = true;
                });
            }
            card.append(raw);
            if (isCrud) addCrudMenu(card, raw, tool);
        }
    };

    const renderCredentialCard = (stream, credential) => {
        let card = stream.element.querySelector(".ai-credential-card");
        if (card) return card;

        card = document.createElement("form");
        card.className = "ai-credential-card";
        card.addEventListener("submit", (event) => event.preventDefault());
        card.setAttribute("array", credential.array);
        card.setAttribute("object", credential.object);
        const copy = document.createElement("div");
        copy.className = "ai-credential-copy";
        const title = document.createElement("strong");
        const providerName = credential.name.charAt(0).toUpperCase() + credential.name.slice(1);
        title.textContent = `Connect ${providerName}`;
        const description = document.createElement("span");
        description.textContent = `Enter your ${providerName} API key to continue. It saves securely to the integration and is never sent through the chat.`;
        copy.append(title, description);

        const input = document.createElement("input");
        input.type = "password";
        input.name = credential.key;
        input.setAttribute("array", credential.array);
        input.setAttribute("object", credential.object);
        input.setAttribute("key", credential.key);
        input.placeholder = "Paste API key";
        input.autocomplete = "off";
        input.required = true;
        input.setAttribute("aria-label", credential.label);

        const save = document.createElement("button");
        save.type = "button";
        save.setAttribute("actions", "save");
        save.textContent = "Save key";

        card.append(copy, input, save);
        save.addEventListener("saved", () => {
            input.value = "";
            card.remove();
            setStatus("Credential saved", "connected");
            const continueSetup = () => submitPrompt(
                `The ${providerName} API credential was saved successfully. Resume the pending integration setup.`,
                {
                    display: false,
                    persist: false,
                    signal: "credential.saved"
                }
            );
            if (streams.has(stream.streamId)) {
                stream.onComplete = continueSetup;
            } else {
                void continueSetup();
            }
        });
        stream.element.append(card);
        window.CoCreate?.elements?.init?.(input);
        return card;
    };

    const getCrudCardTitle = (tool) => {
        const method = tool.input?.method || "";
        const action = method.split(".").pop();
        const labels = {
            create: "Create",
            read: "Read",
            update: "Update",
            delete: "Delete"
        };
        const target = String(tool.input?.array || method.split(".")[0] || "data")
            .replaceAll(/[-_]+/g, " ");
        return `${labels[action] || "CRUD"} ${target}`;
    };

    const addCrudMenu = (card, raw, tool) => {
        card.querySelector(".ai-tool-menu")?.remove();
        const menu = document.createElement("details");
        menu.className = "ai-tool-menu";
        const trigger = document.createElement("summary");
        trigger.setAttribute("aria-label", "More options");
        trigger.innerHTML = '<i class="ri-more-2-fill" aria-hidden="true"></i>';
        const options = document.createElement("div");

        const rawButton = document.createElement("button");
        rawButton.type = "button";
        rawButton.textContent = "Raw response";
        rawButton.addEventListener("click", () => {
            card.open = true;
            raw.hidden = false;
            raw.open = true;
            menu.open = false;
        });

        const content = JSON.stringify(
            tool.status === "error" ? { error: tool.error } : tool.result,
            null,
            2
        );
        const copy = document.createElement("button");
        copy.type = "button";
        copy.textContent = "Copy response";
        copy.addEventListener("click", async () => {
            await navigator.clipboard?.writeText(content);
            menu.open = false;
        });

        const download = document.createElement("button");
        download.type = "button";
        download.textContent = "Download JSON";
        download.addEventListener("click", () => {
            const url = URL.createObjectURL(new Blob([content], { type: "application/json" }));
            const link = document.createElement("a");
            link.href = url;
            link.download = `${tool.input?.array || "crud-response"}.json`;
            link.click();
            URL.revokeObjectURL(url);
            menu.open = false;
        });

        options.append(rawButton, copy, download);
        menu.append(trigger, options);
        card.append(menu);
    };

    const updateModels = () => {
        if (!models[provider.value]) provider.value = "openai";
        if (!models[provider.value].includes(model.value)) {
            model.value = models[provider.value][0];
        }

        modelValue.textContent = `${provider.value} · ${model.value}`;
        modelOptions.replaceChildren(
            ...Object.entries(models).flatMap(([providerName, providerModels]) => {
                const label = document.createElement("span");
                label.className = "ai-model-provider";
                label.textContent = providerName;

                const options = providerModels.map((modelName) => {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.className = "ai-model-option";
                    button.textContent = modelName;
                    button.setAttribute("role", "option");
                    button.setAttribute(
                        "aria-selected",
                        String(providerName === provider.value && modelName === model.value)
                    );
                    button.addEventListener("click", () => {
                        provider.value = providerName;
                        model.value = modelName;
                        updateModels();
                    });
                    return button;
                });

                return [label, ...options];
            })
        );
    };

    const addMessageActions = (element, record) => {
		if (!record?._id) return;
		const actions = document.createElement("div");
		actions.className = "ai-message-actions";
		const action = (icon, label, callback) => {
			const button = document.createElement("button");
			button.type = "button";
			button.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
			button.setAttribute("aria-label", label);
			button.title = label;
			button.addEventListener("click", callback);
			actions.append(button);
		};
		action("ri-file-copy-line", "Copy", async () => {
			await navigator.clipboard?.writeText(record.content || "");
		});
		if (record.role === "user") {
			action("ri-pencil-line", "Edit", () => {
				editingMessage = record;
				prompt.value = record.content || "";
				resizePrompt();
				updateComposerActions();
				prompt.focus();
			});
		} else {
			action("ri-restart-line", "Retry", () => {
				const parent = messageRecords.get(String(record.parent_id));
				if (!parent?.content) return;
				void submitPrompt(parent.content, {
					display: false,
					persist: false,
					userMessageId: parent._id,
					parentId: parent.parent_id,
					contextBeforeId: parent.parent_id,
					onComplete: reloadActiveConversation
				});
			});
		}
		const siblings = [...messageRecords.values()]
			.filter((message) =>
				message.role === record.role &&
				String(message.parent_id || "") === String(record.parent_id || "")
			)
			.sort((a, b) => messageTime(a) - messageTime(b));
		if (siblings.length > 1) {
			const index = siblings.findIndex((message) => String(message._id) === String(record._id));
			const versions = document.createElement("div");
			versions.className = "ai-message-versions";
			const previous = document.createElement("button");
			previous.type = "button";
			previous.innerHTML = '<i class="ri-arrow-left-s-line" aria-hidden="true"></i>';
			previous.setAttribute("aria-label", "Previous version");
			previous.disabled = index <= 0;
			previous.addEventListener("click", () => void renderActiveBranch(siblings[index - 1]));
			const count = document.createElement("span");
			count.textContent = `${index + 1} of ${siblings.length}`;
			const next = document.createElement("button");
			next.type = "button";
			next.innerHTML = '<i class="ri-arrow-right-s-line" aria-hidden="true"></i>';
			next.setAttribute("aria-label", "Next version");
			next.disabled = index >= siblings.length - 1;
			next.addEventListener("click", () => void renderActiveBranch(siblings[index + 1]));
			versions.append(previous, count, next);
			element.append(versions);
		}
		action("ri-delete-bin-line", "Delete", async () => {
			if (!window.confirm("Delete this message and its replies?")) return;
			const ids = new Set([String(record._id)]);
			let changed = true;
			while (changed) {
				changed = false;
				for (const message of messageRecords.values()) {
					if (message.parent_id && ids.has(String(message.parent_id)) &&
						!ids.has(String(message._id))) {
						ids.add(String(message._id));
						changed = true;
					}
				}
			}
			await socket.send({
				method: "object.delete",
				array: "ai-messages",
				object: [...ids].map((_id) => ({ _id }))
			});
			await reloadActiveConversation();
		});
		element.append(actions);
	};

    const addMessage = (role, content = "", views = [], record = {}) => {
        shell.querySelector(".ai-empty")?.remove();
        const element = document.createElement("article");
        element.className = `ai-message ${role}`;
		if (record._id) element.dataset.messageId = record._id;
		if (record.parent_id) element.dataset.parentId = record.parent_id;
        const body = document.createElement("div");
        body.className = "ai-message-content";
		renderMessageContent(body, content, { views });
        element.append(body);
		addMessageActions(element, { ...record, role, content });
        messages.append(element);
        scrollDown();
        return { element, body };
    };

	const reloadActiveConversation = async () => {
		const button = threadList.querySelector(
			`.ai-thread[data-conversation-id="${CSS.escape(conversationId || "")}"]`
		);
		if (button) await loadConversation(button);
	};

    const getConversationContext = (throughId) => {
		const elements = Array.from(messages.querySelectorAll(".ai-message"));
		const end = throughId
			? elements.findIndex((element) => element.dataset.messageId === String(throughId)) + 1
			: elements.length;
		return elements.slice(0, end || 0)
            .map((element) => ({
                role: element.classList.contains("user") ? "user" : "assistant",
                content: element.querySelector(".ai-message-content")?.dataset.content || ""
            }))
            .filter((message) => message.content)
            .slice(-12);
	};

    const activateThread = (id) => {
        for (const item of threadList.querySelectorAll(".ai-thread")) {
            item.classList.toggle(
                "active",
                item.dataset.conversationId === id
            );
        }
    };

	const setConversationState = (id = "") => {
		if (shell.getAttribute("conversation-id") === id) return;
		const stateAction = document.createElement("button");
		stateAction.type = "button";
		stateAction.hidden = true;
		stateAction.setAttribute("state-to", "aiChat");
		stateAction.setAttribute("state.conversation-id", id);
		document.body.appendChild(stateAction);
		stateAction.click();
		stateAction.remove();
	};

    const readObjects = async (array, filter) => {
        if (!socket?.send) throw new Error("CoCreate socket is unavailable.");
        const data = await socket.send({
            method: "object.read",
            array,
            object: [],
            filter
        });
        const objects = data?.object || data?.data || [];
        return Array.isArray(objects) ? objects : [objects];
    };

    const unwrapObject = (object) => {
        const nested = object?.object;
        return Array.isArray(nested) ? nested[0] || object : nested || object;
    };

	const readConversationMessages = async (id, index = 0) => {
        const createFilter = (nested = false) => {
            const prefix = nested ? "object." : "";
            return {
                query: {
                    [`${prefix}conversation_id`]: id
                },
                sort: [{ key: `${prefix}created.on`, direction: "desc" }],
				index,
				limit: messageHistoryPageSize
            };
        };

		let history = await readObjects(
			"ai-messages",
			createFilter(conversationMessagesNested)
		);
		if (!history.length && index === 0 && !conversationMessagesNested) {
            history = await readObjects("ai-messages", createFilter(true));
			conversationMessagesNested = history.length > 0;
        }

        return history.filter((item) => {
            const message = unwrapObject(item);
            return String(message.conversation_id) === String(id);
        });
    };

	const mergeConversationMessages = (history) => {
		for (const item of history) {
			const message = unwrapObject(item);
			if (message?._id) messageRecords.set(String(message._id), message);
		}
		const ordered = [...messageRecords.values()]
			.sort((a, b) => messageTime(a) - messageTime(b));
		let previousId;
		for (const message of ordered) {
			if (!message.parent_id && previousId) message.parent_id = previousId;
			previousId = message._id;
		}
	};

	const getActiveBranchLeaf = () => {
		if (activeBranchLeafId && messageRecords.has(activeBranchLeafId)) {
			return messageRecords.get(activeBranchLeafId);
		}
		const parentIds = new Set(
			[...messageRecords.values()].map((message) => String(message.parent_id || ""))
		);
		return [...messageRecords.values()]
			.filter((message) => !parentIds.has(String(message._id)))
			.sort((a, b) => messageTime(a) - messageTime(b))
			.at(-1);
	};

	const loadOlderConversationMessages = async () => {
		if (!conversationId || messageHistoryLoading || messageHistoryExhausted) return;
		messageHistoryLoading = true;
		const scrollElement =
			messageScroll.querySelector(".simplebar-content-wrapper") || messageScroll;
		const previousHeight = scrollElement.scrollHeight;
		const previousTop = scrollElement.scrollTop;
		const requestedIndex = Math.max(messageRecords.size, messageHistoryOffset);
		try {
			const history = await readConversationMessages(conversationId, requestedIndex);
			messageHistoryExhausted = history.length < messageHistoryPageSize;
			mergeConversationMessages(history);
			messageHistoryOffset = Math.max(
				messageRecords.size,
				requestedIndex + history.length
			);
			const leaf = getActiveBranchLeaf();
			if (leaf) await renderActiveBranch(leaf);
			const addedHeight = scrollElement.scrollHeight - previousHeight;
			scrollElement.scrollTop = previousTop + Math.max(0, addedHeight);
		} catch (error) {
			setStatus(error.message || "History failed", "error");
		} finally {
			messageHistoryLoading = false;
		}
	};

	const historyScrollElements = new WeakSet();
	const observeHistoryScroll = (element) => {
		if (!element || historyScrollElements.has(element)) return;
		historyScrollElements.add(element);
		element.addEventListener("scroll", () => {
			if (element.scrollTop <= 80) void loadOlderConversationMessages();
		}, { passive: true });
	};
	observeHistoryScroll(messageScroll);
	observeHistoryScroll(messageScroll.querySelector(".simplebar-content-wrapper"));
	initAIObserver({
		types: ["addedNodes"],
		selector: ".simplebar-content-wrapper",
		callback: (mutation) => {
			if (messageScroll.contains(mutation.target)) observeHistoryScroll(mutation.target);
		}
	});

    const loadConversation = async (button) => {
        const id = button.dataset.conversationId;
        if (!id) return;
        const loadId = (conversationLoadId = makeId());
        conversationId = id;
        activateThread(id);
        if (button.dataset.provider && models[button.dataset.provider]) {
            provider.value = button.dataset.provider;
        }
        if (button.dataset.model) model.value = button.dataset.model;
        updateModels();
        messages.replaceChildren();
		messageRecords.clear();
		messageHistoryExhausted = false;
		messageHistoryLoading = false;
		messageHistoryOffset = 0;
		conversationMessagesNested = false;
		activeBranchLeafId = undefined;
        setStatus("Loading conversation…", "connected");

        try {
			const history = await readConversationMessages(id);
            if (conversationLoadId !== loadId) return;
			messageHistoryExhausted = history.length < messageHistoryPageSize;
			mergeConversationMessages(history);
			messageHistoryOffset = messageRecords.size;
			if (messageRecords.size) {
				await renderActiveBranch(getActiveBranchLeaf());
			}
            if (!history.length) {
                addMessage("assistant", "This conversation has no saved messages.");
            }
            setStatus("Connected", "connected");
            prompt.focus();
        } catch (error) {
            if (conversationLoadId !== loadId) return;
            addMessage("assistant", error.message).element.classList.add("error");
            setStatus("History failed", "error");
        }
    };

    const finishStream = (stream, data) => {
        stream.element.classList.remove("pending");
        if (data.ai.status === "complete") {
            stream.content = data.ai.content ?? stream.content;
			renderMessageContent(stream.body, stream.content, {
				views: data.ai.views || [],
				deferViews: true
			});
            conversationId = data.ai.conversation_id || conversationId;
			setConversationState(conversationId);
            activateThread(conversationId);
            setStatus("Connected", "connected");
			if (data.ai.user_message_id && stream.userMessage) {
				const userRecord = {
					_id: data.ai.user_message_id,
					parent_id: stream.parentId,
					role: "user",
					content: stream.prompt
				};
				stream.userMessage.element.dataset.messageId = userRecord._id;
				if (userRecord.parent_id) {
					stream.userMessage.element.dataset.parentId = userRecord.parent_id;
				}
				messageRecords.set(String(userRecord._id), userRecord);
				addMessageActions(stream.userMessage.element, userRecord);
			}
			if (data.ai.message_id) {
				const assistantRecord = {
					_id: data.ai.message_id,
					parent_id: data.ai.parent_id,
					role: "assistant",
					content: stream.content,
					views: data.ai.views || []
				};
				stream.element.dataset.messageId = assistantRecord._id;
				if (assistantRecord.parent_id) {
					stream.element.dataset.parentId = assistantRecord.parent_id;
				}
				messageRecords.set(String(assistantRecord._id), assistantRecord);
				addMessageActions(stream.element, assistantRecord);
			}
        } else if (data.ai.status === "stopped") {
            renderMessageContent(stream.body, stream.content || "Generation stopped.");
            setStatus("Stopped", "connected");
        } else if (data.ai.status === "error") {
            stream.element.classList.add("error");
            renderMessageContent(stream.body, data.ai.message || "AI request failed.");
            setStatus("Request failed", "error");
        }
        const onComplete = stream.onComplete;
        streams.delete(data.stream_id);
        setBusy(false);
        if (onComplete) {
            void onComplete();
        }
        const nextQueued = queuedSteers.entries().next().value;
        if (nextQueued) {
            const [queueId, queued] = nextQueued;
            queued.element.remove();
            queuedSteers.delete(queueId);
            updateSteerQueue();
            queueMicrotask(() => void submitPrompt(queued.content));
        } else if (!onComplete) {
            prompt.focus();
        }
    };

    const renderStream = (stream) => {
        if (stream.renderFrame) return;
        const renderNext = () => {
            const remaining = stream.content.length - stream.visibleLength;
            if (remaining > 0) {
                const step = Math.min(12, Math.max(2, Math.ceil(remaining / 40)));
                stream.visibleLength += Math.min(step, remaining);
                renderMessageContent(
                    stream.body,
                    stream.content.slice(0, stream.visibleLength),
                    { initializeCrud: false }
                );
                scrollDown();
            }

            if (stream.visibleLength < stream.content.length) {
                stream.renderFrame = requestAnimationFrame(renderNext);
                return;
            }

            stream.renderFrame = null;
            if (stream.terminal) {
                const terminal = stream.terminal;
                stream.terminal = null;
                finishStream(stream, terminal);
            }
        };
        stream.renderFrame = requestAnimationFrame(renderNext);
    };

    const onChat = (data = {}) => {
        const stream = streams.get(data.stream_id);
        if (!stream || !data.ai) return;
        if (data.ai.status === "queued") {
            setStatus("Instruction sent", "connected");
            return;
        }
        if (data.ai.status === "steer-unavailable") {
            const item = queuedSteers.get(data.ai.queue_id);
            item?.element.remove();
            queuedSteers.delete(data.ai.queue_id);
            updateSteerQueue();
            setStatus(data.ai.message || "Session finished", "connected");
            return;
        }
        if (data.ai.status === "steer-error") {
            const item = queuedSteers.get(data.ai.queue_id);
            item?.element.remove();
            queuedSteers.delete(data.ai.queue_id);
            updateSteerQueue();
            setStatus(data.ai.message || "Instruction could not be queued", "error");
            return;
        }
        if (data.ai.status === "tool" && data.ai.tool) {
            renderToolResult(stream, data.ai.tool);
            return;
        }
        if (data.ai.status === "credentials" && data.ai.credential) {
            stream.element.classList.remove("pending");
            conversationId = data.ai.conversation_id || conversationId;
			setConversationState(conversationId);
            activateThread(conversationId);
            renderCredentialCard(stream, data.ai.credential);
            setStatus("API key required", "error");
            return;
        }

        if (data.ai.status === "streaming") {
            stream.content += data.ai.delta || "";
            renderStream(stream);
            return;
        }

        if (data.ai.status === "progress") {
            renderMessageContent(stream.body, data.ai.message || "Working…");
            setStatus(data.ai.message || "Working…", "connected");
            return;
        }

        if (data.ai.status === "complete") {
            stream.content = data.ai.content || stream.content;
            stream.visibleLength = Math.min(stream.visibleLength, stream.content.length);
            stream.terminal = data;
            renderStream(stream);
            return;
        }
        if (stream.renderFrame) cancelAnimationFrame(stream.renderFrame);
        stream.renderFrame = null;
        finishStream(stream, data);
    };

    const connect = () => {
		const candidate = window.CoCreate?.socket;
		if (!candidate?.send || !candidate?.listen) {
			setStatus("Connecting");
			return false;
		}
		socket = candidate;
		if (listeningSocket !== candidate) {
			candidate.listen("ai.chat", onChat);
			listeningSocket = candidate;
		}
		send.disabled = false;
		setStatus(candidate.connected ? "Connected" : "Connecting", candidate.connected ? "connected" : "");
		return true;
    };

    updateModels();

	initAIObserver({
		types: ["attributes"],
		attributeFilter: ["class"],
		selector: ".ai-sidebar",
		callback: (mutation) => {
			if (mutation.target !== sidebar || !sidebar.classList.contains("show")) return;
			requestAnimationFrame(() => {
				globalThis.SimpleBar?.instances?.get(threadScroll)?.recalculate();
			});
		}
	});

    const submitPrompt = async (
        message,
        {
			display = true,
			persist = true,
			signal,
			parentId,
			userMessageId,
			contextBeforeId,
			onComplete
		} = {}
    ) => {
        const text = message.trim();
        if (!text || send.disabled || !socket) return;

        const streamId = makeId();
		const context = { messages: getConversationContext(contextBeforeId) };
		const effectiveParentId = parentId ||
			[...messages.querySelectorAll(".ai-message[data-message-id]")]
				.at(-1)?.dataset.messageId;
		const userMessage = display ? addMessage("user", text) : undefined;
        const assistant = addMessage("assistant");
        assistant.element.classList.add("pending");
        streams.set(streamId, {
            ...assistant,
            streamId,
            content: "",
            visibleLength: 0,
            terminal: null,
			prompt: text,
			onComplete,
			userMessage,
			parentId: effectiveParentId
        });
        if (display && prompt.value.trim() === text) prompt.value = "";
        resizePrompt();
		updateComposerActions();
        setBusy(true);
        setStatus("Sending…", "connected");

        try {
            await socket.send({
                method: "ai.chat",
                uuid: streamId,
                ai: {
                    prompt: text,
                    persist,
					...(effectiveParentId && { parent_id: effectiveParentId }),
					...(userMessageId && { user_message_id: userMessageId }),
                    ...(signal && { signal }),
                    conversation_id: conversationId,
                    provider: provider.value,
                    model: model.value,
                    context
                }
            });
        } catch (error) {
            onChat({
                stream_id: streamId,
                ai: { status: "error", message: error.message }
            });
        }
    };

    const submitSteer = async (queueId, streamId) => {
        const queued = queuedSteers.get(queueId);
        const text = queued?.content.trim();
        if (!text || !streamId || !socket) return;
        queued.element.remove();
        queuedSteers.delete(queueId);
        updateSteerQueue();
        const userMessage = addMessage("user", text);
        const activeStream = streams.get(streamId);
        if (activeStream?.element) activeStream.element.before(userMessage.element);
        setStatus("Steering…", "connected");

        try {
            await socket.send({
                method: "ai.steer",
                uuid: queueId,
                stream_id: streamId,
                ai: {
                    stream_id: streamId,
                    queue_id: queueId,
                    prompt: text
                }
            });
        } catch (error) {
            setStatus(error.message, "error");
        }
    };

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const streamId = streams.keys().next().value;
        if (streamId) {
            const text = prompt.value.trim();
            if (!text) return;
            addQueuedSteer(makeId(), text);
            prompt.value = "";
            resizePrompt();
			updateComposerActions();
            setStatus("Message queued", "connected");
        } else {
			const edit = editingMessage;
			editingMessage = undefined;
			void submitPrompt(prompt.value, edit ? {
				parentId: edit.parent_id,
				contextBeforeId: edit.parent_id,
				onComplete: reloadActiveConversation
			} : {});
        }
    });

    stop.addEventListener("click", async () => {
        const streamId = streams.keys().next().value;
        if (!streamId || !socket) return;
        stop.disabled = true;
        setStatus("Stopping…", "connected");
        try {
            await socket.send({
                method: "ai.stop",
                stream_id: streamId,
                ai: { stream_id: streamId }
            });
        } catch (error) {
            stop.disabled = false;
            setStatus(error.message, "error");
        }
    });

    prompt.addEventListener("input", () => {
		resizePrompt();
		updateComposerActions();
	});
    threadList.addEventListener("click", (event) => {
        const button = event.target.closest(".ai-thread[data-conversation-id]");
        if (!button) return;
        loadConversation(button);
        if (getComputedStyle(sidebar).position === "absolute") {
            sidebar.classList.remove("show");
            sidebar.setAttribute("aria-hidden", "true");
            sidebarToggle?.setAttribute("aria-expanded", "false");
            sidebarBackdrop?.setAttribute("aria-expanded", "false");
        }
    });
	const restoreConversation = () => {
		const id = shell.getAttribute("conversation-id");
		if (!socket || !id || conversationId === id) {
			return;
		}
		const button = Array.from(
			threadList.querySelectorAll(".ai-thread[data-conversation-id]")
		).find((item) => item.dataset.conversationId === id);
		if (button) void loadConversation(button);
	};
	initAIObserver({
			types: ["attributes"],
			attributeFilter: ["conversation-id"],
			selector: "[data-ai-chat]",
			callback: (mutation) => {
				if (mutation.target === shell) restoreConversation();
			}
	});
	initAIObserver({
			types: ["addedNodes"],
			selector: ".ai-thread[data-conversation-id]",
			callback: (mutation) => {
				if (!threadList.contains(mutation.target)) return;
				if (conversationId) activateThread(conversationId);
				restoreConversation();
			}
	});
	initAIObserver({
		types: ["attributes"],
		attributeFilter: ["aria-hidden"],
		selector: "#ai-chat-panel",
		callback: (mutation) => {
			if (
				mutation.target.id === "ai-chat-panel" &&
				mutation.target.getAttribute("aria-hidden") === "false"
			) requestAnimationFrame(enforceCompactDock);
		}
	});
	initAIObserver({
		types: ["removedNodes"],
		selector: "[data-ai-chat]",
		callback: (mutation) => {
			if (mutation.target !== shell || mutation.target.isConnected) return;
			compactDockQuery.removeEventListener("change", enforceCompactDock);
			clearTimeout(socketRetryTimer);
			document.removeEventListener("socketLoaded", retrySocketConnection);
			window.removeEventListener("online", retrySocketConnection);
			window.removeEventListener("focus", retrySocketConnection);
			for (const name of [...aiObserverNames]) {
				globalThis.CoCreate?.observer?.uninit(name);
			}
				aiObserverNames.clear();
			}
	});
    prompt.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    shell.querySelector(".ai-new-chat").addEventListener("click", () => {
        conversationLoadId = undefined;
        conversationId = undefined;
		setConversationState();
        messages.replaceChildren(emptyView.cloneNode(true));
        for (const item of threadList.querySelectorAll(".ai-thread")) {
            item.classList.remove("active");
        }
        prompt.focus();
    });

	retrySocketConnection = () => {
		clearTimeout(socketRetryTimer);
		const available = connect();
		if (available && !conversationRestoreStarted) {
			conversationRestoreStarted = true;
			restoreConversation();
		}
		if (socket?.connected) {
			socketRetryDelay = 250;
			return;
		}
		socketRetryTimer = setTimeout(
			retrySocketConnection,
			socketRetryDelay
		);
		socketRetryDelay = Math.min(socketRetryDelay * 2, 5000);
	};
	document.addEventListener("socketLoaded", retrySocketConnection);
	window.addEventListener("online", retrySocketConnection);
	window.addEventListener("focus", retrySocketConnection);
	retrySocketConnection();
})();
