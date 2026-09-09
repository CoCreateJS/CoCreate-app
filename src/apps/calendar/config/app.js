export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d00ee8",
        "name": "Calendar",
        "singularName": "Event",
        "path": "/apps/calendar",
        "array": "calendar",
        "category": "Workspace",
        "mainViews": [
            "table",
            "grid",
            "kanban"
        ],
        "secondaryViews": [
            "details",
            "form"
        ],
        "icon": "ri-calendar-line",
        "description": "App to manage and track Calendar.",
        "status": "active",
        "fields": [
            {
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"calendar-title-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter event name\" filter-query=\"$document .list-view\" filter-query-key=\"name\" />",
                "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/calendar/details.html\" aria-controls=\"offcanvas-app\" aria-haspopup=\"dialog\" aria-open>\n            <div state-to=\"offcanvas-app-form\" state.array=\"calendar\" state.object=\"{{object._id}}\"></div>\n            <span>{{object.name}}</span>\n          </a>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "calendar-title-input"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter event title"
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
                "label": "Description",
                "tagName": "textarea",
                "filterTemplate": "<input id=\"calendar-description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter event description\" filter-query=\"$document .list-view\" filter-query-key=\"description\" />",
                "tableTemplate": "{{object.description}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "calendar-description-input"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter event description"
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
                "label": "Start Date",
                "tagName": "input",
                "filterTemplate": "<input id=\"calendar-start-date-filter\" class=\"form-control\" type=\"dat\" filter-query=\"$document .list-view\" filter-query-key=\"start_date\" />",
                "tableTemplate": "{{object.start_date}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "calendar-start-date-input"
                    },
                    {
                        "name": "date-picker",
                        "value": "flatpickr"
                    },
                    {
                        "name": "placeholder",
                        "value": "Select start date"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "start_date"
                    },
                    {
                        "name": "type",
                        "value": "dat"
                    }
                ]
            },
            {
                "label": "End Date",
                "tagName": "input",
                "filterTemplate": "<input id=\"calendar-end-date-filter\" class=\"form-control\" type=\"dat\" filter-query=\"$document .list-view\" filter-query-key=\"end_date\" />",
                "tableTemplate": "{{object.end_date}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "calendar-end-date-input"
                    },
                    {
                        "name": "date-picker",
                        "value": "flatpickr"
                    },
                    {
                        "name": "placeholder",
                        "value": "Select end date"
                    },
                    {
                        "name": "key",
                        "value": "end_date"
                    },
                    {
                        "name": "type",
                        "value": "dat"
                    }
                ]
            },
            {
                "label": "Location",
                "tagName": "input",
                "filterTemplate": "<input id=\"calendar-location-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter location\" filter-query=\"$document .list-view\" filter-query-key=\"location\" />",
                "tableTemplate": "{{object.location}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "calendar-location-input"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter location"
                    },
                    {
                        "name": "key",
                        "value": "location"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "All Day",
                "tagName": "input",
                "tableTemplate": "{{object.all_day ? 'Yes' : 'No'}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-check-input"
                    },
                    {
                        "name": "id",
                        "value": "calendar-all-day-input"
                    },
                    {
                        "name": "type",
                        "value": "checkbox"
                    },
                    {
                        "name": "key",
                        "value": "all_day"
                    },
                    {
                        "name": "type",
                        "value": "checkbox"
                    }
                ]
            },
            {
                "label": "Color",
                "tagName": "input",
                "filterTemplate": "<input id=\"calendar-color-filter\" class=\"form-control\" type=\"color\" filter-query=\"$document .list-view\" filter-query-key=\"color\" />",
                "tableTemplate": "\n          <span class=\"badge\" style=\"background-color: {{object.color}}; color: {{ object.color === '#000000' ? '#ffffff' : '#000000' }};\">\n            &#9724;\n          </span>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control form-control-color"
                    },
                    {
                        "name": "id",
                        "value": "calendar-color-input"
                    },
                    {
                        "name": "placeholder",
                        "value": "Event color"
                    },
                    {
                        "name": "type",
                        "value": "color"
                    },
                    {
                        "name": "value",
                        "value": "#000000"
                    },
                    {
                        "name": "key",
                        "value": "color"
                    },
                    {
                        "name": "type",
                        "value": "color"
                    }
                ]
            },
            {
                "label": "Status",
                "tagName": "select",
                "filterTemplate": "\n          <select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n            <option value=\"\">Select Status</option>\n            <option template value=\"{{object.key}}\">{{object.label}}</option>\n          </select>\n          <div array=\"calendar\" object=\"statuses\" render-query=\"$previous\"></div>\n        ",
                "tableTemplate": "<span render=\"object.status\" render-as=\"status\" template class=\"badge bg-primary-subtle text-primary me-1\">\n {{object.status}}\n</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "calendar-status"
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
                                "value": "scheduled"
                            }
                        ],
                        "innerText": "Scheduled"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "completed"
                            }
                        ],
                        "innerText": "Completed"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "cancelled"
                            }
                        ],
                        "innerText": "Cancelled"
                    }
                ]
            },
            {
                "label": "Type",
                "tagName": "select",
                "attributes": [
                    {
                        "name": "key",
                        "value": "type"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "calendar"
                            }
                        ],
                        "innerText": "Calendar"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "events"
                            }
                        ],
                        "innerText": "Events"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "filterTemplate": "\n          <select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n            <option value=\"meeting\">Meeting</option>\n            <option value=\"holiday\">Holiday</option>\n            <option value=\"reminder\">Reminder</option>\n            <option value=\"deadline\">Deadline</option>\n          </select>\n        ",
                "tableTemplate": "\n          <span array=\"calendar\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n            <span template class=\"badge bg-primary-subtle text-primary me-1\">\n              {{tags}}\n            </span>\n          </span>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "calendar-tags"
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
                                "value": "meeting"
                            }
                        ],
                        "innerText": "Meeting"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "holiday"
                            }
                        ],
                        "innerText": "Holiday"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "reminder"
                            }
                        ],
                        "innerText": "Reminder"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "deadline"
                            }
                        ],
                        "innerText": "Deadline"
                    }
                ]
            }
        ]
    },
    "upsert": true
};