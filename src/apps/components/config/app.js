export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d60de5",
        "name": "Components",
        "singularName": "Component",
        "path": "/apps/components",
        "array": "components",
        "status": "active",
        "icon": "ri-tools-line",
        "description": "App to manage and track Components.",
        "fields": [
            {
                "label": "Component Name",
                "tagName": "input",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "component-name"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter component name"
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
                ],
                "tableTemplate": "<span>{{object.name}}</span>"
            },
            {
                "label": "Type",
                "tagName": "select",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "component-type"
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
                                "value": "ui"
                            }
                        ],
                        "innerText": "UI"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "backend"
                            }
                        ],
                        "innerText": "Backend"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "service"
                            }
                        ],
                        "innerText": "Service"
                    }
                ],
                "tableTemplate": "<span>{{object.type}}</span>"
            },
            {
                "label": "Status",
                "tagName": "select",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "component-status"
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
                                "value": "inactive"
                            }
                        ],
                        "innerText": "Inactive"
                    }
                ],
                "tableTemplate": "<span class=\"badge bg-primary-subtle text-primary\">{{object.status}}</span>"
            },
            {
                "label": "Tags",
                "tagName": "select",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "component-tags"
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
                                "value": "frontend"
                            }
                        ],
                        "innerText": "Frontend"
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
                                "value": "utility"
                            }
                        ],
                        "innerText": "Utility"
                    }
                ],
                "tableTemplate": "<span>{{object.tags}}</span>"
            },
            {
                "label": "Description",
                "tagName": "textarea",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "component-description"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter component description"
                    },
                    {
                        "name": "rows",
                        "value": 4
                    },
                    {
                        "name": "key",
                        "value": "description"
                    }
                ],
                "tableTemplate": "{{object.description}}"
            }
        ]
    },
    "upsert": true
};