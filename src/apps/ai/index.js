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
    const send = shell.querySelector(".ai-send");
    const stop = shell.querySelector(".ai-stop");
    const provider = shell.querySelector(".ai-provider");
    const model = shell.querySelector(".ai-model");
    const modelValue = shell.querySelector(".ai-model-value");
    const modelOptions = shell.querySelector(".ai-model-options");
    const status = shell.querySelector(".ai-status");
	const panel = shell.closest("#ai-chat-panel");
	const panelRefresh = panel?.querySelector(".ai-chat-panel-refresh");
	const threadList = shell.querySelector(".ai-thread-list");
	const sidebar = shell.querySelector(".ai-sidebar");
	const threadScroll = shell.querySelector(".ai-thread-scroll");
	const sidebarToggle = shell.querySelector(".ai-sidebar-toggle");
	const sidebarBackdrop = shell.querySelector(".ai-sidebar-backdrop");
	const streams = new Map();
	const highlightTimers = new WeakMap();
	let socket;
	const menuCloseRoot = document;
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
	if (panelRefresh) {
		panelRefresh.onclick = () => {
			const content = panel.querySelector(".ai-chat-panel-content");
			if (!content) return;
			content.removeAttribute("src");
			setTimeout(() => {
				content.setAttribute("src", "/apps/ai/index.html");
			}, 500);
		};
	}
    let conversationId;
    let conversationLoadId;

    const makeId = () =>
        crypto.randomUUID?.() ||
        `ai-${Date.now()}-${Math.random().toString(16).slice(2)}`;

	const scrollDown = () => {
		const scrollElement =
			messageScroll.querySelector(".simplebar-content-wrapper") ||
			messageScroll;
		scrollElement.scrollTop = scrollElement.scrollHeight;
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

    const setBusy = (busy) => {
        send.disabled = busy;
        send.hidden = busy;
        stop.hidden = !busy;
        stop.disabled = false;
        prompt.disabled = busy;
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
                "storage", "database", "array", "object", "key", "data-pathname"
            ]) {
                if (code.hasAttribute(name)) editor.setAttribute(name, code.getAttribute(name));
            }
            editor.setAttribute(
                "value-type",
                editor.getAttribute("key") === "{}" ? "object" : "text"
            );
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
                edit.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
                edit.setAttribute("aria-label", label);
                edit.title = label;
            };
            setEditAction("edit");
            let activeForm;
            let collectFormValues;
            let editing = false;
            let originalValue = "";
            const editTabs = document.createElement("div");
            editTabs.className = "ai-edit-tabs";
            editTabs.hidden = true;
            const formTab = document.createElement("button");
            formTab.type = "button";
            formTab.textContent = "Form";
            formTab.hidden = editor.getAttribute("key") !== "{}";
            const codeTab = document.createElement("button");
            codeTab.type = "button";
            codeTab.textContent = editor.getAttribute("key") === "{}" ? "JSON" : "Code";
            editTabs.append(formTab, codeTab);
            const cancel = document.createElement("button");
            cancel.type = "button";
            cancel.innerHTML = '<i class="ri-close-line" aria-hidden="true"></i>';
            cancel.setAttribute("aria-label", "Cancel");
            cancel.title = "Cancel";
            cancel.hidden = true;
            cancel.addEventListener("click", () => {
                editor.value = originalValue;
                editor.dispatchEvent(new Event("input", { bubbles: true }));
                editing = false;
                activeForm = undefined;
                collectFormValues = undefined;
                detailsView.click();
            });
            edit.addEventListener("click", async () => {
                if (activeForm) {
                    activeForm.requestSubmit();
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
            copy.innerHTML = '<i class="ri-file-copy-line" aria-hidden="true"></i>';
            copy.setAttribute("aria-label", "Copy");
            copy.title = "Copy";
            copy.addEventListener("click", async () => {
                await navigator.clipboard?.writeText(editor.value);
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
            view.setAttribute("plugin", '{"$SimpleBar":["$this",{}]}');
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
            let activeView = "code";
            const appPath = editor.getAttribute("array")
                .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
                .replaceAll("_", "-")
                .toLowerCase();
            const showCode = () => {
                activeView = "code";
                activeForm = undefined;
                collectFormValues = undefined;
                detailsPanel.hidden = true;
                detailsPanel.classList.remove("ai-code-detail-view");
                detailsPanel.classList.remove("ai-app-details-view");
                label.textContent = "Edit";
                codearea.hidden = false;
                setEditAction("save");
                cancel.hidden = false;
                editTabs.hidden = false;
                formTab.classList.remove("active");
                formTab.setAttribute("aria-selected", "false");
                codeTab.classList.add("active");
                codeTab.setAttribute("aria-selected", "true");
                menu.open = false;
                requestAnimationFrame(resizeCodearea);
            };
            const showDetails = (title, value, languageName = "") => {
                activeView = title;
                activeForm = undefined;
                collectFormValues = undefined;
                detailsPanel.classList.remove("ai-app-details-view");
                detailsPanel.querySelector(".ai-crud-form")?.remove();
                detailsPanel.querySelector(".ai-crud-configurations")?.remove();
                detailsPanel.querySelector(".ai-crud-details-view")?.remove();
                detailsPanel.classList.add("ai-code-detail-view");
                label.textContent = title;
                codearea.hidden = true;
                setEditAction("edit");
                cancel.hidden = true;
                editTabs.hidden = true;
                detailsPre.hidden = false;
                detailsTitle.hidden = true;
                detailsCode.className = languageName ? `language-${languageName}` : "";
                detailsCode.textContent = typeof value === "string"
                    ? value
                    : JSON.stringify(value, null, 2);
                detailsPanel.hidden = false;
                menu.open = false;
                highlightCodeBlocks(detailsPanel);
                requestAnimationFrame(() => {
                    globalThis.SimpleBar?.instances?.get(view)?.recalculate();
                });
            };
            const showForm = async () => {
                activeView = "Form";
                detailsPanel.classList.remove("ai-app-details-view");
                let object;
                try {
                    object = JSON.parse(editor.value);
                } catch {
                    showDetails("Form", "The current value is not valid JSON.");
                    return;
                }
                if (!object || Array.isArray(object) || typeof object !== "object") {
                    showDetails("Form", "Form view requires a JSON object.");
                    return;
                }
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
                cancel.hidden = false;
                editTabs.hidden = false;
                formTab.classList.add("active");
                formTab.setAttribute("aria-selected", "true");
                codeTab.classList.remove("active");
                codeTab.setAttribute("aria-selected", "false");
                const formContent = document.createElement("div");
                formContent.className = "ai-crud-form-content";
                const formObserver = new MutationObserver(() => {
                    const nestedForm = formContent.querySelector(":scope > form");
                    if (nestedForm) {
                        nestedForm.querySelector(":scope > .card-header")?.remove();
                        nestedForm.querySelector(":scope > .card-footer")?.remove();
                        nestedForm.replaceWith(...nestedForm.childNodes);
                    }
                    if (!formContent.firstElementChild) return;
                    formObserver.disconnect();
                    window.CoCreate?.elements?.init?.(form);
                    globalThis.SimpleBar?.instances?.get(view)?.recalculate();
                });
                formObserver.observe(formContent, { childList: true });
                form.append(formContent);
                detailsContent.append(form);
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
                requestAnimationFrame(() => {
                    globalThis.SimpleBar?.instances?.get(view)?.recalculate();
                });
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
            codeTab.addEventListener("click", async () => {
                if (activeForm && collectFormValues) {
                    const updated = await collectFormValues();
                    if (!updated) return;
                    editor.value = JSON.stringify(updated, null, 2);
                    editor.dispatchEvent(new Event("input", { bubbles: true }));
                }
                showCode();
            });
            const getCrudAttributes = () => {
                const values = {};
                for (const name of [
                    "storage", "database", "array", "object", "key", "value-type"
                ]) {
                    if (editor.hasAttribute(name)) values[name] = editor.getAttribute(name);
                }
                return values;
            };
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
                try {
                    if (activeView !== "Details") return;
                    detailsPre.hidden = true;
                    detailsPanel.classList.add("ai-app-details-view");
                    const details = document.createElement("div");
                    details.className = "ai-crud-details-view";
                    const array = editor.getAttribute("array");
                    const object = editor.getAttribute("object");
                    details.setAttribute("array", array);
                    details.setAttribute("object", object);
                    const detailsObserver = new MutationObserver(() => {
                        const content = details.firstElementChild;
                        if (!content) return;
                        content.removeAttribute("state-id");
                        content.setAttribute("array", array);
                        content.setAttribute("object", object);
                        detailsObserver.disconnect();
                        window.CoCreate?.elements?.init?.(content);
                    });
                    detailsObserver.observe(details, { childList: true, subtree: true });
                    detailsContent.append(details);
                    const path = `/apps/${appPath}/details.html`;
                    details.setAttribute("src", `${path}?view=${Date.now()}`);
                    window.CoCreate?.elements?.init?.(details);
                } catch (error) {
                    showDetails("Details", error.message || "Unable to load details view");
                }
            });
            const configurationsView = document.createElement("button");
            configurationsView.type = "button";
            configurationsView.textContent = "Configurations";
            configurationsView.addEventListener("click", () => {
                if (editing) {
                    editor.value = originalValue;
                    editor.dispatchEvent(new Event("input", { bubbles: true }));
                    editing = false;
                }
                const crudAttributes = getCrudAttributes();
                const htmlAttributes = Object.entries(crudAttributes)
                    .map(([name, value]) => `${name}="${String(value)
                        .replaceAll("&", "&amp;")
                        .replaceAll('"', "&quot;")
                        .replaceAll("<", "&lt;")
                        .replaceAll(">", "&gt;")}"`)
                    .join(" ");
                showDetails("Configurations", "");
                detailsPre.hidden = true;
                const configurations = document.createElement("div");
                configurations.className = "ai-crud-configurations";
                const configurationItems = [
                    ["CRUD attributes", `<div ${htmlAttributes}></div>`, "html"],
                    ["CRUD object", JSON.stringify(crudAttributes, null, 2), "json"]
                ];
                if (editor.getAttribute("array") === "files") {
                    configurationItems.unshift([
                        "Pathname",
                        editor.dataset.pathname || "Not available",
                        ""
                    ]);
                }
                for (const [title, value, languageName] of configurationItems) {
                    const card = document.createElement("section");
                    card.className = "ai-configuration-card";
                    const cardLabel = document.createElement("strong");
                    cardLabel.textContent = title;
                    const cardPre = document.createElement("pre");
                    const cardCode = document.createElement("code");
                    if (languageName) cardCode.className = `language-${languageName}`;
                    cardCode.textContent = value;
                    cardPre.append(cardCode);
                    card.append(cardLabel, cardPre);
                    configurations.append(card);
                }
                detailsContent.append(configurations);
                highlightCodeBlocks(configurations);
                requestAnimationFrame(() => {
                    globalThis.SimpleBar?.instances?.get(view)?.recalculate();
                });
            });
            const editView = document.createElement("button");
            editView.type = "button";
            editView.textContent = "Edit";
            editView.addEventListener("click", startEdit);
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
            menuOptions.append(
                detailsView,
                editView,
                configurationsView,
                download
            );
            menu.append(menuTrigger, menuOptions);
            actions.append(editTabs, cancel, edit, copy, menu);
            header.append(label, actions);
            const codearea = document.createElement("codearea");
            codearea.className = "ai-crud-codearea";
            const resizeCodearea = () => {
                if (codearea.hidden) return;
                editor.style.height = "auto";
                const height = Math.max(view.clientHeight, editor.scrollHeight);
                editor.style.height = `${height}px`;
                codearea.style.height = `${height}px`;
                globalThis.SimpleBar?.instances?.get(view)?.recalculate();
            };
            editor.addEventListener("input", () => requestAnimationFrame(resizeCodearea));
            pre.replaceWith(block);
            codearea.append(pre, editor);
            view.append(detailsPanel, codearea);
            block.append(header, view);
            window.CoCreate?.elements?.init?.(editor);
            window.CoCreate?.plugins?.init?.(view);
            detailsView.click();
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

    const renderMessageContent = (body, content = "", { initializeCrud = true } = {}) => {
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
		highlightCodeBlocks(body);
		if (initializeCrud) initializeCrudViews(body);
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

    const addMessage = (role, content = "") => {
        shell.querySelector(".ai-empty")?.remove();
        const element = document.createElement("article");
        element.className = `ai-message ${role}`;
        const body = document.createElement("div");
        body.className = "ai-message-content";
        renderMessageContent(body, content);
        element.append(body);
        messages.append(element);
        scrollDown();
        return { element, body };
    };

    const getConversationContext = () =>
        Array.from(messages.querySelectorAll(".ai-message"))
            .map((element) => ({
                role: element.classList.contains("user") ? "user" : "assistant",
                content: element.querySelector(".ai-message-content")?.dataset.content || ""
            }))
            .filter((message) => message.content)
            .slice(-12);

    const activateThread = (id) => {
        for (const item of threadList.querySelectorAll(".ai-thread")) {
            item.classList.toggle(
                "active",
                item.dataset.conversationId === id
            );
        }
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

    const readConversationMessages = async (id) => {
        const createFilter = (nested = false) => {
            const prefix = nested ? "object." : "";
            return {
                query: {
                    [`${prefix}conversation_id`]: id
                },
                sort: [{ key: `${prefix}created.on`, direction: "asc" }],
                limit: 200
            };
        };

        let history = await readObjects("ai-messages", createFilter());
        if (!history.length) {
            history = await readObjects("ai-messages", createFilter(true));
        }

        return history.filter((item) => {
            const message = unwrapObject(item);
            return String(message.conversation_id) === String(id);
        });
    };

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
        setStatus("Loading conversation…", "connected");

        try {
            const history = await readConversationMessages(id);
            if (conversationLoadId !== loadId) return;
            for (const item of history) {
                const message = unwrapObject(item);
                addMessage(message.role || "assistant", message.content || "");
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
            renderMessageContent(stream.body, stream.content);
            conversationId = data.ai.conversation_id || conversationId;
            activateThread(conversationId);
            setStatus("Connected", "connected");
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
        } else {
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
        if (data.ai.status === "tool" && data.ai.tool) {
            renderToolResult(stream, data.ai.tool);
            return;
        }
        if (data.ai.status === "credentials" && data.ai.credential) {
            stream.element.classList.remove("pending");
            conversationId = data.ai.conversation_id || conversationId;
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
        socket = window.CoCreate?.socket;
        if (!socket?.send || !socket?.listen) return false;
        socket.listen("ai.chat", onChat);
        setStatus("Connected", "connected");
        return true;
    };

    updateModels();

    new MutationObserver(() => {
        if (!sidebar.classList.contains("show")) return;
        requestAnimationFrame(() => {
            globalThis.SimpleBar?.instances?.get(threadScroll)?.recalculate();
        });
    }).observe(sidebar, { attributes: true, attributeFilter: ["class"] });

    const submitPrompt = async (
        message,
        { display = true, persist = true, signal } = {}
    ) => {
        const text = message.trim();
        if (!text || send.disabled || !socket) return;

        const streamId = makeId();
        const context = { messages: getConversationContext() };
        if (display) addMessage("user", text);
        const assistant = addMessage("assistant");
        assistant.element.classList.add("pending");
        streams.set(streamId, {
            ...assistant,
            streamId,
            content: "",
            visibleLength: 0,
            terminal: null,
            prompt: text
        });
        if (display && prompt.value.trim() === text) prompt.value = "";
        resizePrompt();
        setBusy(true);
        setStatus("Generating…", "connected");

        try {
            await socket.send({
                method: "ai.chat",
                uuid: streamId,
                ai: {
                    prompt: text,
                    persist,
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

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        void submitPrompt(prompt.value);
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

    prompt.addEventListener("input", resizePrompt);
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
    new MutationObserver(() => {
        if (conversationId) activateThread(conversationId);
    }).observe(threadList, { childList: true, subtree: true });
    prompt.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            form.requestSubmit();
        }
    });

    shell.querySelector(".ai-new-chat").addEventListener("click", () => {
        conversationLoadId = undefined;
        conversationId = undefined;
        messages.replaceChildren(emptyView.cloneNode(true));
        for (const item of threadList.querySelectorAll(".ai-thread")) {
            item.classList.remove("active");
        }
        prompt.focus();
    });

    if (!connect()) {
        let attempts = 0;
        const timer = setInterval(() => {
            if (connect() || ++attempts >= 40) {
                clearInterval(timer);
                if (!socket) {
                    setStatus("Socket unavailable", "error");
                    send.disabled = true;
                }
            }
        }, 250);
    }
})();
