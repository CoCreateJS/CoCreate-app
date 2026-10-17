export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d00ef3",
        "name": "Files",
        "singularName": "File",
        "path": "/apps/files",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "files",
        "category": "Workspace",
        "mainViews": [
            "table",
            "grid"
        ],
        "secondaryViews": [
            "details",
            "form"
        ],
        "icon": "/assets/svg/remix/file-2-line.svg",
        "description": "App to manage and track Files.",
        "status": "active",
        "fields": [
            {
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"file-name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Search file names\" filter-query=\"$document .list-view[]\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "<span class=\"files-record-name\" data-file-kind=\"{{object.content-type}}\"><a class=\"files-folder-link text-reset text-decoration-none\" role=\"button\" tabindex=\"0\" state=\"{&quot;files-folders&quot;:{&quot;hidden&quot;:false,&quot;array&quot;:&quot;files&quot;},&quot;files-list&quot;:{&quot;filter-query-key&quot;:&quot;content-type.$ne&quot;,&quot;filter-query-value&quot;:&quot;text/directory&quot;,&quot;filter-sort-key&quot;:&quot;name&quot;,&quot;filter-sort-direction&quot;:&quot;asc&quot;},&quot;files-path&quot;:{&quot;value&quot;:&quot;{{object.pathname}}&quot;}}\"><i src=\"/assets/svg/remix/folder-2-fill.svg\" class=\"me-2\" aria-hidden=\"true\"></i>{{object.name}}</a><a class=\"files-file-link text-reset text-decoration-none\" role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/files/app.html\" aria-controls=\"offcanvas-app\" aria-open><span hidden state-to=\"offcanvas-app-form\" state.array=\"files\" state.object=\"{{object._id}}\"></span><i src=\"/assets/svg/remix/file-line.svg\" class=\"me-2\" aria-hidden=\"true\"></i>{{object.name}}</a></span>",
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
                ],
                "key": "name"
            },
            {
                "label": "Type",
                "key": "content-type",
                "tagName": "input",
                "filterTemplate": "<select id=\"file-content-type-filter\" class=\"form-select\" filter-query=\"$document .list-view[]\" filter-query-key=\"content-type.$regex\"><option value=\"\">All types</option><option value=\"^image/\">Images</option><option value=\"^video/\">Videos</option><option value=\"^audio/\">Audio</option><option value=\"^application/pdf$\">PDF</option><option value=\"^text/directory$\">Folders</option><option value=\"^text/(?!directory$)\">Text</option><option value=\"^application/\">Applications / documents</option></select>",
                "tableTemplate": "{{object.content-type}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "file-content-type"
                    },
                    {
                        "name": "key",
                        "value": "content-type"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Size (bytes)",
                "key": "size",
                "tagName": "input",
                "filterTemplate": "<input id=\"file-size-filter\" class=\"form-control\" type=\"number\" placeholder=\"Filter size (bytes)\" filter-query=\"$document .list-view[]\" filter-query-key=\"size\" value-type=\"number\" />",
                "tableTemplate": "{{object.size}}",
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
                "label": "Folder",
                "key": "path",
                "tagName": "input",
                "filterTemplate": "<input id=\"file-path-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter folder\" filter-query=\"$document .list-view[]\" filter-query-key=\"path.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "<code>{{object.path}}</code>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "file-path"
                    },
                    {
                        "name": "key",
                        "value": "path"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Pathname",
                "key": "pathname",
                "tagName": "input",
                "filterTemplate": "<input id=\"file-pathname-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter pathname\" filter-query=\"$document .list-view[]\" filter-query-key=\"pathname.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "<code>{{object.pathname}}</code>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "file-pathname"
                    },
                    {
                        "name": "key",
                        "value": "pathname"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Modified",
                "key": "modified.on",
                "tagName": "input",
                "filterTemplate": "<input id=\"file-modified-on-filter\" class=\"form-control\" type=\"datetime-local\" placeholder=\"Filter modified\" filter-query=\"$document .list-view[]\" filter-query-key=\"modified.on.$gte\" />",
                "tableTemplate": "{{object.modified.on}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "file-modified-on"
                    },
                    {
                        "name": "key",
                        "value": "modified.on"
                    },
                    {
                        "name": "type",
                        "value": "datetime-local"
                    }
                ]
            }
        ],
        "cardTemplate": "/apps/files/templates/card.html"
    },
    "upsert": true
};
