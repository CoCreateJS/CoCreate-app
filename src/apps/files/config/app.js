export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d00ef3",
        "name": "Files",
        "singularName": "Files",
        "path": "/apps/files",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "files",
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
        "icon": "ri-file-2-line",
        "description": "App to manage and track Files.",
        "status": "active",
        "fields": [
            {
                "label": "File Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"file-name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter file name\" filter-query=\"$document .list-view\" filter-query-key=\"name\" />",
                "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/files/details.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"files\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object.name}}</span>\n\t\t\t\t\t</a>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "file-name"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter file name"
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
                "label": "Type",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"file-type-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"type\">\n\t\t\t\t\t\t<option value=\"\">Select Type</option>\n\t\t\t\t\t\t<option value=\"document\">Document</option>\n\t\t\t\t\t\t<option value=\"image\">Image</option>\n\t\t\t\t\t\t<option value=\"pdf\">PDF</option>\n\t\t\t\t\t\t<option value=\"spreadsheet\">Spreadsheet</option>\n\t\t\t\t\t\t<option value=\"video\">Video</option>\n\t\t\t\t\t\t<option value=\"audio\">Audio</option>\n\t\t\t\t\t\t<option value=\"archive\">Archive</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{type}}\n</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "file-type"
                    },
                    {
                        "name": "placeholder",
                        "value": "File type"
                    },
                    {
                        "name": "required",
                        "value": true
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
                                "value": "document"
                            }
                        ],
                        "innerText": "Document"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "image"
                            }
                        ],
                        "innerText": "Image"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "pdf"
                            }
                        ],
                        "innerText": "PDF"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "spreadsheet"
                            }
                        ],
                        "innerText": "Spreadsheet"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "video"
                            }
                        ],
                        "innerText": "Video"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "audio"
                            }
                        ],
                        "innerText": "Audio"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "archive"
                            }
                        ],
                        "innerText": "Archive"
                    }
                ]
            },
            {
                "label": "Size",
                "tagName": "input",
                "filterTemplate": "<input id=\"file-size-filter\" class=\"form-control\" type=\"number\" placeholder=\"File size in bytes\" filter-query=\"$document .list-view\" filter-query-key=\"size\" />",
                "tableTemplate": "{{object.size}} Bytes",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "file-size"
                    },
                    {
                        "name": "placeholder",
                        "value": "File size in bytes"
                    },
                    {
                        "name": "step",
                        "value": "1"
                    },
                    {
                        "name": "key",
                        "value": "size"
                    },
                    {
                        "name": "type",
                        "value": "number"
                    }
                ]
            },
            {
                "label": "Modified Date",
                "tagName": "input",
                "filterTemplate": "<input id=\"file-modified-filter\" class=\"form-control\" type=\"dat\" filter-query=\"$document .list-view\" filter-query-key=\"modified\" />",
                "tableTemplate": "{{object.modified}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "file-modified"
                    },
                    {
                        "name": "date-picker",
                        "value": "flatpickr"
                    },
                    {
                        "name": "placeholder",
                        "value": "Modified date"
                    },
                    {
                        "name": "key",
                        "value": "modified"
                    },
                    {
                        "name": "type",
                        "value": "dat"
                    }
                ]
            },
            {
                "label": "Status",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option template value=\"{{object.key}}\">{{object.label}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t\t<div array=\"files\" object=\"statuses\" render-query=\"$previous\"></div>\n\t\t\t\t",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "file-manager-status"
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
                                "name": "template",
                                "value": ""
                            },
                            {
                                "name": "value",
                                "value": "{{object.key}}"
                            }
                        ],
                        "innerText": "{{object.label}}"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"document\">Document</option>\n\t\t\t\t\t\t<option value=\"image\">Image</option>\n\t\t\t\t\t\t<option value=\"pdf\">PDF</option>\n\t\t\t\t\t\t<option value=\"spreadsheet\">Spreadsheet</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "\n\t\t\t\t\t<span array=\"files\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n\t\t\t\t\t\t<span template class=\"badge bg-primary-subtle text-primary me-1\">\n\t\t\t\t\t\t\t{{tags}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "file-manager-tags"
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
                                "value": "document"
                            }
                        ],
                        "innerText": "Document"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "image"
                            }
                        ],
                        "innerText": "Image"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "pdf"
                            }
                        ],
                        "innerText": "PDF"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "spreadsheet"
                            }
                        ],
                        "innerText": "Spreadsheet"
                    }
                ]
            },
            {
                "label": "Content Preview",
                "tagName": "textarea",
                "filterTemplate": "<input id=\"file-preview-filter\" class=\"form-control\" type=\"text\" placeholder=\"Content preview\" filter-query=\"$document .list-view\" filter-query-key=\"preview\" />",
                "tableTemplate": "{{object.preview}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "file-preview"
                    },
                    {
                        "name": "placeholder",
                        "value": "Content preview or description"
                    },
                    {
                        "name": "rows",
                        "value": "3"
                    },
                    {
                        "name": "key",
                        "value": "preview"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Statuses",
                "tagName": "select",
                "filterTemplate": "<select id=\"statuses-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"statuses\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option value=\"active\">Active</option>\n\t\t\t\t\t\t<option value=\"archived\">Archived</option>\n\t\t\t\t\t</select>",
                "tableTemplate": "<span render=\"object.statuses\" render-as=\"statuses\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{statuses}}\n</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "statuses"
                    },
                    {
                        "name": "key",
                        "value": "statuses"
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
                "filterTemplate": "<select id=\"type-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"type\">\n\t\t\t\t\t\t<option value=\"\">Select Type</option>\n\t\t\t\t\t\t<option value=\"file\">File</option>\n\t\t\t\t\t\t<option value=\"document\">Document</option>\n\t\t\t\t\t\t<option value=\"image\">Image</option>\n\t\t\t\t\t\t<option value=\"video\">Video</option>\n\t\t\t\t\t\t<option value=\"audio\">Audio</option>\n\t\t\t\t\t\t<option value=\"archive\">Archive</option>\n\t\t\t\t\t</select>",
                "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{type}}\n</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "type"
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
                                "value": "file"
                            }
                        ],
                        "innerText": "File"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "document"
                            }
                        ],
                        "innerText": "Document"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "image"
                            }
                        ],
                        "innerText": "Image"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "video"
                            }
                        ],
                        "innerText": "Video"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "audio"
                            }
                        ],
                        "innerText": "Audio"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "archive"
                            }
                        ],
                        "innerText": "Archive"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "filterTemplate": "<select id=\"tags-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"\">Select Tag</option>\n\t\t\t\t\t\t<option value=\"document\">Document</option>\n\t\t\t\t\t\t<option value=\"image\">Image</option>\n\t\t\t\t\t\t<option value=\"pdf\">PDF</option>\n\t\t\t\t\t\t<option value=\"spreadsheet\">Spreadsheet</option>\n\t\t\t\t\t</select>",
                "tableTemplate": "<span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{tags}}\n</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "tags"
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
                        "innerText": "Select Tag"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "document"
                            }
                        ],
                        "innerText": "Document"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "image"
                            }
                        ],
                        "innerText": "Image"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "pdf"
                            }
                        ],
                        "innerText": "PDF"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "spreadsheet"
                            }
                        ],
                        "innerText": "Spreadsheet"
                    }
                ]
            }
        ]
    },
    "upsert": true
};
