export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d00ee6",
        "name": "API Keys",
        "singularName": "API Key",
        "path": "/apps/api-keys",
        "card": "/apps/api-keys/card.html",
        "cardTemplate": "/apps/api-keys/templates/card.html",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "keys",
        "category": "Settings",
        "icon": "ri-key-line",
        "description": "App to manage and track API Keys.",
        "status": "active",
        "fields": [
            {
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter Name\" filter-query=\"$document .list-view\" filter-query-key=\"name\" />",
                "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/api-keys/form.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n            <div state-to=\"offcanvas-app-form\" state.array=\"keys\" state.object=\"{{object._id}}\"> </div>\n            <span>{{object.name}}</span>\n          </a>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "api-key-name"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter name"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "name"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "API Key",
                "tagName": "input",
                "filterTemplate": "",
                "tableTemplate": "<span class=\"text-muted\">●●●●●●●●●●●●</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "api-key-value"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter API key"
                    },
                    {
                        "name": "readonly",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "key"
                    },
                    {
                        "name": "type",
                        "value": "password"
                    }
                ]
            },
            {
                "label": "Description",
                "tagName": "textarea",
                "filterTemplate": "<input id=\"api-key-description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter description\" filter-query=\"$document .list-view\" filter-query-key=\"description\" />",
                "tableTemplate": "{{object.description}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "api-key-description"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter description"
                    },
                    {
                        "name": "key",
                        "value": "description"
                    },
                    {
                        "name": "type",
                        "value": "textarea"
                    }
                ]
            },
            {
                "label": "Status",
                "tagName": "select",
                "filterTemplate": "\n          <select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n            <option value=\"\">Select Status</option>\n            <option template value=\"{{object.key}}\">{{object.label}}</option>\n          </select>\n          <div array=\"api_keys\" object=\"statuses\" render-query=\"$previous\"></div>\n        ",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "api-keys-status"
                    },
                    {
                        "name": "key",
                        "value": "status"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": ""
                            }
                        ],
                        "innerText": "Select Status"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "active"
                            }
                        ],
                        "innerText": "Active"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "inactive"
                            }
                        ],
                        "innerText": "Inactive"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "revoked"
                            }
                        ],
                        "innerText": "Revoked"
                    }
                ]
            },
            {
                "label": "Type",
                "tagName": "select",
                "filterTemplate": "<select id=\"type-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"type\"><option value=\"\">Select Type</option><option value=\"internal\">Internal</option><option value=\"external\">External</option><option value=\"test\">Test</option></select>",
                "tableTemplate": "{{object.type}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "api-keys-type"
                    },
                    {
                        "name": "key",
                        "value": "type"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": ""
                            }
                        ],
                        "innerText": "Select Type"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "internal"
                            }
                        ],
                        "innerText": "Internal"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "external"
                            }
                        ],
                        "innerText": "External"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "test"
                            }
                        ],
                        "innerText": "Test"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "filterTemplate": "\n          <select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n            <option value=\"internal\">Internal</option>\n            <option value=\"external\">External</option>\n            <option value=\"test\">Test</option>\n          </select>\n        ",
                "tableTemplate": "\n          <span array=\"api_keys\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n            <span template class=\"badge bg-primary-subtle text-primary me-1\">\n              {{tags}}\n            </span>\n          </span>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "api-keys-tags"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "tags"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "internal"
                            }
                        ],
                        "innerText": "Internal"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "external"
                            }
                        ],
                        "innerText": "External"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "test"
                            }
                        ],
                        "innerText": "Test"
                    }
                ]
            }
        ]
    },
    "upsert": true
};
