export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d00eff",
        "name": "Settings",
        "singularName": "Setting",
        "path": "/apps/settings",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "settings",
        "mainViews": [
            "table",
            "details"
        ],
        "secondaryViews": [
            "form"
        ],
        "icon": "ri-settings-line",
        "description": "App to manage and track settings.",
        "status": "active",
        "fields": [
            {
                "label": "Key",
                "tagName": "input",
                "filterTemplate": "<input type=\"text\" class=\"form-control\" placeholder=\"Filter by key\" filter-query-key=\"key\" />",
                "tableTemplate": "{{object.key}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "settings-key"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter setting key"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "key"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Value",
                "tagName": "input",
                "filterTemplate": "<input type=\"text\" class=\"form-control\" placeholder=\"Filter by value\" filter-query-key=\"value\" />",
                "tableTemplate": "{{object.value}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "settings-value"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter setting value"
                    },
                    {
                        "name": "key",
                        "value": "value"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Description",
                "tagName": "textarea",
                "filterTemplate": "<input type=\"text\" class=\"form-control\" placeholder=\"Filter by description\" filter-query-key=\"description\" />",
                "tableTemplate": "{{object.description}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "settings-description"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter description for the setting"
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
                "label": "Category",
                "options": [
                    {
                        "value": "general",
                        "label": "General"
                    },
                    {
                        "value": "api",
                        "label": "API"
                    },
                    {
                        "value": "performance",
                        "label": "Performance"
                    }
                ],
                "tagName": "select",
                "filterTemplate": "<select class=\"form-control\" filter-query-key=\"category\"><option value=\"\">All Categories</option><option value=\"general\">General</option><option value=\"api\">API</option><option value=\"performance\">Performance</option></select>",
                "tableTemplate": "<span render=\"object.category\" render-as=\"category\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{category}}\n    </span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "settings-category"
                    },
                    {
                        "name": "key",
                        "value": "category"
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
                        "innerText": "All Categories"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "general"
                            }
                        ],
                        "innerText": "General"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "api"
                            }
                        ],
                        "innerText": "API"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "performance"
                            }
                        ],
                        "innerText": "Performance"
                    }
                ]
            },
            {
                "label": "Is Secret",
                "tagName": "checkbox",
                "filterTemplate": "<input type=\"checkbox\" class=\"form-check-input\" filter-query-key=\"isSecret\" />",
                "tableTemplate": "{{object.isSecret ? 'Yes' : 'No'}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-check-input"
                    },
                    {
                        "name": "id",
                        "value": "settings-isSecret"
                    },
                    {
                        "name": "key",
                        "value": "isSecret"
                    },
                    {
                        "name": "type",
                        "value": "boolean"
                    }
                ]
            },
            {
                "label": "Status",
                "options": [
                    {
                        "name": "active",
                        "label": "Active"
                    },
                    {
                        "name": "inactive",
                        "label": "Inactive"
                    }
                ],
                "tagName": "select",
                "filterTemplate": "<select class=\"form-control\" filter-query-key=\"status\"><option value=\"\">All Statuses</option><option value=\"active\">Active</option><option value=\"inactive\">Inactive</option></select>",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "settings-status"
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
                        "innerText": "All Statuses"
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
                    }
                ]
            },
            {
                "label": "Type",
                "options": [
                    {
                        "name": "configuration",
                        "label": "Configuration"
                    }
                ],
                "tagName": "select",
                "filterTemplate": "<select class=\"form-control\" filter-query-key=\"type\"><option value=\"\">All Types</option><option value=\"configuration\">Configuration</option></select>",
                "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{type}}\n    </span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "settings-type"
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
                        "innerText": "All Types"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "configuration"
                            }
                        ],
                        "innerText": "Configuration"
                    }
                ]
            },
            {
                "label": "Tags",
                "options": [
                    {
                        "name": "core",
                        "label": "Core"
                    },
                    {
                        "name": "utility",
                        "label": "Utility"
                    }
                ],
                "tagName": "select",
                "filterTemplate": "<select class=\"form-control\" filter-query-key=\"tags\"><option value=\"\">All Tags</option><option value=\"core\">Core</option><option value=\"utility\">Utility</option></select>",
                "tableTemplate": "<span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{tags}}\n    </span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "settings-tags"
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
                                "value": ""
                            }
                        ],
                        "innerText": "All Tags"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "core"
                            }
                        ],
                        "innerText": "Core"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "utility"
                            }
                        ],
                        "innerText": "Utility"
                    }
                ]
            }
        ]
    },
    "upsert": true
};