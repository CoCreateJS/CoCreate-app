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
    "Choices": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css"
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
    "Quill": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.core.css",
            "https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css",
            "https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.bubble.css"
        ]
    },
    "ClassicEditor": {
        "js": [
            {
                "src": "https://cdn.ckeditor.com/ckeditor5/41.2.0/classic/ckeditor.js",
                "crossOrigin": "anonymous"
            }
        ]
    },
    "Dropzone": {
        "js": [
            {
                "src": "https://unpkg.com/dropzone@5/dist/min/dropzone.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://unpkg.com/dropzone@5/dist/min/dropzone.min.css"
        ]
    },
    "SimpleBar": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/simplebar@latest/dist/simplebar.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/simplebar@latest/dist/simplebar.css"
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
    "feather": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js",
                "crossOrigin": "anonymous"
            }
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
    "List": {
        "js": [
            {
                "src": "https://cdnjs.cloudflare.com/ajax/libs/list.js/2.3.1/list.min.js",
                "crossOrigin": "anonymous"
            },
            {
                "src": "https://cdnjs.cloudflare.com/ajax/libs/list.pagination.js/0.1.1/list.pagination.min.js",
                "crossOrigin": "anonymous"
            }
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
    "Grid": {
        "js": [
            {
                "src": "https://unpkg.com/gridjs/dist/gridjs.umd.js",
                "crossOrigin": "anonymous"
            },
            {
                "src": "https://unpkg.com/gridjs/plugins/selection/dist/selection.umd.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://unpkg.com/gridjs/dist/theme/mermaid.min.css"
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
    "Prism": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/prismjs/prism.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/prismjs/themes/prism.min.css"
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
    "dragula": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/dragula/dist/dragula.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/dragula/dist/dragula.min.css"
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
    "Card": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/card/dist/card.js",
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
    "Multi": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/multi.js/dist/multi.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/multi.js/dist/multi.min.css"
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
    "raterJs": {
        "js": [
            {
                "src": "https://cdn.jsdelivr.net/npm/rater-js/index.js",
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

dependency('element-prototype', import(/*webpackChunkName: "element-prototype-chunk"*/ '@cocreate/element-prototype'));
dependency('observer', import(/*webpackChunkName: "observer-chunk"*/ '@cocreate/observer'));
dependency('utils', import(/*webpackChunkName: "utils-chunk"*/ '@cocreate/utils'));
lazyLoad('indexeddb', '[storage*="indexeddb"]', () => import(/*webpackChunkName: "indexeddb-chunk"*/ '@cocreate/indexeddb'));
lazyLoad('localstorage', '[storage*="localstorage"], [localstorage-set], [localstorage-get]', () => import(/*webpackChunkName: "localstorage-chunk"*/ '@cocreate/local-storage'));
dependency('config', import(/*webpackChunkName: "config-chunk"*/ '@cocreate/config'));
dependency('socket', import(/*webpackChunkName: "socket-chunk"*/ '@cocreate/socket-client'));
dependency('events', import(/*webpackChunkName: "events-chunk"*/ '@cocreate/events'));
lazyLoad('crud', '[crud="true"], [database], [array]', () => import(/*webpackChunkName: "crud-chunk"*/ '@cocreate/crud-client'));
lazyLoad('crdt', '[crdt="true"]', () => import(/*webpackChunkName: "crdt-chunk"*/ '@cocreate/crdt'));
lazyLoad('state', 'link[state_to][state_id][key], link[parse]', () => import(/*webpackChunkName: "state-chunk"*/ '@cocreate/state'));
dependency('link', import(/*webpackChunkName: "link-chunk"*/ '@cocreate/link'));
dependency('aria', import(/*webpackChunkName: "aria-chunk"*/ '@cocreate/aria'));
lazyLoad('cache', '[cache="true"]', () => import(/*webpackChunkName: "cache-chunk"*/ '@cocreate/cache'));
dependency('pwa', import(/*webpackChunkName: "pwa-chunk"*/ '@cocreate/pwa'));
dependency('organizations', import(/*webpackChunkName: "organizations-chunk"*/ '@cocreate/organizations'));
lazyLoad('cssParser', 'link[array][object][key], link[parse]', () => import(/*webpackChunkName: "cssParser-chunk"*/ '@cocreate/css-parser'));
lazyLoad('actions', '[actions]', () => import(/*webpackChunkName: "actions-chunk"*/ '@cocreate/actions'));
lazyLoad('filter', '[filter-query]', () => import(/*webpackChunkName: "filter-chunk"*/ '@cocreate/filter'));
lazyLoad('render', '[render], [render-query], [template], template', () => import(/*webpackChunkName: "render-chunk"*/ '@cocreate/render'));
lazyLoad('file', '[type="file"], [actions*="upload"], [actions*="download"], [actions*="saveLocally"], [actions*="import"], [actions*="export"], [actions*="createFile"], [actions*="deleteFile"], [actions*="createDirectory"], [actions*="deleteDirectory"]', () => import(/*webpackChunkName: "file-chunk"*/ '@cocreate/file'));
lazyLoad('elements', 'form, [src], [storage], [database], [array]', () => import(/*webpackChunkName: "elements-chunk"*/ '@cocreate/elements'));
lazyLoad('api', '[actions], [template_id]', () => import(/*webpackChunkName: "api-chunk"*/ '@cocreate/api'));
dependency('plugins', import(/*webpackChunkName: "plugins-chunk"*/ '@cocreate/plugins'));
lazyLoad('dnd', '[sortable], [cloneables], [draggable], [droppable], [cloneable]', () => import(/*webpackChunkName: "dnd-chunk"*/ '@cocreate/dnd'));
lazyLoad('position', '[positionable], [moveable]', () => import(/*webpackChunkName: "position-chunk"*/ '@cocreate/position'));
lazyLoad('conditionalLogic', '[show], [hide]', () => import(/*webpackChunkName: "conditionalLogic-chunk"*/ '@cocreate/conditional-logic'));
lazyLoad('scroll', '[scroll], [scroll-to], [scrollable-x], [scrollable-y]', () => import(/*webpackChunkName: "scroll-chunk"*/ '@cocreate/scroll'));
lazyLoad('resize', '[resize], [height="auto"]', () => import(/*webpackChunkName: "resize-chunk"*/ '@cocreate/resize'));
lazyLoad('clone', '[actions*="clone"]', () => import(/*webpackChunkName: "clone-chunk"*/ '@cocreate/clone'));
lazyLoad('remove', '[actions*="remove"]', () => import(/*webpackChunkName: "remove-chunk"*/ '@cocreate/remove'));
lazyLoad('attributes', '[attribute]', () => import(/*webpackChunkName: "attributes-chunk"*/ '@cocreate/attributes'));
lazyLoad('users', '[session], [actions*="signUp"], [actions*="signIn"], [actions*="signOut"], [user-status]', () => import(/*webpackChunkName: "users-chunk"*/ '@cocreate/users'));
lazyLoad('unique', '[unique]', () => import(/*webpackChunkName: "unique-chunk"*/ '@cocreate/unique'));
lazyLoad('search', '[search_id]', () => import(/*webpackChunkName: "search-chunk"*/ '@cocreate/search'));
lazyLoad('elementConfig', '[config-query]', () => import(/*webpackChunkName: "elementConfig-chunk"*/ '@cocreate/element-config'));
lazyLoad('validation', '[actions*="validate"], [required]', () => import(/*webpackChunkName: "validation-chunk"*/ '@cocreate/validation'));
lazyLoad('calculate', '[calculate]', () => import(/*webpackChunkName: "calculate-chunk"*/ '@cocreate/calculate'));
lazyLoad('selection', 'input, textarea, [contenteditable]', () => import(/*webpackChunkName: "selection-chunk"*/ '@cocreate/selection'));
lazyLoad('cursors', 'input, textarea, [contenteditable]', () => import(/*webpackChunkName: "cursors-chunk"*/ '@cocreate/cursors'));
lazyLoad('text', 'input, textarea, [contenteditable]', () => import(/*webpackChunkName: "text-chunk"*/ '@cocreate/text'));
lazyLoad('rich-text', '[actions*="nodeName"], [actions*="cloneElement"], [actions*="deleteElement"], [node-name]', () => import(/*webpackChunkName: "rich-text-chunk"*/ '@cocreate/rich-text'));
lazyLoad('codearea', '[type="code"]', () => import(/*webpackChunkName: "codearea-chunk"*/ '@cocreate/codearea'));
lazyLoad('floatingLabel', 'floating-label, .floating-label', () => import(/*webpackChunkName: "floatingLabel-chunk"*/ '@cocreate/floating-label'));
lazyLoad('clipboard', '[actions*="clipboard"], [clipboard-query]', () => import(/*webpackChunkName: "clipboard-chunk"*/ '@cocreate/clipboard'));
lazyLoad('print', '[actions*="print"], [print-query]', () => import(/*webpackChunkName: "print-chunk"*/ '@cocreate/print'));
lazyLoad('fullscreen', '[fullscreen]', () => import(/*webpackChunkName: "fullscreen-chunk"*/ '@cocreate/fullscreen'));
lazyLoad('modal', '[actions*="Modal"]', () => import(/*webpackChunkName: "modal-chunk"*/ '@cocreate/modal'));
lazyLoad('parallax', '[parallax-src]', () => import(/*webpackChunkName: "parallax-chunk"*/ '@cocreate/parallax'));
lazyLoad('progress', '[data-progress]', () => import(/*webpackChunkName: "progress-chunk"*/ '@cocreate/progress'));
lazyLoad('randomColor', '[background-color]', () => import(/*webpackChunkName: "randomColor-chunk"*/ '@cocreate/random-color'));
lazyLoad('socialShare', '[share-network]', () => import(/*webpackChunkName: "socialShare-chunk"*/ '@cocreate/social-share'));
lazyLoad('select', 'cocreate-select', () => import(/*webpackChunkName: "select-chunk"*/ '@cocreate/select'));
lazyLoad('toolbar', '[toolbar-query]', () => import(/*webpackChunkName: "toolbar-chunk"*/ '@cocreate/toolbar'));
lazyLoad('vdom', '[vdom-query], [vdom-id]', () => import(/*webpackChunkName: "vdom-chunk"*/ '@cocreate/vdom'));
lazyLoad('notification', '[actions*="notification"]', () => import(/*webpackChunkName: "notification-chunk"*/ '@cocreate/notification'));
