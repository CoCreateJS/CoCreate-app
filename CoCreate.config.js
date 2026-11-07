export default {
    organization_id: "",
    apikey: "",
    host: {
        $branch: {
            main: "wss://cocreatejs.com",
            dev: "wss://dev.cocreatejs.com",
            test: "wss://test.cocreatejs.com"
        }
    },
    directories: [
        {
            entry: "./src",
            array: "files",
            languages: ["en", "es", "fr", "pt", "nl", "ht", "gn"],
            exclude: ["/admin/", "/apps/", "/config/"],
            object: {
                name: "{{name}}",
                src: "{{source}}",
                host: ["*"],
                directory: "/",
                path: "{{path}}",
                pathname: "{{pathname}}",
                "content-type": "{{content-type}}",
                headers: { "cache-control": "public, max-age=31536000" }
            }
        },
        {
            entry: "./src",
            array: "files",
            languages: ["en", "es", "fr", "pt", "nl", "ht", "gn"],
            include: ["/admin/", "/apps/"],
            object: {
                name: "{{name}}",
                src: "{{source}}",
                host: ["*"],
                directory: "/",
                path: "{{path}}",
                pathname: "{{pathname}}",
                "content-type": "{{content-type}}",
                headers: { "cache-control": "private, max-age=31536000" }
            }
        },
        {
            entry: "./src",
            include: ["/config/"],
            $data: ""
        }
    ],

    template: [
        {
            entry: "./",
            output: "../CoCreate-app-template",
            exclude: [
                "./.git/",
                "./.github/",
                "./.vscode/",
                "./node_modules/",
                "./CHANGELOG.md",
                "./CONTRIBUTING.md",
                "./CoCreate.index.js",
                "./webpack.config.js",
                "./package.json",
                "./yarn.lock",
                "./prettier.config.js",
                "./release.config.js"

            ]
        },
        {
            entry: "./",
            output: "../CoCreate-app-template",
            include: ["./src/admin/", "./src/apps/"],
            exclude: [
            ]
        }
    ],
    documentation: {
        output: "./src/docs",
        template: "./src/apps/docs/templates",
        targets: [
            { template: "menu.html", output: "menu.html" },
            { template: "index.html", output: "index.html" },
            {
                template: "page.html",
                output: "{{module.slug}}/index.html",
                each: "modules",
                as: "module"
            }
        ]
    },
    /**
     * @property {string} moduleOutputPath
     * @description Defines the destination file path where the build system (e.g., ModuleGenerator Webpack plugin) 
     * will save the dynamically generated module entry file. This file contains the automated import and lazy-loading logic.
     */
    moduleOutputPath: "./CoCreate.index.js",

    /**
     * @namespace modules
     * @description Contains core component configurations.
     * * The 'import' property defines the package import path for the module.
     * * The 'selector' property is designed so that when the module is built with the project's core, 
     * it observes the DOM for elements matching the selector and lazy-loads the required module dynamically.
     * * For development environments, the Poly Repo CLI reads the 'path' and 'repo' keys from these objects to perform git and build commands.
     * * @property {string} import - The package import path.
     * @property {string} [selector] - CSS selector used for DOM observation and lazy loading.
     * @property {string} [path] - Local relative workspace path. Defines the workspace tree structure, determining where the repository is cloned.
     * @property {string} [repo] - Git repository URL.
     * @property {string[]} [exclude] - Array of strings used to exclude the module from specific CLI commands.
     */
    modules: {
        utils: {
            path: "../CoCreate-modules/utils",
            repo: "github.com/CoCreateJS/CoCreate-utils.git"
        },
        cli: {
            path: "../CoCreate-modules/cli",
            repo: "github.com/CoCreateJS/CoCreate-cli.git",
            exclude: ["git"]
        },
        serviceWorker: {
            import: "@cocreate/service-worker",
            path: "../CoCreate-modules/service-worker",
            repo: "github.com/CoCreateJS/CoCreate-service-worker.git"
        },
        "element-prototype": {
            import: "@cocreate/element-prototype",
            path: "../CoCreate-modules/element-prototype",
            repo: "github.com/CoCreateJS/CoCreate-element-prototype.git"
        },
        observer: {
            import: "@cocreate/observer",
            path: "../CoCreate-modules/observer",
            repo: "github.com/CoCreateJS/CoCreate-observer.git"
        },
        indexeddb: {
            import: "@cocreate/indexeddb",
            path: "../CoCreate-storages/indexeddb",
            repo: "github.com/CoCreateJS/CoCreate-indexeddb.git"
        },
        config: {
            import: "@cocreate/config",
            path: "../CoCreate-modules/config",
            repo: "github.com/CoCreateJS/CoCreate-config.git"
        },
        socket: {
            import: "@cocreate/socket",
            path: "../CoCreate-modules/socket",
            repo: "github.com/CoCreateJS/socket.git"
        },
        events: {
            import: "@cocreate/events",
            path: "../CoCreate-modules/events",
            repo: "github.com/CoCreateJS/CoCreate-events.git"
        },
        aria: {
            import: "@cocreate/aria",
            path: "../CoCreate-modules/aria",
            repo: "github.com/CoCreateJS/CoCreate-aria.git"
        },
        localstorage: {
            import: "@cocreate/local-storage",
            selector: "[storage*='localstorage'], [localstorage-set], [localstorage-get]",
            path: "../CoCreate-modules/local-storage",
            repo: "github.com/CoCreateJS/CoCreate-local-storage.git"
        },
        crud: {
            import: "@cocreate/crud/client",
            selector: "[crud='true'], [database], [array]",
            path: "../CoCreate-modules/crud",
            repo: "github.com/CoCreateJS/crud-server.git"
        },
        state: {
            import: "@cocreate/state",
            selector: "[state-to], [state-id]",
            path: "../CoCreate-modules/state",
            repo: "github.com/CoCreateJS/CoCreate-state.git"
        },
        cache: {
            import: "@cocreate/cache",
            selector: "[cache='true']",
            path: "../CoCreate-modules/cache",
            repo: "github.com/CoCreateJS/CoCreate-cache.git"
        },
        plugins: {
            import: "@cocreate/plugins",
            selector: "[plugins]",
            path: "../CoCreate-modules/plugins",
            repo: "github.com/CoCreateJS/CoCreate-plugins.git"
        },
        crdt: {
            import: "@cocreate/crdt",
            selector: "[crdt='true']",
            path: "../CoCreate-modules/crdt",
            repo: "github.com/CoCreateJS/CoCreate-crdt.git"
        },
        cursors: {
            import: "@cocreate/cursors",
            selector: "input[crdt='true'], textarea[crdt='true'], [contenteditable][crdt='true']",
            path: "../CoCreate-modules/cursors",
            repo: "github.com/cocreatejs/CoCreate-cursors.git"
        },
        editor: {
            import: "@cocreate/editor",
            selector: "[editor], code[language], [contenteditable][crdt='true'], input[crdt='true'], textarea[crdt='true'], iframe[crdt='true']",
            path: "../CoCreate-modules/editor",
            repo: "github.com/cocreatejs/CoCreate-editor.git"
        },
        cssParser: {
            import: "@cocreate/css-parser",
            selector: "link[array][object][key], link[parse]",
            path: "../CoCreate-modules/css-parser",
            repo: "github.com/CoCreateJS/CoCreate-css-parser.git"
        },
        actions: {
            import: "@cocreate/actions",
            selector: "[actions]",
            path: "../CoCreate-modules/actions",
            repo: "github.com/CoCreateJS/CoCreate-actions.git"
        },
        filter: {
            import: "@cocreate/filter",
            selector: "[filter-query]",
            path: "../CoCreate-modules/filter",
            repo: "github.com/CoCreateJS/CoCreate-filter.git"
        },
        render: {
            import: "@cocreate/render",
            selector: "[render], [render-query], [template], template",
            path: "../CoCreate-modules/render",
            repo: "github.com/CoCreateJS/CoCreate-render.git"
        },
        file: {
            import: "@cocreate/file",
            selector: "[type='file'], [actions*='upload'], [actions*='download'], [actions*='saveLocally'], [actions*='import'], [actions*='export'], [actions*='createFile'], [actions*='deleteFile'], [actions*='createDirectory'], [actions*='deleteDirectory']",
            path: "../CoCreate-modules/file",
            repo: "github.com/CoCreateJS/CoCreate-file.git"
        },
        elements: {
            import: "@cocreate/elements",
            selector: "form, [src], [storage], [database], [array], [href], [target], [actions*='disableHref'], [actions*='enableHref']",
            path: "../CoCreate-modules/elements",
            repo: "github.com/CoCreateJS/CoCreate-elements.git"
        },
        workflows: {
            import: "@cocreate/workflows",
            selector: "[workflow]",
            path: "../CoCreate-modules/workflows",
            repo: "github.com/CoCreateJS/CoCreate-workflows.git"
        },
        api: {
            import: "@cocreate/api",
            selector: "[actions], [template_id]",
            path: "../CoCreate-modules/api",
            repo: "github.com/CoCreateJS/CoCreate-api.git"
        },
        position: {
            import: "@cocreate/position",
            selector: "[draggable], [draggable-query], [clonable-query], [droppable-query], [position-target], [position-query]",
            path: "../CoCreate-modules/position",
            repo: "github.com/CoCreateJS/CoCreate-position.git"
        },
        scroll: {
            import: "@cocreate/scroll",
            selector: "[scroll], [scroll-to], [scrollable-x], [scrollable-y]",
            path: "../CoCreate-modules/scroll",
            repo: "github.com/CoCreateJS/CoCreate-scroll.git"
        },
        scrollbar: {
            import: "@cocreate/scrollbar",
            selector: "[scrollbar]",
            path: "../CoCreate-modules/scrollbar",
            repo: "github.com/cocreatejs/CoCreate-scrollbar.git"
        },
        resize: {
            import: "@cocreate/resize",
            selector: "[resize], [height='auto']",
            path: "../CoCreate-modules/resize",
            repo: "github.com/CoCreateJS/CoCreate-resize.git"
        },
        organizations: {
            import: "@cocreate/organizations",
            selector: "[actions*='createOrganization'], [actions*='createEnvironments']",
            path: "../CoCreate-modules/organizations",
            repo: "github.com/CoCreateJS/CoCreate-organizations.git"
        },
        users: {
            import: "@cocreate/users",
            selector: "[session], [actions*='signUp'], [actions*='signIn'], [actions*='inviteUser'], [actions*='acceptInvite'], [actions*='forgotPassword'], [actions*='resetPassword'], [actions*='signOut'], [user-status]",
            path: "../CoCreate-modules/users",
            repo: "github.com/CoCreateJS/CoCreate-users.git"
        },
        search: {
            import: "@cocreate/search",
            selector: "[search-query]",
            path: "../CoCreate-modules/search",
            repo: "github.com/CoCreateJS/CoCreate-search.git"
        },
        clipboard: {
            import: "@cocreate/clipboard",
            selector: "[actions*='clipboard'], [clipboard], [clipboard-query]",
            path: "../CoCreate-modules/clipboard",
            repo: "github.com/CoCreateJS/CoCreate-clipboard.git"
        },
        print: {
            import: "@cocreate/print",
            selector: "[actions*='print'], [print-query]",
            path: "../CoCreate-modules/print",
            repo: "github.com/CoCreateJS/CoCreate-print.git"
        },
        fullscreen: {
            import: "@cocreate/fullscreen",
            selector: "[fullscreen]",
            path: "../CoCreate-modules/fullscreen",
            repo: "github.com/CoCreateJS/CoCreate-fullscreen.git"
        },
        pwa: {
            import: "@cocreate/pwa",
            selector: "[actions*='install']",
            path: "../CoCreate-modules/pwa",
            repo: "github.com/CoCreateJS/CoCreate-pwa.git"
        },
        notification: {
            import: "@cocreate/notification",
            selector: "[actions*='notification']",
            path: "../CoCreate-modules/notification",
            repo: "github.com/CoCreateJS/CoCreate-notification.git"
        },
        geolocation: {
            import: "@cocreate/geolocation",
            selector: "[actions*='geoLocation']",
            path: "../CoCreate-modules/geolocation",
            repo: "github.com/CoCreateJS/CoCreate-geolocation.git"
        },
        speechRecognition: {
            import: "@cocreate/speech-recognition",
            selector: "[speech-recognition]",
            path: "../CoCreate-modules/speech-recognition",
            repo: "github.com/CoCreateJS/CoCreate-speech-recognition.git"
        },
        speechSynthesis: {
            import: "@cocreate/speech-synthesis",
            selector: "[speech-synthesis]",
            path: "../CoCreate-modules/speech-synthesis",
            repo: "github.com/CoCreateJS/CoCreate-speech-synthesis.git"
        },
        webShare: {
            import: "@cocreate/web-share",
            selector: "[share], [actions*='share']",
            path: "../CoCreate-modules/web-share",
            repo: "github.com/CoCreateJS/CoCreate-web-share.git"
        },
        contactPicker: {
            import: "@cocreate/contact-picker",
            selector: "[actions*='getContacts']",
            path: "../CoCreate-modules/contact-picker",
            repo: "github.com/CoCreateJS/CoCreate-contact-picker.git"
        },
        wakeLock: {
            import: "@cocreate/wake-lock",
            selector: "[wake-lock], [actions*='wakeLock']",
            path: "../CoCreate-modules/wake-lock",
            repo: "github.com/CoCreateJS/CoCreate-wake-lock.git"
        },
        validation: {
            import: "@cocreate/validation",
            selector: "[actions*='validate'], [required]",
            path: "../CoCreate-modules/validation",
            repo: "github.com/CoCreateJS/CoCreate-validation.git"
        }
    },

    /**
     * @namespace plugins
     * @description External plugins (CDN links, styling) and associated configurations.
     * Used to define external dependencies and their JS and CSS sources.
     * * IMPORTANT: The key for each plugin (e.g., 'Toastify') MUST be the exact
     * global reference name used by the plugin. The system uses this exact key to dynamically 
     * access the object and initialize the plugin once fetched. This allows any plugin to be 
     * seamlessly whitelisted, configured, and initialized dynamically via HTML attributes or inline scripts.
     */
    plugins: {
        webpack: {
            path: "../CoCreate-plugins/webpack",
            repo: "github.com/CoCreateJS/Webpack.git"
        },
        Toastify: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/toastify-js", crossOrigin: "anonymous" }],
            css: ["https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"]
        },
        flatpickr: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/flatpickr", crossOrigin: "anonymous" }],
            css: ["https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"]
        },
        GLightbox: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js", crossOrigin: "anonymous" }],
            css: ["https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css"]
        },
        FgEmojiPicker: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/fg-emoji-picker/fgEmojiPicker.js", crossOrigin: "anonymous" }]
        },
        bootstrap: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js", crossOrigin: "anonymous" }]
        },
        Waves: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/node-waves/dist/waves.min.js", crossOrigin: "anonymous" }],
            css: ["https://cdn.jsdelivr.net/npm/node-waves/dist/waves.min.css"]
        },
        ApexCharts: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/apexcharts", crossOrigin: "anonymous" }]
        },
        jsVectorMap: {
            js: [
                { src: "https://cdn.jsdelivr.net/npm/jsvectormap", crossOrigin: "anonymous" },
                { src: "https://cdn.jsdelivr.net/npm/jsvectormap/dist/maps/world.js", crossOrigin: "anonymous" }
            ],
            css: ["https://cdn.jsdelivr.net/npm/jsvectormap/dist/css/jsvectormap.min.css"]
        },
        Swiper: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js", crossOrigin: "anonymous" }],
            css: ["https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"]
        },
        Swal: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/sweetalert2@11", crossOrigin: "anonymous" }],
            css: ["https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"]
        },
        FullCalendar: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js", crossOrigin: "anonymous" }]
        },
        Cleave: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/cleave.js/dist/cleave.min.js", crossOrigin: "anonymous" }]
        },
        noUiSlider: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/nouislider/dist/nouislider.min.js", crossOrigin: "anonymous" }],
            css: ["https://cdn.jsdelivr.net/npm/nouislider/dist/nouislider.min.css"]
        },
        wNumb: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/wnumb/wNumb.min.js", crossOrigin: "anonymous" }]
        },
        FilePond: {
            js: [
                { src: "https://unpkg.com/filepond/dist/filepond.min.js", crossOrigin: "anonymous" },
                { src: "https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.js", crossOrigin: "anonymous" },
                { src: "https://unpkg.com/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.min.js", crossOrigin: "anonymous" },
                { src: "https://unpkg.com/filepond-plugin-image-exif-orientation/dist/filepond-plugin-image-exif-orientation.min.js", crossOrigin: "anonymous" },
                { src: "https://unpkg.com/filepond-plugin-file-encode/dist/filepond-plugin-file-encode.min.js", crossOrigin: "anonymous" }
            ],
            css: [
                "https://unpkg.com/filepond/dist/filepond.min.css",
                "https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css"
            ]
        },
        markdownit: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/markdown-it@15.0.3/dist/browser/markdown-it.umd.min.js", crossOrigin: "anonymous" }]
        },
        Prism: {
            js: [
                { src: "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/prism.min.js", crossOrigin: "anonymous" },
                { src: "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-bash.min.js", crossOrigin: "anonymous" },
                { src: "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-json.min.js", crossOrigin: "anonymous" },
                { src: "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-python.min.js", crossOrigin: "anonymous" },
                { src: "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-typescript.min.js", crossOrigin: "anonymous" },
                { src: "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/autoloader/prism-autoloader.min.js", crossOrigin: "anonymous" }
            ],
            css: ["https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism.min.css"]
        },
        AOS: {
            js: [{ src: "https://unpkg.com/aos@2.3.4/dist/aos.js", crossOrigin: "anonymous" }],
            css: ["https://unpkg.com/aos@2.3.4/dist/aos.css"]
        },
        Isotope: {
            js: [{ src: "https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js", crossOrigin: "anonymous" }]
        },
        particlesJS: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js", crossOrigin: "anonymous" }]
        },
        DomAutoscroller: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/dom-autoscroller", crossOrigin: "anonymous" }]
        },
        Chart: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/chart.js", crossOrigin: "anonymous" }]
        },
        echarts: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js", crossOrigin: "anonymous" }]
        },
        autoComplete: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/@tarekraafat/autocomplete.js@10.2.7/dist/autoComplete.min.js", crossOrigin: "anonymous" }],
            css: ["https://cdn.jsdelivr.net/npm/@tarekraafat/autocomplete.js@10.2.7/dist/css/autoComplete.01.min.css"]
        },
        Pickr: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js", crossOrigin: "anonymous" }],
            css: ["https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/classic.min.css"]
        },
        Shepherd: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/shepherd.js/dist/js/shepherd.min.js", crossOrigin: "anonymous" }],
            css: ["https://cdn.jsdelivr.net/npm/shepherd.js/dist/css/shepherd.css"]
        },
        GMaps: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/gmaps/gmaps.min.js", crossOrigin: "anonymous" }]
        },
        L: {
            js: [{ src: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", crossOrigin: "anonymous" }],
            css: ["https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"]
        },
        Masonry: {
            js: [{ src: "https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js", crossOrigin: "anonymous" }]
        },
        Anime: {
            js: [{ src: "https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js", crossOrigin: "anonymous" }]
        }
    },

    /**
     * @namespace projects
     * @description Standalone apps, environments, or platforms integrated with the Poly Repo CLI.
     * * The Poly Repo CLI merges the repo details from 'projects' and 'modules' 
     * to execute cross-repository actions seamlessly.
     * * @property {string} path - Local relative workspace path. Defines the workspace tree structure, determining where the repository is cloned.
     * @property {string} repo - Git repository URL.
     * @property {string[]} [exclude] - Array of strings used to exclude the project from specific CLI commands.
     */
    projects: {
        CoCreateWS: {
            path: "../CoCreate-app",
            repo: "https://github.com/cocreatejs/CoCreate-app.git",
            exclude: ["git"]
        }
    }
};
