export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d70dfb",
        "name": "Organization",
        "singularName": "Organization",
        "path": "/apps/organizations",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "organizations",
        "mainViews": [
            "table",
            "list"
        ],
        "secondaryViews": [
            "details",
            "form"
        ],
        "icon": "/assets/svg/remix/building-line.svg",
        "description": "App to manage and track Organizations.",
        "status": "active",
        "fields": [
            {
                "label": "Organization Name",
                "tagName": "input",
                "filterTemplate": "<input class=\"form-control\" placeholder=\"Filter by name\" />",
                "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/organizations/app.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"organizations\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object.name}}</span>\n\t\t\t\t\t</a>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter organization name"
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
                "label": "Contact Person",
                "tagName": "input",
                "filterTemplate": "<input class=\"form-control\" placeholder=\"Filter by contact person\" />",
                "tableTemplate": "{{object.contact_person}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter contact person"
                    },
                    {
                        "name": "key",
                        "value": "contact_person"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Email",
                "tagName": "input",
                "filterTemplate": "<input class=\"form-control\" placeholder=\"Filter by email\" />",
                "tableTemplate": "{{object.email}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter email address"
                    },
                    {
                        "name": "key",
                        "value": "email"
                    },
                    {
                        "name": "type",
                        "value": "email"
                    }
                ]
            },
            {
                "label": "Phone",
                "tagName": "input",
                "filterTemplate": "<input class=\"form-control\" placeholder=\"Filter by phone\" />",
                "tableTemplate": "{{object.phone}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter phone number"
                    },
                    {
                        "name": "key",
                        "value": "phone"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Address",
                "tagName": "textarea",
                "filterTemplate": "<textarea class=\"form-control\" placeholder=\"Filter by address\"></textarea>",
                "tableTemplate": "{{object.address}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter address"
                    },
                    {
                        "name": "key",
                        "value": "address"
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
                "filterTemplate": "\n          <select class=\"form-control\">\n            <option value=\"\">All</option>\n            <option value=\"active\">Active</option>\n            <option value=\"inactive\">Inactive</option>\n          </select>\n        ",
                "tableTemplate": "<span render=\"object.status\" render-as=\"status\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{object.status}}\n</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "status"
                    }
                ],
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
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": ""
                            }
                        ],
                        "innerText": "All"
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
                "tagName": "select",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "key",
                        "value": "type"
                    }
                ],
                "options": [
                    {
                        "name": "organization",
                        "label": "Organization"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "organization"
                            }
                        ],
                        "innerText": "Organization"
                    }
                ],
                "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{object.type}}\n</span>"
            },
            {
                "label": "Tags",
                "tagName": "select",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "key",
                        "value": "tags"
                    }
                ],
                "options": [
                    {
                        "name": "organization",
                        "label": "Organization"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "organization"
                            }
                        ],
                        "innerText": "Organization"
                    }
                ],
                "tableTemplate": "<span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{object.tags}}\n</span>"
            },
            {
                "label": "Created At",
                "tagName": "input",
                "filterTemplate": "<input type=\"datetime-local\" class=\"form-control\" />",
                "tableTemplate": "{{formatDate object.created_at}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "readonly",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "created_at"
                    },
                    {
                        "name": "type",
                        "value": "datetime"
                    }
                ]
            },
            {
                "label": "Updated At",
                "tagName": "input",
                "filterTemplate": "<input type=\"datetime-local\" class=\"form-control\" />",
                "tableTemplate": "{{formatDate object.updated_at}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "readonly",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "updated_at"
                    },
                    {
                        "name": "type",
                        "value": "datetime"
                    }
                ]
            }
        ]
    },
    "upsert": true
};