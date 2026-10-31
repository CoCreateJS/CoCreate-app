import { dependency, lazyLoad } from '@cocreate/lazy-loader';

if (typeof window !== 'undefined') {
    window.CoCreateConfig = window.CoCreateConfig || {};
    window.CoCreateConfig.plugins = Object.assign(
        {},
        window.CoCreateConfig.plugins || {},
        {
    "Toastify": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/toastify-js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"
        ]
    },
    "flatpickr": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/flatpickr",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css"
        ]
    },
    "GLightbox": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css"
        ]
    },
    "FgEmojiPicker": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/fg-emoji-picker/fgEmojiPicker.js",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "bootstrap": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "Waves": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/node-waves/dist/waves.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/node-waves/dist/waves.min.css"
        ]
    },
    "ApexCharts": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/apexcharts",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "jsVectorMap": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/jsvectormap",
                "crossOrigin": "anonymous"
            },
            {
                "src": "https://cdn.jsdelivr.net/npm/jsvectormap/dist/maps/world.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/jsvectormap/dist/css/jsvectormap.min.css"
        ]
    },
    "Swiper": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css"
        ]
    },
    "Swal": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/sweetalert2@11",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css"
        ]
    },
    "FullCalendar": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/fullcalendar@6.1.15/index.global.min.js",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "Cleave": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/cleave.js/dist/cleave.min.js",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "noUiSlider": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/nouislider/dist/nouislider.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/nouislider/dist/nouislider.min.css"
        ]
    },
    "wNumb": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/wnumb/wNumb.min.js",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "FilePond": {
        "js": [
            {
                "src": "https://unpkg.com/filepond/dist/filepond.min.js",
                "crossOrigin": "anonymous"
            },
            {
                "src": "https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.js",
                "crossOrigin": "anonymous"
            },
            {
                "src": "https://unpkg.com/filepond-plugin-file-validate-size/dist/filepond-plugin-file-validate-size.min.js",
                "crossOrigin": "anonymous"
            },
            {
                "src": "https://unpkg.com/filepond-plugin-image-exif-orientation/dist/filepond-plugin-image-exif-orientation.min.js",
                "crossOrigin": "anonymous"
            },
            {
                "src": "https://unpkg.com/filepond-plugin-file-encode/dist/filepond-plugin-file-encode.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://unpkg.com/filepond/dist/filepond.min.css",
            "https://unpkg.com/filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css"
        ]
    },
    "markdownit": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/markdown-it@15.0.3/dist/browser/markdown-it.umd.min.js",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "Prism": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/prism.min.js",
                "crossOrigin": "anonymous"
            },
            {
                "src": "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-bash.min.js",
                "crossOrigin": "anonymous"
            },
            {
                "src": "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-json.min.js",
                "crossOrigin": "anonymous"
            },
            {
                "src": "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-python.min.js",
                "crossOrigin": "anonymous"
            },
            {
                "src": "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-typescript.min.js",
                "crossOrigin": "anonymous"
            },
            {
                "src": "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/autoloader/prism-autoloader.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism.min.css"
        ]
    },
    "AOS": {
        "js": [
            {
                "src": "https://unpkg.com/aos@2.3.4/dist/aos.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://unpkg.com/aos@2.3.4/dist/aos.css"
        ]
    },
    "Isotope": {
        "js": [
            {
                "src": "https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "particlesJS": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "DomAutoscroller": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/dom-autoscroller",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "Chart": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/chart.js",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "echarts": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/echarts/dist/echarts.min.js",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "autoComplete": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/@tarekraafat/autocomplete.js@10.2.7/dist/autoComplete.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/@tarekraafat/autocomplete.js@10.2.7/dist/css/autoComplete.01.min.css"
        ]
    },
    "Pickr": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/classic.min.css"
        ]
    },
    "Shepherd": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/shepherd.js/dist/js/shepherd.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/shepherd.js/dist/css/shepherd.css"
        ]
    },
    "GMaps": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/gmaps/gmaps.min.js",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "L": {
        "js": [
            {
                "src": "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        ]
    },
    "Masonry": {
        "js": [
            {
                "src": "https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "Anime": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js",
                "crossOrigin": "anonymous"
            }
        ]
    }
}
    );
}

