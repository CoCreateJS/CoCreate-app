export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d00ef9",
        "name": "Notes",
        "singularName": "Note",
        "path": "/apps/notes",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "notes",
        "icon": "ri-mail-line",
        "description": "App to manage and track Notes.",
        "status": "active",
        "fields": [
            {
                "label": "Title",
                "tagName": "input",
                "filterTemplate": "<input id=\"note-title-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter note title\" filter-query=\"$document .list-view\" filter-query-key=\"title\" />",
                "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/notes/details.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n              <div state-to=\"offcanvas-app-form\" state.array=\"notes\" state.object=\"{{object._id}}\"></div> \n              <span>{{object.name}}</span>\n          </a>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "note-title"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter note title"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "title"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Content",
                "tagName": "textarea",
                "filterTemplate": "<input id=\"note-content-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter note content\" filter-query=\"$document .list-view\" filter-query-key=\"content\" />",
                "tableTemplate": "{{object.content}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "note-content"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter note content"
                    },
                    {
                        "name": "key",
                        "value": "content"
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
                "filterTemplate": "\n          <select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n            <option value=\"\">Select Status</option>\n            <option template value=\"{{object.key}}\">{{object.label}}</option>\n          </select>\n          <div array=\"notes\" object=\"statuses\" render-query=\"$previous\"></div>\n        ",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "notes-status"
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
                                "value": "archived"
                            }
                        ],
                        "innerText": "Archived"
                    }
                ]
            },
            {
                "label": "Type",
                "tagName": "select",
                "filterTemplate": null,
                "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n       {{type}}\n     </span>",
                "attributes": [
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
                                "value": "notes"
                            }
                        ],
                        "innerText": "Notes"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "filterTemplate": "\n          <select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n            <option value=\"personal\">Personal</option>\n            <option value=\"work\">Work</option>\n            <option value=\"idea\">Idea</option>\n          </select>\n        ",
                "tableTemplate": "\n          <span array=\"notes\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n            <span template class=\"badge bg-primary-subtle text-primary me-1\">\n              {{tags}}\n            </span>\n          </span>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "notes-tags"
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
                                "value": "personal"
                            }
                        ],
                        "innerText": "Personal"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "work"
                            }
                        ],
                        "innerText": "Work"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "idea"
                            }
                        ],
                        "innerText": "Idea"
                    }
                ]
            }
        ]
    },
    "upsert": true
};