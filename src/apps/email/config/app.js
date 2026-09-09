export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "6a96308f0bc023f23881e962",
        "name": "Email",
        "singularName": "Email",
        "path": "/apps/email",
        "array": "email",
        "category": "workspace",
        "icon": "ri-mail-line",
        "description": "App to manage and track Email.",
        "status": "active",
        "fields": [
            {
                "label": "To",
                "tagName": "input",
                "filterTemplate": "<input id=\"email-to-filter\" class=\"form-control\" type=\"email\" placeholder=\"Recipient email\" filter-query=\"$document .list-view\" filter-query-key=\"to\" />",
                "tableTemplate": "{{object.to}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "email-to"
                    },
                    {
                        "name": "placeholder",
                        "value": "Recipient email"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "to"
                    },
                    {
                        "name": "type",
                        "value": "email"
                    }
                ]
            },
            {
                "label": "Subject",
                "tagName": "input",
                "filterTemplate": "<input id=\"email-subject-filter\" class=\"form-control\" type=\"text\" placeholder=\"Subject\" filter-query=\"$document .list-view\" filter-query-key=\"subject\" />",
                "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/email/details.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"email\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object.subject}}</span>\n\t\t\t\t\t</a>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "email-subject"
                    },
                    {
                        "name": "placeholder",
                        "value": "Subject"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "subject"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Body",
                "tagName": "textarea",
                "filterTemplate": "<input id=\"email-body-filter\" class=\"form-control\" type=\"text\" placeholder=\"Email body\" filter-query=\"$document .list-view\" filter-query-key=\"body\" />",
                "tableTemplate": "{{object.body}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "email-body"
                    },
                    {
                        "name": "placeholder",
                        "value": "Email body"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "body"
                    },
                    {
                        "name": "type",
                        "value": "richtext"
                    }
                ]
            },
            {
                "label": "Sent Date",
                "tagName": "input",
                "filterTemplate": "<input id=\"email-sent-date-filter\" class=\"form-control\" type=\"datetime-local\" filter-query=\"$document .list-view\" filter-query-key=\"sent_date\" />",
                "tableTemplate": "{{object.sent_date}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "email-sent-date"
                    },
                    {
                        "name": "date-picker",
                        "value": "flatpickr"
                    },
                    {
                        "name": "placeholder",
                        "value": "Sent date"
                    },
                    {
                        "name": "key",
                        "value": "sent_date"
                    },
                    {
                        "name": "type",
                        "value": "datetime"
                    }
                ]
            },
            {
                "label": "Status",
                "tagName": "select",
                "options": "{{apps.email.statuses}}",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option template value=\"{{object.key}}\">{{object.label}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t\t<div array=\"email\" object=\"statuses\" render-query=\"$previous\"></div>\n\t\t\t\t",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "email-status"
                    },
                    {
                        "name": "key",
                        "value": "status"
                    }
                ],
                "children": []
            },
            {
                "label": "Tags",
                "options": [
                    {
                        "name": "inbox",
                        "label": "Inbox"
                    },
                    {
                        "name": "sent",
                        "label": "Sent"
                    },
                    {
                        "name": "spam",
                        "label": "Spam"
                    }
                ],
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"inbox\">Inbox</option>\n\t\t\t\t\t\t<option value=\"sent\">Sent</option>\n\t\t\t\t\t\t<option value=\"spam\">Spam</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "<span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{tags}}\n</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "email-tags"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "tags"
                    },
                    {
                        "name": "type",
                        "value": "multiselect"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "inbox"
                            }
                        ],
                        "innerText": "Inbox"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "sent"
                            }
                        ],
                        "innerText": "Sent"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "spam"
                            }
                        ],
                        "innerText": "Spam"
                    }
                ]
            },
            {
                "label": "Type",
                "tagName": "select",
                "options": [
                    {
                        "name": "communication",
                        "label": "Communication"
                    },
                    {
                        "name": "notification",
                        "label": "Notification"
                    }
                ],
                "attributes": [
                    {
                        "name": "key",
                        "value": "type"
                    },
                    {
                        "name": "type",
                        "value": "multiselect"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "communication"
                            }
                        ],
                        "innerText": "Communication"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "notification"
                            }
                        ],
                        "innerText": "Notification"
                    }
                ]
            },
            {
                "label": "Stage",
                "tagName": "select",
                "options": [
                    {
                        "name": "sent",
                        "label": "Sent"
                    },
                    {
                        "name": "draft",
                        "label": "Draft"
                    },
                    {
                        "name": "failed",
                        "label": "Failed"
                    }
                ],
                "attributes": [
                    {
                        "name": "key",
                        "value": "stage"
                    },
                    {
                        "name": "type",
                        "value": "select"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "sent"
                            }
                        ],
                        "innerText": "Sent"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "draft"
                            }
                        ],
                        "innerText": "Draft"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "failed"
                            }
                        ],
                        "innerText": "Failed"
                    }
                ]
            }
        ]
    },
    "upsert": true
};