dependency("serviceWorker", import(/* webpackChunkName: "serviceWorker" */ "@cocreate/service-worker"));
dependency("element-prototype", import(/* webpackChunkName: "element-prototype" */ "@cocreate/element-prototype"));
dependency("observer", import(/* webpackChunkName: "observer" */ "@cocreate/observer"));
dependency("indexeddb", import(/* webpackChunkName: "indexeddb" */ "@cocreate/indexeddb"));
dependency("config", import(/* webpackChunkName: "config" */ "@cocreate/config"));
dependency("socket", import(/* webpackChunkName: "socket" */ "@cocreate/socket-client"));
dependency("events", import(/* webpackChunkName: "events" */ "@cocreate/events"));
dependency("aria", import(/* webpackChunkName: "aria" */ "@cocreate/aria"));
lazyLoad("localstorage", "[storage*='localstorage'], [localstorage-set], [localstorage-get]", () => import(/* webpackChunkName: "localstorage" */ "@cocreate/local-storage"));
lazyLoad("crud", "[crud='true'], [database], [array]", () => import(/* webpackChunkName: "crud" */ "@cocreate/crud-client"));
lazyLoad("state", "[state-to], [state-id]", () => import(/* webpackChunkName: "state" */ "@cocreate/state"));
lazyLoad("cache", "[cache='true']", () => import(/* webpackChunkName: "cache" */ "@cocreate/cache"));
lazyLoad("plugins", "[plugins]", () => import(/* webpackChunkName: "plugins" */ "@cocreate/plugins"));
lazyLoad("crdt", "[crdt='true']", () => import(/* webpackChunkName: "crdt" */ "@cocreate/crdt"));
lazyLoad("cursors", "input[crdt='true'], textarea[crdt='true'], [contenteditable][crdt='true']", () => import(/* webpackChunkName: "cursors" */ "@cocreate/cursors"));
lazyLoad("editor", "[editor], code[language], [contenteditable][crdt='true'], input[crdt='true'], textarea[crdt='true'], iframe[crdt='true']", () => import(/* webpackChunkName: "editor" */ "@cocreate/editor"));
lazyLoad("cssParser", "link[array][object][key], link[parse]", () => import(/* webpackChunkName: "cssParser" */ "@cocreate/css-parser"));
lazyLoad("actions", "[actions]", () => import(/* webpackChunkName: "actions" */ "@cocreate/actions"));
lazyLoad("filter", "[filter-query]", () => import(/* webpackChunkName: "filter" */ "@cocreate/filter"));
lazyLoad("render", "[render], [render-query], [template], template", () => import(/* webpackChunkName: "render" */ "@cocreate/render"));
lazyLoad("file", "[type='file'], [actions*='upload'], [actions*='download'], [actions*='saveLocally'], [actions*='import'], [actions*='export'], [actions*='createFile'], [actions*='deleteFile'], [actions*='createDirectory'], [actions*='deleteDirectory']", () => import(/* webpackChunkName: "file" */ "@cocreate/file"));
lazyLoad("elements", "form, [src], [storage], [database], [array], [href], [target], [actions*='disableHref'], [actions*='enableHref']", () => import(/* webpackChunkName: "elements" */ "@cocreate/elements"));
lazyLoad("workflows", "[workflow]", () => import(/* webpackChunkName: "workflows" */ "@cocreate/workflows"));
lazyLoad("api", "[actions], [template_id]", () => import(/* webpackChunkName: "api" */ "@cocreate/api"));
lazyLoad("position", "[draggable], [draggable-query], [clonable-query], [droppable-query], [position-target], [position-query]", () => import(/* webpackChunkName: "position" */ "@cocreate/position"));
lazyLoad("scroll", "[scroll], [scroll-to], [scrollable-x], [scrollable-y]", () => import(/* webpackChunkName: "scroll" */ "@cocreate/scroll"));
lazyLoad("scrollbar", "[scrollbar]", () => import(/* webpackChunkName: "scrollbar" */ "@cocreate/scrollbar"));
lazyLoad("resize", "[resize], [height='auto']", () => import(/* webpackChunkName: "resize" */ "@cocreate/resize"));
lazyLoad("organizations", "[actions*='createOrganization'], [actions*='createEnvironments']", () => import(/* webpackChunkName: "organizations" */ "@cocreate/organizations"));
lazyLoad("users", "[session], [actions*='signUp'], [actions*='signIn'], [actions*='inviteUser'], [actions*='acceptInvite'], [actions*='forgotPassword'], [actions*='resetPassword'], [actions*='signOut'], [user-status]", () => import(/* webpackChunkName: "users" */ "@cocreate/users"));
lazyLoad("search", "[search-query]", () => import(/* webpackChunkName: "search" */ "@cocreate/search"));
lazyLoad("clipboard", "[actions*='clipboard'], [clipboard], [clipboard-query]", () => import(/* webpackChunkName: "clipboard" */ "@cocreate/clipboard"));
lazyLoad("print", "[actions*='print'], [print-query]", () => import(/* webpackChunkName: "print" */ "@cocreate/print"));
lazyLoad("fullscreen", "[fullscreen]", () => import(/* webpackChunkName: "fullscreen" */ "@cocreate/fullscreen"));
lazyLoad("pwa", "[actions*='install']", () => import(/* webpackChunkName: "pwa" */ "@cocreate/pwa"));
lazyLoad("notification", "[actions*='notification']", () => import(/* webpackChunkName: "notification" */ "@cocreate/notification"));
lazyLoad("geolocation", "[actions*='geoLocation']", () => import(/* webpackChunkName: "geolocation" */ "@cocreate/geolocation"));
lazyLoad("speechRecognition", "[speech-recognition]", () => import(/* webpackChunkName: "speechRecognition" */ "@cocreate/speech-recognition"));
lazyLoad("speechSynthesis", "[speech-synthesis]", () => import(/* webpackChunkName: "speechSynthesis" */ "@cocreate/speech-synthesis"));
lazyLoad("webShare", "[share], [actions*='share']", () => import(/* webpackChunkName: "webShare" */ "@cocreate/web-share"));
lazyLoad("contactPicker", "[actions*='getContacts']", () => import(/* webpackChunkName: "contactPicker" */ "@cocreate/contact-picker"));
lazyLoad("wakeLock", "[wake-lock], [actions*='wakeLock']", () => import(/* webpackChunkName: "wakeLock" */ "@cocreate/wake-lock"));
lazyLoad("validation", "[actions*='validate'], [required]", () => import(/* webpackChunkName: "validation" */ "@cocreate/validation"));
