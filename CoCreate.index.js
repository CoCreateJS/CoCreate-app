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
            },
            {
                "src": "https://cdn.jsdelivr.net/npm/prismjs/plugins/autoloader/prism-autoloader.min.js",
                "crossOrigin": "anonymous"
            }
        ],
        "css": [
            "https://cdn.jsdelivr.net/npm/prismjs/themes/prism.min.css"
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

dependency('element-prototype', import(/*webpackChunkName: "element-prototype"*/ '@cocreate/element-prototype'));
dependency('observer', import(/*webpackChunkName: "observer"*/ '@cocreate/observer'));
dependency('utils', import(/*webpackChunkName: "utils"*/ '@cocreate/utils'));
lazyLoad('indexeddb', '[storage*="indexeddb"]', () => import(/*webpackChunkName: "indexeddb"*/ '@cocreate/indexeddb'));
lazyLoad('localstorage', '[storage*="localstorage"], [localstorage-set], [localstorage-get]', () => import(/*webpackChunkName: "localstorage"*/ '@cocreate/local-storage'));
dependency('config', import(/*webpackChunkName: "config"*/ '@cocreate/config'));
dependency('socket', import(/*webpackChunkName: "socket"*/ '@cocreate/socket-client'));
dependency('events', import(/*webpackChunkName: "events"*/ '@cocreate/events'));
lazyLoad('crud', '[crud="true"], [database], [array]', () => import(/*webpackChunkName: "crud"*/ '@cocreate/crud-client'));
lazyLoad('crdt', '[crdt="true"]', () => import(/*webpackChunkName: "crdt"*/ '@cocreate/crdt'));
lazyLoad('state', 'link[state_to][state_id][key], link[parse]', () => import(/*webpackChunkName: "state"*/ '@cocreate/state'));
dependency('link', import(/*webpackChunkName: "link"*/ '@cocreate/link'));
dependency('aria', import(/*webpackChunkName: "aria"*/ '@cocreate/aria'));
lazyLoad('cache', '[cache="true"]', () => import(/*webpackChunkName: "cache"*/ '@cocreate/cache'));
dependency('pwa', import(/*webpackChunkName: "pwa"*/ '@cocreate/pwa'));
dependency('organizations', import(/*webpackChunkName: "organizations"*/ '@cocreate/organizations'));
lazyLoad('cssParser', 'link[array][object][key], link[parse]', () => import(/*webpackChunkName: "cssParser"*/ '@cocreate/css-parser'));
lazyLoad('actions', '[actions]', () => import(/*webpackChunkName: "actions"*/ '@cocreate/actions'));
lazyLoad('filter', '[filter-query]', () => import(/*webpackChunkName: "filter"*/ '@cocreate/filter'));
lazyLoad('render', '[render], [render-query], [template], template', () => import(/*webpackChunkName: "render"*/ '@cocreate/render'));
lazyLoad('file', '[type="file"], [actions*="upload"], [actions*="download"], [actions*="saveLocally"], [actions*="import"], [actions*="export"], [actions*="createFile"], [actions*="deleteFile"], [actions*="createDirectory"], [actions*="deleteDirectory"]', () => import(/*webpackChunkName: "file"*/ '@cocreate/file'));
lazyLoad('elements', 'form, [src], [storage], [database], [array]', () => import(/*webpackChunkName: "elements"*/ '@cocreate/elements'));
lazyLoad('api', '[actions], [template_id]', () => import(/*webpackChunkName: "api"*/ '@cocreate/api'));
dependency('plugins', import(/*webpackChunkName: "plugins"*/ '@cocreate/plugins'));
lazyLoad('dnd', '[sortable], [cloneables], [draggable], [droppable], [cloneable]', () => import(/*webpackChunkName: "dnd"*/ '@cocreate/dnd'));
lazyLoad('position', '[positionable], [moveable], [position-query]', () => import(/*webpackChunkName: "position"*/ '@cocreate/position'));
lazyLoad('conditionalLogic', '[show], [hide]', () => import(/*webpackChunkName: "conditionalLogic"*/ '@cocreate/conditional-logic'));
lazyLoad('scroll', '[scroll], [scroll-to], [scrollable-x], [scrollable-y]', () => import(/*webpackChunkName: "scroll"*/ '@cocreate/scroll'));
lazyLoad('scrollbar', '[scrollbar]', () => import(/*webpackChunkName: "scrollbar"*/ '@cocreate/scrollbar'));
lazyLoad('resize', '[resize], [height="auto"]', () => import(/*webpackChunkName: "resize"*/ '@cocreate/resize'));
lazyLoad('clone', '[actions*="clone"]', () => import(/*webpackChunkName: "clone"*/ '@cocreate/clone'));
lazyLoad('remove', '[actions*="remove"]', () => import(/*webpackChunkName: "remove"*/ '@cocreate/remove'));
lazyLoad('attributes', '[attribute]', () => import(/*webpackChunkName: "attributes"*/ '@cocreate/attributes'));
lazyLoad('users', '[session], [actions*="signUp"], [actions*="signIn"], [actions*="signOut"], [user-status]', () => import(/*webpackChunkName: "users"*/ '@cocreate/users'));
lazyLoad('unique', '[unique]', () => import(/*webpackChunkName: "unique"*/ '@cocreate/unique'));
lazyLoad('search', '[search_id]', () => import(/*webpackChunkName: "search"*/ '@cocreate/search'));
lazyLoad('elementConfig', '[config-query]', () => import(/*webpackChunkName: "elementConfig"*/ '@cocreate/element-config'));
lazyLoad('validation', '[actions*="validate"], [required]', () => import(/*webpackChunkName: "validation"*/ '@cocreate/validation'));
lazyLoad('calculate', '[calculate]', () => import(/*webpackChunkName: "calculate"*/ '@cocreate/calculate'));
lazyLoad('selection', 'input, textarea, [contenteditable]', () => import(/*webpackChunkName: "selection"*/ '@cocreate/selection'));
lazyLoad('cursors', '[array][object][key][crdt="true"]', () => import(/*webpackChunkName: "cursors"*/ '@cocreate/cursors'));
lazyLoad('text', 'input, textarea, [contenteditable]', () => import(/*webpackChunkName: "text"*/ '@cocreate/text'));
lazyLoad('rich-text', '[actions*="nodeName"], [actions*="cloneElement"], [actions*="deleteElement"], [node-name]', () => import(/*webpackChunkName: "rich-text"*/ '@cocreate/rich-text'));
lazyLoad('codearea', '[type="code"]', () => import(/*webpackChunkName: "codearea"*/ '@cocreate/codearea'));
lazyLoad('clipboard', '[actions*="clipboard"], [clipboard-query]', () => import(/*webpackChunkName: "clipboard"*/ '@cocreate/clipboard'));
lazyLoad('print', '[actions*="print"], [print-query]', () => import(/*webpackChunkName: "print"*/ '@cocreate/print'));
lazyLoad('fullscreen', '[fullscreen]', () => import(/*webpackChunkName: "fullscreen"*/ '@cocreate/fullscreen'));
lazyLoad('speechSynthesis', '[speech-synthesis]', () => import(/*webpackChunkName: "speechSynthesis"*/ '@cocreate/speech-synthesis'));
lazyLoad('speechRecognition', '[speech-recognition]', () => import(/*webpackChunkName: "speechRecognition"*/ '@cocreate/speech-recognition'));
lazyLoad('progress', '[data-progress]', () => import(/*webpackChunkName: "progress"*/ '@cocreate/progress'));
lazyLoad('randomColor', '[background-color]', () => import(/*webpackChunkName: "randomColor"*/ '@cocreate/random-color'));
lazyLoad('socialShare', '[share-network]', () => import(/*webpackChunkName: "socialShare"*/ '@cocreate/social-share'));
lazyLoad('select', 'cocreate-select', () => import(/*webpackChunkName: "select"*/ '@cocreate/select'));
lazyLoad('toolbar', '[toolbar-query]', () => import(/*webpackChunkName: "toolbar"*/ '@cocreate/toolbar'));
lazyLoad('vdom', '[vdom-query], [vdom-id]', () => import(/*webpackChunkName: "vdom"*/ '@cocreate/vdom'));
lazyLoad('notification', '[actions*="notification"]', () => import(/*webpackChunkName: "notification"*/ '@cocreate/notification'));
