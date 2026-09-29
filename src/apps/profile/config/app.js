export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d00efd",
        "name": "Profile",
        "singularName": "Profile",
        "path": "/apps/profile",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "contacts",
        "icon": "/assets/svg/remix/contacts-line.svg",
        "description": "App to manage and track Profile.",
        "status": "active",
        "fields": [
            {
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input class=\"form-control\" placeholder=\"Filter by name\" filter-query=\"$document .list-view\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "\n        <a\n          role=\"button\"\n          tabindex=\"0\"\n          class=\"d-flex align-items-center\"\n          state-to=\"offcanvas-app\"\n          state.object=\"68741e1d07a037d0d6d00efd\"\n          aria-controls=\"offcanvas-app\"\n          aria-open\n          aria-haspopup=\"dialog\"\n          aria-expanded=\"false\">\n          <div state-to=\"offcanvas-app-view\" state.src=\"/apps/profile/aside.html\"></div>\n          <div state-to=\"offcanvas-app-form\" state.array=\"contacts\" state.object=\"{{object._id}}\"></div>\n          <div class=\"avatar-xs rounded-circle position-relative overflow-hidden flex-shrink-0\">\n            <div class=\"avatar-title bg-secondary-subtle text-secondary material-shadow\">\n              <span class=\"avatar-initial\">{{object.first_name[0]}}</span>\n              <img\n                class=\"position-absolute object-fit-cover\"\n                src=\"{{object.avatar[0].src}}\"\n                alt=\"Avatar\"\n                width=\"100%\"\n                height=\"100%\"\n                array=\"contacts\"\n                object=\"{{object._id}}\"\n                key=\"avatar[0].src\"\n                onerror=\"this.onerror=null; this.src='/assets/images/transparent.png';\"/>\n            </div>\n          </div>\n          <span class=\"flex-grow-1 ms-2 name\">{{object.first_name}} {{object.last_name}}</span>\n        </a>\n      ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "profile-name"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter name"
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
                "label": "Email",
                "tagName": "input",
                "filterTemplate": "<input class=\"form-control\" placeholder=\"Filter by Email\" />",
                "tableTemplate": "{{object.email}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "profile-email"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter email"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "email"
                    },
                    {
                        "name": "type",
                        "value": "email"
                    }
                ]
            },
            {
                "label": "Status",
                "options": [
                    {
                        "name": "active",
                        "label": "Active"
                    },
                    {
                        "name": "inactive",
                        "label": "Inactive"
                    }
                ],
                "tagName": "select",
                "filterTemplate": "<select class=\"form-control\">\n                                <option value=\"\">Filter by Status</option>\n                                <option value=\"active\">Active</option>\n                                <option value=\"inactive\">Inactive</option>\n                              </select>",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "profile-status"
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
                        "innerText": "Filter by Status"
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
                                "value": "inactive"
                            }
                        ],
                        "innerText": "Inactive"
                    }
                ]
            },
            {
                "label": "Created At",
                "tagName": "input",
                "filterTemplate": "<input type=\"dat\" class=\"form-control\" />",
                "tableTemplate": "{{object.createdAt | date:'yyyy-MM-dd HH:mm'}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "profile-created-at"
                    },
                    {
                        "name": "readonly",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "createdAt"
                    },
                    {
                        "name": "type",
                        "value": "datetime"
                    }
                ]
            },
            {
                "label": "Type",
                "tagName": "select",
                "options": [
                    {
                        "name": "user",
                        "label": "User"
                    },
                    {
                        "name": "admin",
                        "label": "Admin"
                    }
                ],
                "filterTemplate": "<select class=\"form-control\">\n          <option value=\"\">Filter by Type</option>\n          <option value=\"user\">User</option>\n          <option value=\"admin\">Admin</option>\n        </select>",
                "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n        {{type}}\n      </span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
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
                        "innerText": "Filter by Type"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "user"
                            }
                        ],
                        "innerText": "User"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "admin"
                            }
                        ],
                        "innerText": "Admin"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "options": [
                    {
                        "name": "admin",
                        "label": "Admin"
                    },
                    {
                        "name": "user",
                        "label": "User"
                    },
                    {
                        "name": "guest",
                        "label": "Guest"
                    }
                ],
                "filterTemplate": "<select class=\"form-control\">\n          <option value=\"\">Filter by Tags</option>\n          <option value=\"admin\">Admin</option>\n          <option value=\"user\">User</option>\n          <option value=\"guest\">Guest</option>\n        </select>",
                "tableTemplate": "<span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">\n        {{tags}}\n      </span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
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
                        "innerText": "Filter by Tags"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "admin"
                            }
                        ],
                        "innerText": "Admin"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "user"
                            }
                        ],
                        "innerText": "User"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "guest"
                            }
                        ],
                        "innerText": "Guest"
                    }
                ]
            }
        ]
    },
    "upsert": true
};
