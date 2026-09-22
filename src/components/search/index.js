/********************************************************************************
 * Copyright (C) 2023 CoCreate and Contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 ********************************************************************************/

(() => {
    if (document.documentElement.dataset.searchScopeInitialized) return;
    document.documentElement.dataset.searchScopeInitialized = "true";

    const globalSearchArrays = [
        "clusters",
        "servers",
        "apis",
        "files",
        "apps",
        "endpoints",
        "webhooks"
    ];
    let searchTimer;
    let searchRequest = 0;
    let appDefinitionsPromise;

    const getSearchForms = () =>
        document.querySelectorAll(".app-search[data-search-scope]");

    const collapseCompactSearch = (container) => {
        container.classList.remove("search-expanded");
        const button = container.querySelector("[data-search-expand]");
        button?.setAttribute("aria-expanded", "false");
    };

    const getResults = (form) => {
        const nestedResults = form.querySelector(":scope > [data-search-results]");
        if (nestedResults) return nestedResults;
        return form.nextElementSibling?.matches("[data-search-results]")
            ? form.nextElementSibling
            : null;
    };

    const clearRenderedResults = (element) => {
        Array.from(element.children).forEach((child) => {
            if (!child.matches("[template], template")) child.remove();
        });
    };

    const getResponseErrors = (response) => {
        const errors = response?.error ?? response?.data?.error ?? [];
        return Array.isArray(errors) ? errors : errors ? [errors] : [];
    };

    const getErrorMessage = (error) =>
        error?.message || (typeof error === "string" ? error : "");

    const getResultArray = (object) => {
        const array = object?.$array;
        return Array.isArray(array) ? array[0] : array;
    };

    const getResultLabel = (object) => {
        if (getResultArray(object) === "webhooks" && object?.path) {
            return `/webhooks/${String(object.path).replace(/^\/+/, "")}`;
        }

        return (
            object?.name ??
            object?.title ??
            object?.subject ??
            object?.host ??
            object?.email ??
            object?._id ??
            ""
        );
    };

    const getResultMeta = (object) => {
        const array = getResultArray(object) || "";
        if (array === "files") {
            const pathname = object?.pathname || object?.path || "/";
            return `files · ${pathname}`;
        }

        const detail = object?.description || object?.region || "";
        return [array, detail].filter(Boolean).join(" · ");
    };

    const getAppDefinitions = (crud) => {
        if (appDefinitionsPromise) return appDefinitionsPromise;

        appDefinitionsPromise = crud
            .send({
                method: "object.read",
                array: "apps",
                filter: {
                    key: { array: 1, icon: 1 },
                    limit: 0
                }
            })
            .then((response) => {
                const apps = Array.isArray(response?.object)
                    ? response.object
                    : response?.object
                      ? [response.object]
                      : [];
                return new Map(
                    apps
                        .filter((app) => app?.array)
                        .map((app) => [app.array, app])
                );
            })
            .catch(() => new Map());

        return appDefinitionsPromise;
    };

    const updateSearchPanels = (query, status) => {
        document.querySelectorAll("[data-search-results]").forEach((panel) => {
            const empty = panel.querySelector("[data-search-empty]");
            const section = panel.querySelector("[data-global-search-section]");
            const statusElement = panel.querySelector("[data-search-status]");
            if (empty) empty.hidden = Boolean(query);
            if (section) section.hidden = !query;
            if (statusElement && status !== undefined) {
                statusElement.hidden = status === "";
                statusElement.textContent = status;
            }
        });
    };

    const searchGlobally = async (query) => {
        const value = query.trim();
        const request = ++searchRequest;
        if (!value) {
            updateSearchPanels("", "");
            return;
        }

        updateSearchPanels(value, "Searching...");
        const resultElements = document.querySelectorAll(
            "[data-global-search-results]"
        );
        resultElements.forEach(clearRenderedResults);

        try {
            const crud = window.CoCreate?.crud;
            const renderer = window.CoCreate?.render;
            if (typeof crud?.send !== "function" || !renderer?.render) {
                throw new Error("Search is not available yet.");
            }

            const [response, appsByArray] = await Promise.all([
                crud.send({
                    method: "object.read",
                    array: globalSearchArrays,
                    filter: {
                        search: [
                            {
                                value,
                                operator: "or",
                                caseSensitive: false
                            }
                        ],
                        sort: [{ key: "name", direction: "asc" }],
                        limit: 20,
                        overwrite: true
                    }
                }),
                getAppDefinitions(crud)
            ]);
            if (request !== searchRequest) return;

            const objects = Array.isArray(response?.object)
                ? response.object
                : response?.object
                  ? [response.object]
                  : [];
            const errors = getResponseErrors(response);
            if (!objects.length) {
                const errorMessage = errors.map(getErrorMessage).find(Boolean);
                updateSearchPanels(
                    value,
                    errorMessage || `No results for “${value}”.`
                );
                return;
            }

            for (const element of resultElements) {
                const data = {
                    ...response,
                    object: objects.map((object) => ({
                        ...object,
                        $searchLabel: getResultLabel(object),
                        $searchMeta: getResultMeta(object),
                        $appIcon:
                            appsByArray.get(getResultArray(object))?.icon ||
                            "ri-search-line"
                    }))
                };
                await renderer.render({ source: element, data });
            }
            updateSearchPanels(
                value,
                errors.length ? "Some sources could not be searched." : ""
            );
        } catch (error) {
            if (request !== searchRequest) return;
            updateSearchPanels(
                value,
                error?.message || "Search could not be completed."
            );
        }
    };

    const queueGlobalSearch = (query) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => searchGlobally(query), 250);
    };

    const openSearchResults = (input) => {
        const form = input.closest(".app-search");
        const controller = form?.querySelector(
            "[data-search-results-controller]"
        );
        if (!controller) return;
        if (controller.getAttribute("aria-expanded") !== "true") {
            const results = getResults(form);
            if (results) results.hidden = false;
            controller.click();
        }
    };

    const closeSearchResults = (form) => {
        const controller = form?.querySelector(
            "[data-search-results-controller]"
        );
        if (!controller || controller.getAttribute("aria-expanded") !== "true") {
            return;
        }

        controller.removeAttribute("aria-open");
        controller.setAttribute("aria-close", "");
        controller.click();
        controller.removeAttribute("aria-close");
        controller.setAttribute("aria-open", "");
    };

    const initializeViewFilter = (input) => {
        const initialize = async () => {
            const filter = window.CoCreate?.filter;
            if (typeof filter?.init !== "function" || !input.isConnected) return;
            await filter.init(input);
            input.dispatchEvent(new Event("input", { bubbles: true }));
        };

        if (window.CoCreate?.filter) {
            void initialize();
        } else {
            document.addEventListener("filterLoaded", initialize, {
                once: true
            });
        }
    };

    const setViewFilter = (input, enabled) => {
        if (enabled) {
            input.setAttribute(
                "filter-query",
                "$document #main-view .list-view"
            );
            input.setAttribute("filter-search", "");
            initializeViewFilter(input);
            return;
        }

        input.removeAttribute("filter-search");
        requestAnimationFrame(() => input.removeAttribute("filter-query"));
    };

    const setScope = (scope, sourceForm) => {
        document.querySelectorAll("[data-search-scope-input]").forEach((input) => {
            input.checked = scope === "view";
        });

        getSearchForms().forEach((form) => {
            closeSearchResults(form);
            form.dataset.searchScope = scope;
            const input = form.querySelector("input[type='text']");
            const chip = form.querySelector("[data-search-scope-chip]");
            const results = getResults(form);

            if (chip) {
                chip.hidden = !hasSelectedApp(
                    chip.querySelector('[state-id="app"]')
                );
            }
            if (results) {
                results.hidden = true;
                results.classList.remove("show");
                results.setAttribute("aria-hidden", "true");
            }
            if (!input) return;

            setViewFilter(input, scope === "view");

            const scopeName = chip
                ?.querySelector(".search-scope-name > span")
                ?.textContent.trim();
            input.placeholder =
                scope === "view"
                    ? `Search ${scopeName || "current view"}...`
                    : "Search anything...";
        });

        const sourceInput = sourceForm?.querySelector("input[type='text']");
        if (scope === "view") {
            sourceInput?.dispatchEvent(new Event("input", { bubbles: true }));
            return;
        }

        if (!sourceInput) return;
        queueGlobalSearch(sourceInput.value);
        requestAnimationFrame(() => {
            sourceInput.focus();
        });
    };

    document.addEventListener("focusin", (event) => {
        const input = event.target.closest(".app-search input[type='text']");
        if (!input) return;
        const form = input.closest(".app-search");
        if (form?.dataset.searchScope !== "view") return;
        const scopeName = input
            .closest(".app-search")
            ?.querySelector(".search-scope-name > span")
            ?.textContent.trim();
        input.placeholder = `Search ${scopeName || "current view"}...`;
    });

    document.addEventListener("input", (event) => {
        const input = event.target.closest(
            ".app-search[data-search-scope='workspace'] input[type='text']"
        );
        if (input) {
            queueGlobalSearch(input.value);
        }
    });

    document.addEventListener("change", (event) => {
        const scopeInput = event.target.closest("[data-search-scope-input]");
        if (!scopeInput) return;
        setScope(
            scopeInput.checked ? "view" : "workspace",
            scopeInput.closest(".app-search")
        );
    });

    document.addEventListener("submit", (event) => {
        if (event.target.matches(".app-search[data-search-scope]")) {
            event.preventDefault();
        }
    });

    document.addEventListener("click", (event) => {
        const expand = event.target.closest("[data-search-expand]");
        if (expand) {
            event.preventDefault();
            const container = expand.closest(".topbar-search-compact");
            container?.classList.add("search-expanded");
            expand.setAttribute("aria-expanded", "true");
            requestAnimationFrame(() => {
                container
                    ?.querySelector(".app-search-mobile input[type='text']")
                    ?.focus();
            });
            return;
        }

        document
            .querySelectorAll(".topbar-search-compact.search-expanded")
            .forEach((container) => {
                if (!container.contains(event.target)) {
                    collapseCompactSearch(container);
                }
            });
    });

    document.addEventListener("keydown", (event) => {
        if (typeof event.key !== "string") return;
        const input = event.target.closest(
            ".app-search[data-search-scope='workspace'] input[type='text']"
        );
        const typingKey =
            !event.altKey &&
            ((!event.ctrlKey && !event.metaKey && event.key.length === 1) ||
                event.key === "Backspace" ||
                event.key === "Delete" ||
                ((event.ctrlKey || event.metaKey) &&
                    event.key.toLowerCase() === "v"));
        if (input && typingKey) {
            openSearchResults(input);
        }

        if (event.key !== "Escape") return;
        document
            .querySelectorAll(".topbar-search-compact.search-expanded")
            .forEach((container) => {
                collapseCompactSearch(container);
                container.querySelector("[data-search-expand]")?.focus();
            });
    });

    const appStateSelector =
        '[data-search-scope-chip] [state-id="app"]';
    const hasSelectedApp = (element) => {
        const object = element?.getAttribute("object")?.trim();
        return Boolean(object && object !== "pending");
    };
    const syncScopeFromAppState = (element) => {
        setScope(hasSelectedApp(element) ? "view" : "workspace");
    };
    const initializeAppScopeObserver = () => {
        const observer = window.CoCreate?.observer;
        if (typeof observer?.init !== "function") return;
        observer.init({
            name: "SearchAppScope",
            types: ["attributes"],
            selector: appStateSelector,
            attributeFilter: ["object"],
            callback(mutation) {
                syncScopeFromAppState(mutation.target);
            }
        });
    };

    const appState = document.querySelector(appStateSelector);
    syncScopeFromAppState(appState);
    if (window.CoCreate?.observer) {
        initializeAppScopeObserver();
    } else {
        document.addEventListener("observerLoaded", initializeAppScopeObserver, {
            once: true
        });
    }
})();
