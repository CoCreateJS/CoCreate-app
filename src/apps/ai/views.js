// Code and record views used by AI chat.
const makeId = () => crypto.randomUUID?.() || `codearea-${Date.now()}-${Math.random().toString(16).slice(2)}`;

function observe(config) {
    const observer = new MutationObserver(records => {
        for (const record of records) {
            if (record.type === 'attributes' && record.target.matches(config.selector)) config.callback(record);
            for (const node of record.addedNodes || []) {
                if (node.nodeType !== 1) continue;
                if (node.matches(config.selector)) config.callback({ ...record, target: node });
                for (const target of node.querySelectorAll(config.selector)) config.callback({ ...record, target });
            }
        }
    });
    observer.observe(document.documentElement, {
        subtree: true,
        childList: config.types.includes('addedNodes'),
        attributes: config.types.includes('attributes'),
        ...(config.attributeFilter && { attributeFilter: config.attributeFilter })
    });
    return () => observer.disconnect();
}

function defaultMarkdown(target, content) {
    if (globalThis.marked?.parse && globalThis.DOMPurify?.sanitize) {
        target.innerHTML = globalThis.DOMPurify.sanitize(globalThis.marked.parse(content));
    } else target.textContent = content;
}

export function createCodeareaTools(options = {}) {
    const initAIObserver = options.observe || observe;
    const appendMarkdown = options.appendMarkdown || defaultMarkdown;
    const highlightTimers = new WeakMap();
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
            const component = pre.parentElement.matches('.component-codearea') ? pre.parentElement : null;
            const editor = component?.querySelector('textarea[type="code"]') || document.createElement("textarea");
            editor.setAttribute("type", "code");
            editor.setAttribute("lang", editor.getAttribute("lang") || [...code.classList]
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
            const isBound = Boolean(editor.getAttribute('array') && editor.getAttribute('object'));
            const block = document.createElement("section");
            block.className = "ai-code-block ai-crud-code-block";
            const header = document.createElement("header");
            const language = editor.getAttribute("lang");
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
            detailsTab.parentElement.hidden = !isBound;
			const formTab = createViewTab("Form");
			formTab.parentElement.hidden =
				!isBound || (editor.getAttribute("key") !== "{}" && !isFileSource);
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
			const appPath = (editor.dataset.appPath || editor.getAttribute("array") || "")
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
                    `/apps/${appPath}/components/form.html?view=${Date.now()}`
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
                    const path = `/apps/${appPath}/components/details.html`;
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
                const url = URL.createObjectURL(new Blob([activeJsonEditor?.value ?? editor.value], {
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
            (component || pre).replaceWith(block);
            codearea.append(pre, editor);
            view.append(detailsPanel, codearea, copy);
            block.append(header, view, footer);
            window.CoCreate?.codearea?.initElement?.(editor);
            if (isBound) window.CoCreate?.elements?.init?.(editor);
			if (!isBound) {
                showCode();
                edit.disabled = true;
                remove.hidden = true;
            } else if (editor.dataset.display === "code" || editor.dataset.display === "form") {
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

    return { initializeCrudViews, createCodeBlock, createJsonBlock, highlightCodeBlocks };
}
