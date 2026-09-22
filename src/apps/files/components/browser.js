(() => {
    const key = Symbol.for("CoCreate.fileBrowser");
    if (window[key]) { window[key].scan(); return; }
    const instances = new WeakMap();
    const createBrowser = (dialog, picker = false) => {
        let target, scope = {}, selected, request = 0, offset = 0, timer, uploading = false;
        const limit = 40;
        const active = () => dialog.isConnected && (!picker || dialog.open);
        const $ = selector => dialog.querySelector(selector);
        const message = text => { $("[data-media-message]").textContent = text; };
        const records = response => {
            if (!response || (response.error && (!Array.isArray(response.error) || response.error.length)))
                throw new Error("The file request could not be completed.");
            return Array.isArray(response.object) ? response.object : response.object ? [response.object] : [];
        };
        const send = async data => {
            if (!window.CoCreate?.crud?.send) throw new Error("The file library is not ready yet. Please try again.");
            return records(await window.CoCreate.crud.send({ ...scope, array: "files", ...data }));
        };
        const imagePath = file => {
            const path = file.pathname;
            return typeof path === "string" && path.startsWith("/") && !path.startsWith("//") && !path.includes("\\") ? path : "";
        };
        const choose = (file, button) => {
            selected = file;
            dialog.querySelectorAll(".media-picker-item").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
            $("[data-media-select]").disabled = !file;
            $("[data-media-selection]").textContent = file ? "Selected: " + (file.name || file.pathname) : "No file selected";
            $("[data-media-details]").hidden = !file;
            $("[data-media-details-empty]").hidden = Boolean(file);
            if (file) {
                $("[data-media-preview]").hidden = !isImage(file);
                $("[data-media-preview-icon]").hidden = isImage(file);
                if (isImage(file)) $("[data-media-preview]").src = imagePath(file);
                else $("[data-media-preview]").removeAttribute("src");
                $("[data-media-name]").textContent = file.name || "—";
                $("[data-media-location]").textContent = file.pathname;
                $("[data-media-type]").textContent = file["content-type"] || "Image";
                $("[data-media-size]").textContent = typeof file.size === "number" ? (file.size / 1024).toLocaleString(undefined, { maximumFractionDigits: 1 }) + " KB" : "—";
            } else $("[data-media-preview]").removeAttribute("src");
        };
        const isImage = file => file["content-type"]?.startsWith("image/") || /\.(svg|png|jpe?g|gif|webp|avif|ico)$/i.test(file.pathname || "");
        const append = file => {
            const src = imagePath(file);
            if (!src || !file._id) return;
            const button = document.createElement("button");
            button.type = "button";
            button.className = "media-picker-item";
            button.setAttribute("aria-pressed", "false");
            button.title = file.pathname;
            const image = document.createElement(isImage(file) ? "img" : "i");
            if (isImage(file)) { image.src = src; image.alt = ""; image.loading = "lazy"; }
            else { image.className = file["content-type"]?.startsWith("video/") ? "ri-video-line" : file["content-type"]?.startsWith("audio/") ? "ri-music-line" : "ri-file-line"; image.setAttribute("aria-hidden", "true"); }
            const label = document.createElement("span");
            label.textContent = file.name || file.pathname;
            button.append(image, label);
            button.addEventListener("click", () => choose(file, button));
            $("[data-media-grid]").append(button);
            return button;
        };
        const load = async (more = false) => {
            const version = ++request;
            if (!more) {
                offset = 0;
                choose(null);
                $("[data-media-grid]").replaceChildren();
            }
            $("[data-media-more]").hidden = true;
            message("Loading files…");
            const escape = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const query = { deleted: { $ne: true }, "content-type": { $ne: "text/directory" } };
            const kind = picker ? "image" : $("[data-media-kind]").value;
            if (kind === "image") query.$or = [
                { "content-type": { $regex: "^image/" } },
                { pathname: { $regex: "\\.(svg|png|jpe?g|gif|webp|avif|ico)$", $options: "i" } }
            ];
            else if (kind === "application") query["content-type"] = { $regex: "^(application|text)/", $ne: "text/directory" };
            else if (kind) query["content-type"] = { $regex: "^" + kind + "/" };
            const folder = $("[data-media-folder]").value;
            const search = $("[data-media-search]").value.trim();
            if (folder) query.pathname = { $regex: "^" + escape(folder) };
            if (search) query.name = { $regex: escape(search), $options: "i" };
            try {
                const files = await send({ method: "object.read", filter: {
                    query, key: { _id: 1, name: 1, pathname: 1, path: 1, size: 1, "content-type": 1 },
                    sort: [{ key: "name", direction: "asc" }, { key: "_id", direction: "asc" }], index: offset, limit
                } });
                if (version !== request || !active()) return;
                files.forEach(append);
                offset += files.length;
                $("[data-media-more]").hidden = files.length < limit;
                message($("[data-media-grid]").children.length ? "" : "No files found. Choose another folder or upload a file.");
            } catch (error) {
                if (version === request) {
                    message(error.message);
                    $("[data-media-more]").hidden = false;
                }
            }
        };
        const upload = async file => {
            if (!file || uploading) return;
            if (picker && !file.type.startsWith("image/")) { message("Choose an image file."); return; }
            let path = $("[data-media-path]").value.trim();
            if (!path.endsWith("/")) path += "/";
            if (!path.startsWith("/media/") || path.includes("\\") || path.split("/").some(part => part === "." || part === "..")) {
                message("Choose an upload folder under /media/."); return;
            }
            uploading = true;
            ++request;
            clearTimeout(timer);
            dialog.querySelectorAll("button, input, select").forEach(el => { el.disabled = true; });
            message("Uploading file…");
            try {
                const src = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(new Error("The file could not be read."));
                    reader.readAsDataURL(file);
                });
                const name = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
                const pathname = path + crypto.randomUUID() + "-" + name;
                const uploaded = await send({ method: "object.create", object: {
                    name: file.name, path, pathname, "content-type": file.type, size: file.size, src
                } });
                const saved = uploaded.find(item => item._id);
                if (!saved) throw new Error("Upload was not confirmed. Please check the library before retrying.");
                const record = { name: file.name, pathname, size: file.size, "content-type": file.type, ...saved };
                choose(record, append(record));
                message("Uploaded. Your file is ready.");
            } catch (error) { message(error.message); }
            finally {
                uploading = false;
                dialog.querySelectorAll("button, input, select").forEach(el => { el.disabled = false; });
                $("[data-media-select]").disabled = !selected;
                $("[data-media-kind]").disabled = picker;
                $("[data-media-file]").value = "";
            }
        };
        dialog.querySelectorAll("[data-media-close]").forEach(button => button.addEventListener("click", () => { if (picker) dialog.close(); }));
        dialog.addEventListener("cancel", event => { if (uploading) event.preventDefault(); });
        dialog.addEventListener("close", () => { ++request; clearTimeout(timer); target = null; });
        $("[data-media-folder]").addEventListener("change", () => load());
        $("[data-media-search]").addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(() => load(), 250); });
        $("[data-media-more]").addEventListener("click", () => load(true));
        $("[data-media-upload]").addEventListener("click", () => $("[data-media-file]").click());
        $("[data-media-file]").addEventListener("change", event => upload(event.target.files[0]));
        $("[data-media-select]").addEventListener("click", async () => {
            if (!selected) return;
            if (!picker) { window.open(imagePath(selected), "_blank", "noopener"); return; }
            if (!target?.isConnected) return;
            const src = imagePath(selected);
            const reference = { file_id: selected._id, pathname: selected.pathname, src, name: selected.name };
            try {
                const value = target.getAttribute("media-value") === "src" ? src : [reference];
                if (typeof target.setValue !== "function") throw new Error("The image field is not ready yet.");
                await target.setValue(value, false);
                const preview = target.closest("[data-media-field]")?.querySelector("img");
                if (preview) { preview.src = src; preview.hidden = false; }
                target.dispatchEvent(new CustomEvent("mediaSelected", { bubbles: true, detail: { file: reference } }));
                dialog.close();
            } catch (error) { message(error.message); }
        });
        $("[data-media-kind]").addEventListener("change", () => load());
        if (picker) {
            $("[data-media-kind]").value = "image";
            $("[data-media-kind]").disabled = true;
            $("[data-media-file]").accept = "image/*";
            $("[data-media-select]").textContent = "Select image";
            $("[data-media-title]").textContent = "Choose an image";
        }
        const setScope = element => {
            scope = {};
            const data = window.CoCreate?.elements?.getDataObject?.(element);
            for (const key of ["storage", "database"]) if (data?.[key]) scope[key] = data[key];
            if (!scope.database && localStorage.getItem("environment")) scope.database = localStorage.getItem("environment");
        };
        if (!picker) { setScope(dialog); void load(); }
        return { open(button) {
            target = button.closest("[data-media-field]")?.querySelector("[data-media-value]");
            if (!target) return;
            setScope(target);
            $("[data-media-path]").value = button.closest("[media-path]")?.getAttribute("media-path") || "/media/avatars/";
            $("[data-media-folder]").value = "";
            $("[data-media-search]").value = "";
            dialog.showModal();
            void load();
        } };
    };
    const scan = () => document.querySelectorAll("[data-file-browser]").forEach(root => {
        if (!instances.has(root)) instances.set(root, createBrowser(root));
    });
    window[key] = { scan };
    scan();
    let initializing, dialog, picker;
    const initialize = () => initializing ||= (async () => {
        const response = await fetch("/apps/files/components/browser.html");
        if (!response.ok) throw new Error("The file browser could not be loaded.");
        const template = document.createElement("template");
        template.innerHTML = await response.text();
        dialog = document.createElement("dialog");
        dialog.className = "media-picker";
        dialog.setAttribute("aria-label", "Choose an image");
        dialog.append(...template.content.querySelector("[data-file-browser]").childNodes);
        document.body.append(dialog);
        for (const href of ["/apps/files/components/browser.css", "/components/list/header.css"]) {
            if (document.querySelector(`link[href="${href}"]`)) continue;
            const css = document.createElement("link");
            css.rel = "stylesheet";
            css.href = href;
            document.head.append(css);
        }
        picker = createBrowser(dialog, true);
    })().catch(error => { initializing = null; throw error; });
    document.addEventListener("click", async event => {
        const button = event.target.closest("[data-media-open]");
        if (!button) return;
        event.preventDefault();
        if (dialog?.open) return;
        try {
            await initialize();
            if (!dialog.open) picker.open(button);
        } catch (error) {
            let notice = button.closest("[data-media-field]")?.querySelector("[data-media-error]");
            if (!notice) {
                notice = document.createElement("span");
                notice.setAttribute("data-media-error", "");
                notice.setAttribute("role", "alert");
                button.closest("[data-media-field]")?.append(notice);
            }
            notice.textContent = error.message;
        }
    });
})();
