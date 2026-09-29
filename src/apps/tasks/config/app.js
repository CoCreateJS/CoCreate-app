export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d00f01",
        "name": "Tasks",
        "singularName": "Task",
        "path": "/apps/tasks",
        "card": "/apps/tasks/components/card.html",
        "cardTemplate": "/apps/tasks/templates/card.html",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "tasks",
        "category": "workspace",
        "icon": "/assets/svg/remix/task-line.svg",
        "description": "App to manage and track Tasks.",
        "status": "active",
        "fields": [
            {
                "label": "Task Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter task name\" filter-query=\"$document .list-view\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/tasks/aside.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"tasks\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object.name}}</span>\n\t\t\t\t\t</a>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "task-name-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter task name"
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
                "label": "Project",
                "tagName": "input",
                "filterTemplate": "<input id=\"project-name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter project name\" filter-query=\"$document .list-view\" filter-query-key=\"project_name.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.project_name}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "project-name-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter project name"
                    },
                    {
                        "name": "key",
                        "value": "project_name"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Due Date",
                "tagName": "input",
                "filterTemplate": "<input id=\"due-date-filter\" class=\"form-control\" type=\"dat\" filter-query=\"$document .list-view\" filter-query-key=\"dueDate\" />",
                "tableTemplate": "{{object.dueDate}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "due-date-field"
                    },
                    {
                        "name": "plugin",
                        "value": "flatpickr"
                    },
                    {
                        "name": "placeholder",
                        "value": "Select due date"
                    },
                    {
                        "name": "key",
                        "value": "dueDate"
                    },
                    {
                        "name": "type",
                        "value": "dat"
                    }
                ]
            },
            {
                "label": "Priority",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"priority-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"priority\">\n\t\t\t\t\t\t<option value=\"\">Select Priority</option>\n\t\t\t\t\t\t<option value=\"low\">Low</option>\n\t\t\t\t\t\t<option value=\"medium\">Medium</option>\n\t\t\t\t\t\t<option value=\"high\">High</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.priority}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "priority-field"
                    },
                    {
                        "name": "key",
                        "value": "priority"
                    }
                ]
            },
            {
                "label": "Description",
                "tagName": "textarea",
                "filterTemplate": "<input id=\"description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter task description\" filter-query=\"$document .list-view\" filter-query-key=\"description.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.description}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "description-field"
                    },
                    {
                        "name": "rows",
                        "value": 3
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter task description"
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
                "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option value=\"not-started\">Not Started</option>\n\t\t\t\t\t\t<option value=\"in-progress\">In Progress</option>\n\t\t\t\t\t\t<option value=\"completed\">Completed</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "status-field"
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
                                "value": "not-started"
                            }
                        ],
                        "innerText": "Not Started"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "in-progress"
                            }
                        ],
                        "innerText": "In Progress"
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
                    }
                ],
            },
            {
                "label": "Tags",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags.$in\">\n\t\t\t\t\t\t<option value=\"bug\">Bug</option>\n\t\t\t\t\t\t<option value=\"feature\">Feature</option>\n\t\t\t\t\t\t<option value=\"urgent\">Urgent</option>\n\t\t\t\t\t\t<option value=\"low-priority\">Low Priority</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "<span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{tags}}\n    </span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "tags-field"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "tags"
                    }
                ]
            }
        ]
    },
    "upsert": true
};
