export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d00ee7",
        "name": "Blog",
        "singularName": "Blog Post",
        "path": "/apps/blog",
        "card": "/apps/blog/card.html",
        "cardTemplate": "/apps/blog/templates/card.html",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "posts",
        "category": "Marketing",
        "mainViews": [
            "table",
            "grid",
            "kanban"
        ],
        "secondaryViews": [
            "details",
            "form"
        ],
        "icon": "ri-rss-line",
        "description": "App to manage and track Blog.",
        "status": "active",
        "fields": [
            {
                "label": "Title",
                "tagName": "input",
                "filterTemplate": "<input id=\"title-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter blog title\" filter-query=\"$document .list-view\" filter-query-key=\"title\" />",
                "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" class=\"name\" state-to=\"offcanvas-app-view\" state.src=\"/apps/blog/details.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"blog\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object.title}}</span>\n\t\t\t\t\t</a>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "blog-title-input"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter blog title"
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
                "tagName": "div",
                "filterTemplate": "<input id=\"content-filter\" class=\"form-control\" type=\"text\" placeholder=\"Search content\" filter-query=\"$document .list-view\" filter-query-key=\"content\" />",
                "tableTemplate": "{{object.content}}",
                "attributes": [
                    {
                        "name": "editor",
                        "value": "ckeditor-classic"
                    },
                    {
                        "name": "id",
                        "value": "blog-content"
                    },
                    {
                        "name": "key",
                        "value": "content"
                    },
                    {
                        "name": "type",
                        "value": "html"
                    }
                ]
            },
            {
                "label": "Featured Image",
                "tagName": "input",
                "tableTemplate": "<img src=\"{{object.featured_image}}\" alt=\"Featured Image\" class=\"avatar-xs rounded\" />",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "blog-featured-image-input"
                    },
                    {
                        "name": "type",
                        "value": "file"
                    },
                    {
                        "name": "accept",
                        "value": "image/png, image/gif, image/jpeg"
                    },
                    {
                        "name": "key",
                        "value": "featured_image"
                    },
                    {
                        "name": "type",
                        "value": "file"
                    }
                ]
            },
            {
                "label": "Author",
                "tagName": "input",
                "filterTemplate": "<input id=\"author-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter author name\" filter-query=\"$document .list-view\" filter-query-key=\"author\" />",
                "tableTemplate": "{{object.author}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "blog-author-input"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter author name"
                    },
                    {
                        "name": "key",
                        "value": "author"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "input",
                "filterTemplate": "<input id=\"tags-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter tags\" filter-query=\"$document .list-view\" filter-query-key=\"tags\" />",
                "tableTemplate": "{{object.tags}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "blog-tags-input"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter comma-separated tags"
                    },
                    {
                        "name": "key",
                        "value": "tags"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Publish Status",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"publish_status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"publish_status\">\n\t\t\t\t\t\t<option value=\"\">All Statuses</option>\n\t\t\t\t\t\t<option value=\"Published\">Published</option>\n\t\t\t\t\t\t<option value=\"Draft\">Draft</option>\n\t\t\t\t\t\t<option value=\"Scheduled\">Scheduled</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "<span render=\"object.publish_status\" render-as=\"publish_status\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{publish_status}}\n    </span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "blog-publish-status-input"
                    },
                    {
                        "name": "key",
                        "value": "publish_status"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "" }
                        ],
                        "innerText": "All Statuses"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "Published" }
                        ],
                        "innerText": "Published"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "Draft" }
                        ],
                        "innerText": "Draft"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "Scheduled" }
                        ],
                        "innerText": "Scheduled"
                    }
                ]
            },
            {
                "label": "Publish Date",
                "tagName": "input",
                "filterTemplate": "<input id=\"publish_date-filter\" class=\"form-control\" type=\"dat\" filter-query=\"$document .list-view\" filter-query-key=\"publish_date\" />",
                "tableTemplate": "{{object.publish_date}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "blog-publish-date-input"
                    },
                    {
                        "name": "date-picker",
                        "value": "flatpickr"
                    },
                    {
                        "name": "placeholder",
                        "value": "Select publish date"
                    },
                    {
                        "name": "key",
                        "value": "publish_date"
                    },
                    {
                        "name": "type",
                        "value": "dat"
                    }
                ]
            },
            {
                "label": "App Status",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option template value=\"{{object.key}}\">{{object.label}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t\t<div array=\"blog\" object=\"statuses\" render-query=\"$previous\"></div>\n\t\t\t\t",
                "tableTemplate": "{{object.status}}</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "blog-status"
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
                            { "name": "value", "value": "" }
                        ],
                        "innerText": "Select Status"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "draft" }
                        ],
                        "innerText": "Draft"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "published" }
                        ],
                        "innerText": "Published"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "scheduled" }
                        ],
                        "innerText": "Scheduled"
                    }
                ]
            },
            {
                "label": "Categories",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"categories-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"categories\">\n\t\t\t\t\t\t<option value=\"news\">News</option>\n\t\t\t\t\t\t<option value=\"update\">Update</option>\n\t\t\t\t\t\t<option value=\"feature\">Feature</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "\n\t\t\t\t\t<span array=\"blog\" object=\"{{object._id}}\" key=\"categories\" render-query=\"[template]\">\n\t\t\t\t\t\t<span template class=\"badge bg-primary-subtle text-primary me-1\">\n\t\t\t\t\t\t\t{{categories}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "blog-categories"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "categories"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "news" }
                        ],
                        "innerText": "News"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "update" }
                        ],
                        "innerText": "Update"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "feature" }
                        ],
                        "innerText": "Feature"
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
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "content" }
                        ],
                        "innerText": "Content"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "article" }
                        ],
                        "innerText": "Article"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "attributes": [
                    {
                        "name": "key",
                        "value": "tags"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "announcement" }
                        ],
                        "innerText": "Announcement"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "update" }
                        ],
                        "innerText": "Update"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "feature" }
                        ],
                        "innerText": "Feature"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "value", "value": "release" }
                        ],
                        "innerText": "Release"
                    }
                ]
            }
        ]
    },
    "upsert": true
};
