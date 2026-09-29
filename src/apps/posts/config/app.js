export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d00e99",
        "name": "Posts",
        "singularName": "Post",
        "path": "/apps/posts",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "posts",
        "category": "Marketing",
        "icon": "/assets/svg/remix/rss-line.svg",
        "description": "App to manage and track Posts.",
        "status": "active",
        "fields": [
            {
                "label": "Title",
                "tagName": "input",
                "filterTemplate": "<input id=\"title-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter post title\" filter-query=\"$document .list-view\" filter-query-key=\"title\" />",
                "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/posts/aside.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"posts\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object.title}}</span>\n\t\t\t\t\t</a>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "post-title-input"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter post title"
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
                        "value": "post-content"
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
                        "value": "post-featured-image-input"
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
                        "value": "post-author-input"
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
                "label": "Publish Status",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"publish_status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"publish_status\">\n\t\t\t\t\t\t<option value=\"Published\">Published</option>\n\t\t\t\t\t\t<option value=\"Draft\">Draft</option>\n\t\t\t\t\t\t<option value=\"Scheduled\">Scheduled</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "<span render=\"object.publish_status\" render-as=\"publish_status\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{publish_status}}\n    </span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "post-publish-status-input"
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
                            {
                                "name": "value",
                                "value": "Published"
                            }
                        ],
                        "innerText": "Published"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Draft"
                            }
                        ],
                        "innerText": "Draft"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Scheduled"
                            }
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
                        "value": "post-publish-date-input"
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
                "label": "Status",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option template value=\"{{object.key}}\">{{object.label}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t\t<div array=\"posts\" object=\"statuses\" render-query=\"$previous\"></div>\n\t\t\t\t",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "post-status"
                    },
                    {
                        "name": "key",
                        "value": "status"
                    }
                ],
                "options": [
                    {
                        "name": "draft",
                        "label": "Draft"
                    },
                    {
                        "name": "published",
                        "label": "Published"
                    },
                    {
                        "name": "scheduled",
                        "label": "Scheduled"
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
                                "value": "published"
                            }
                        ],
                        "innerText": "Published"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "scheduled"
                            }
                        ],
                        "innerText": "Scheduled"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"announcement\">Announcement</option>\n\t\t\t\t\t\t<option value=\"update\">Update</option>\n\t\t\t\t\t\t<option value=\"feature\">Feature</option>\n\t\t\t\t\t\t<option value=\"release\">Release</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "\n\t\t\t\t\t<span array=\"posts\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n\t\t\t\t\t\t<span template class=\"badge bg-primary-subtle text-primary me-1\">\n\t\t\t\t\t\t\t{{tags}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "post-tags"
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
                "options": [
                    {
                        "value": "announcement",
                        "label": "Announcement"
                    },
                    {
                        "value": "update",
                        "label": "Update"
                    },
                    {
                        "value": "feature",
                        "label": "Feature"
                    },
                    {
                        "value": "release",
                        "label": "Release"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "announcement"
                            }
                        ],
                        "innerText": "Announcement"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "update"
                            }
                        ],
                        "innerText": "Update"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "feature"
                            }
                        ],
                        "innerText": "Feature"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "release"
                            }
                        ],
                        "innerText": "Release"
                    }
                ]
            },
            {
                "label": "Type",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"type-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"type\">\n\t\t\t\t\t\t<option value=\"blog\">Blog Post</option>\n\t\t\t\t\t\t<option value=\"social\">Social Media Post</option>\n\t\t\t\t\t\t<option value=\"announcement\">Announcement</option>\n\t\t\t\t\t\t<option value=\"newsletter\">Newsletter</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{type}}\n    </span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "post-type"
                    },
                    {
                        "name": "multiple",
                        "value": false
                    },
                    {
                        "name": "key",
                        "value": "type"
                    }
                ],
                "options": [
                    {
                        "value": "blog",
                        "label": "Blog Post"
                    },
                    {
                        "value": "social",
                        "label": "Social Media Post"
                    },
                    {
                        "value": "announcement",
                        "label": "Announcement"
                    },
                    {
                        "value": "newsletter",
                        "label": "Newsletter"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "blog"
                            }
                        ],
                        "innerText": "Blog Post"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "social"
                            }
                        ],
                        "innerText": "Social Media Post"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "announcement"
                            }
                        ],
                        "innerText": "Announcement"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "newsletter"
                            }
                        ],
                        "innerText": "Newsletter"
                    }
                ]
            },
            {
                "label": "Media",
                "tagName": "input",
                "tableTemplate": "<img src=\"{{object.media.0}}\" alt=\"Media\" class=\"avatar-xs rounded\" />",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "post-media-input"
                    },
                    {
                        "name": "type",
                        "value": "file"
                    },
                    {
                        "name": "accept",
                        "value": "image/*,video/*"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "media"
                    },
                    {
                        "name": "type",
                        "value": "file"
                    }
                ]
            },
            {
                "label": "Caption",
                "tagName": "input",
                "tableTemplate": "{{object.caption}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "post-caption-input"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter caption"
                    },
                    {
                        "name": "key",
                        "value": "caption"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Hashtags",
                "tagName": "input",
                "tableTemplate": "{{object.hashtags}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "post-hashtags-input"
                    },
                    {
                        "name": "placeholder",
                        "value": "#hashtag"
                    },
                    {
                        "name": "key",
                        "value": "hashtags"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Mentions",
                "tagName": "input",
                "tableTemplate": "{{object.mentions}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "post-mentions-input"
                    },
                    {
                        "name": "placeholder",
                        "value": "@mention"
                    },
                    {
                        "name": "key",
                        "value": "mentions"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Location",
                "tagName": "input",
                "tableTemplate": "{{object.location}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "post-location-input"
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
                "label": "Link",
                "tagName": "input",
                "tableTemplate": "{{object.link}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "post-link-input"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter link"
                    },
                    {
                        "name": "key",
                        "value": "link"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Audience",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"audience-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"audience\">\n\t\t\t\t\t\t<option value=\"public\">Public</option>\n\t\t\t\t\t\t<option value=\"friends\">Friends</option>\n\t\t\t\t\t\t<option value=\"private\">Private</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "<span render=\"object.audience\" render-as=\"audience\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{audience}}\n    </span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "post-audience"
                    },
                    {
                        "name": "key",
                        "value": "audience"
                    }
                ],
                "options": [
                    {
                        "value": "public",
                        "label": "Public"
                    },
                    {
                        "value": "friends",
                        "label": "Friends"
                    },
                    {
                        "value": "private",
                        "label": "Private"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "public"
                            }
                        ],
                        "innerText": "Public"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "friends"
                            }
                        ],
                        "innerText": "Friends"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "private"
                            }
                        ],
                        "innerText": "Private"
                    }
                ]
            },
            {
                "label": "Reactions/Engagement",
                "tagName": "div",
                "tableTemplate": "\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<span class=\"me-2\">\n\t\t\t\t\t\t\t<i class=\"fas fa-thumbs-up\"></i> {{object.engagement.likes}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span class=\"me-2\">\n\t\t\t\t\t\t\t<i class=\"fas fa-comment\"></i> {{object.engagement.comments}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t<i class=\"fas fa-share\"></i> {{object.engagement.shares}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</div>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "id",
                        "value": "post-engagement"
                    },
                    {
                        "name": "key",
                        "value": "engagement"
                    },
                    {
                        "name": "type",
                        "value": "object"
                    }
                ]
            },
            {
                "label": "Scheduled Time",
                "tagName": "input",
                "filterTemplate": "<input id=\"scheduled_time-filter\" class=\"form-control\" type=\"datetime-local\" filter-query=\"$document .list-view\" filter-query-key=\"scheduled_time\" />",
                "tableTemplate": "{{object.scheduled_time}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "post-scheduled-time-input"
                    },
                    {
                        "name": "date-time-picker",
                        "value": "flatpickr"
                    },
                    {
                        "name": "placeholder",
                        "value": "Select scheduled time"
                    },
                    {
                        "name": "key",
                        "value": "scheduled_time"
                    },
                    {
                        "name": "type",
                        "value": "datetime"
                    }
                ]
            },
            {
                "label": "Networks",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"networks-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"networks\">\n\t\t\t\t\t\t<option value=\"facebook\">Facebook</option>\n\t\t\t\t\t\t<option value=\"twitter\">Twitter</option>\n\t\t\t\t\t\t<option value=\"instagram\">Instagram</option>\n\t\t\t\t\t\t<option value=\"linkedin\">LinkedIn</option>\n\t\t\t\t\t\t<option value=\"blog\">Blog</option>\n\t\t\t\t\t\t<option value=\"newsletter\">Newsletter</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "\n\t\t\t\t\t<span array=\"posts\" object=\"{{object._id}}\" key=\"networks\" render-query=\"[template]\">\n\t\t\t\t\t\t<span template class=\"badge bg-info-subtle text-info me-1\">\n\t\t\t\t\t\t\t{{networks}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "post-networks"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "networks"
                    }
                ],
                "options": [
                    {
                        "value": "facebook",
                        "label": "Facebook"
                    },
                    {
                        "value": "twitter",
                        "label": "Twitter"
                    },
                    {
                        "value": "instagram",
                        "label": "Instagram"
                    },
                    {
                        "value": "linkedin",
                        "label": "LinkedIn"
                    },
                    {
                        "value": "blog",
                        "label": "Blog"
                    },
                    {
                        "value": "newsletter",
                        "label": "Newsletter"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "facebook"
                            }
                        ],
                        "innerText": "Facebook"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "twitter"
                            }
                        ],
                        "innerText": "Twitter"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "instagram"
                            }
                        ],
                        "innerText": "Instagram"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "linkedin"
                            }
                        ],
                        "innerText": "LinkedIn"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "blog"
                            }
                        ],
                        "innerText": "Blog"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "newsletter"
                            }
                        ],
                        "innerText": "Newsletter"
                    }
                ]
            }
        ]
    },
    "upsert": true
};