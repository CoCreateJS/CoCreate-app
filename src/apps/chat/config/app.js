export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d00eeb",
        "name": "Chat",
        "singularName": "Chat",
        "path": "/apps/chat",
        "array": "chats",
        "category": "Workspace",
        "mainViews": [
            "table",
            "kanban"
        ],
        "secondaryViews": [
            "details",
            "form"
        ],
        "fields": [
            {
                "label": "Title",
                "tagName": "input",
                "filterTemplate": "<input id=\"title-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter title\" filter-query=\"$document .list-view\" filter-query-key=\"title.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.title}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "chat-title-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter chat title"
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
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter name\" filter-query=\"$document .list-view\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.name}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "chat-name-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter chat name"
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
                "label": "Type",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"type-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"type\">\n\t\t\t\t\t\t<option value=\"\">All Types</option>\n\t\t\t\t\t\t<option value=\"direct\">Direct</option>\n\t\t\t\t\t\t<option value=\"group\">Group</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.type}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "chat-type-field"
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
                                "value": "direct"
                            }
                        ],
                        "innerText": "Direct"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "group"
                            }
                        ],
                        "innerText": "Group"
                    }
                ]
            },
            {
                "label": "Participants",
                "tagName": "textarea",
                "filterTemplate": "<input id=\"participants-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter participants\" filter-query=\"$document .list-view\" filter-query-key=\"participants.$in\" />",
                "tableTemplate": "{{object.participants}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "chat-participants-field"
                    },
                    {
                        "name": "rows",
                        "value": 2
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter participant ids"
                    },
                    {
                        "name": "key",
                        "value": "participants"
                    },
                    {
                        "name": "type",
                        "value": "textarea"
                    }
                ]
            },
            {
                "label": "Last Message ID",
                "tagName": "input",
                "filterTemplate": "<input id=\"last-message-id-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter last message id\" filter-query=\"$document .list-view\" filter-query-key=\"last_message_id.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.last_message_id}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "chat-last-message-id-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter last message id"
                    },
                    {
                        "name": "key",
                        "value": "last_message_id"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Muted",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"muted-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"settings.muted\">\n\t\t\t\t\t\t<option value=\"\">All</option>\n\t\t\t\t\t\t<option value=\"true\">Muted</option>\n\t\t\t\t\t\t<option value=\"false\">Unmuted</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.settings.muted}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "chat-muted-field"
                    },
                    {
                        "name": "key",
                        "value": "settings.muted"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "false"
                            }
                        ],
                        "innerText": "Unmuted"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "true"
                            }
                        ],
                        "innerText": "Muted"
                    }
                ]
            },
            {
                "label": "Archived",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"archived-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"settings.archived\">\n\t\t\t\t\t\t<option value=\"\">All</option>\n\t\t\t\t\t\t<option value=\"true\">Archived</option>\n\t\t\t\t\t\t<option value=\"false\">Active</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.settings.archived}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "chat-archived-field"
                    },
                    {
                        "name": "key",
                        "value": "settings.archived"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "false"
                            }
                        ],
                        "innerText": "Active"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "true"
                            }
                        ],
                        "innerText": "Archived"
                    }
                ]
            },
            {
                "label": "Is Public",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"is-public-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"settings.is_public\">\n\t\t\t\t\t\t<option value=\"\">All</option>\n\t\t\t\t\t\t<option value=\"true\">Public</option>\n\t\t\t\t\t\t<option value=\"false\">Private</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.settings.is_public}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "chat-is-public-field"
                    },
                    {
                        "name": "key",
                        "value": "settings.is_public"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "false"
                            }
                        ],
                        "innerText": "Private"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "true"
                            }
                        ],
                        "innerText": "Public"
                    }
                ]
            },
            {
                "label": "Theme",
                "tagName": "input",
                "filterTemplate": "<input id=\"theme-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter theme\" filter-query=\"$document .list-view\" filter-query-key=\"settings.theme.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.settings.theme}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "chat-theme-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter theme"
                    },
                    {
                        "name": "key",
                        "value": "settings.theme"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Related",
                "tagName": "textarea",
                "filterTemplate": "<input id=\"related-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter related ids\" filter-query=\"$document .list-view\" filter-query-key=\"related.id.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.related}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "chat-related-field"
                    },
                    {
                        "name": "rows",
                        "value": 2
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter related references"
                    },
                    {
                        "name": "key",
                        "value": "related"
                    },
                    {
                        "name": "type",
                        "value": "textarea"
                    }
                ]
            },
            {
                "label": "Created On",
                "tagName": "input",
                "filterTemplate": "<input id=\"created-on-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter created date\" filter-query=\"$document .list-view\" filter-query-key=\"created.on\" />",
                "tableTemplate": "{{object.created.on}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "chat-created-on-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter created date"
                    },
                    {
                        "name": "key",
                        "value": "created.on"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Created By",
                "tagName": "input",
                "filterTemplate": "<input id=\"created-by-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter creator id\" filter-query=\"$document .list-view\" filter-query-key=\"created.by.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.created.by}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "chat-created-by-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter creator id"
                    },
                    {
                        "name": "key",
                        "value": "created.by"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Modified On",
                "tagName": "input",
                "filterTemplate": "<input id=\"modified-on-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter modified date\" filter-query=\"$document .list-view\" filter-query-key=\"modified.on\" />",
                "tableTemplate": "{{object.modified.on}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "chat-modified-on-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter modified date"
                    },
                    {
                        "name": "key",
                        "value": "modified.on"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Modified By",
                "tagName": "input",
                "filterTemplate": "<input id=\"modified-by-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter modifier id\" filter-query=\"$document .list-view\" filter-query-key=\"modified.by.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.modified.by}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "chat-modified-by-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter modifier id"
                    },
                    {
                        "name": "key",
                        "value": "modified.by"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            }
        ],
        "icon": "ri-chat-3-line",
        "description": "App to manage and track Chat.",
        "status": "active"
    },
    "upsert": true
};
