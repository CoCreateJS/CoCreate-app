export default {
    "method": "object.update",
    "array": "apps",
    "upsert": true,
    "object": {
        "_id": "6a96308f88ce2e69559ce874",
        "name": "Candidates",
        "singularName": "Candidate",
        "path": "/apps/candidates",
        "card": "/apps/candidates/components/card.html",
        "cardTemplate": "/apps/candidates/templates/card.html",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "contacts",
        "filter": {
            "type": "candidate"
        },
        "category": "Human Resources",
        "icon": "/assets/svg/remix/user-search-line.svg",
        "description": "App to manage and track Candidates.",
        "status": "active",
        "fields": [
            {
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter name\" filter-query=\"$document .list-view\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "\n        <a\n          role=\"button\"\n          tabindex=\"0\"\n          class=\"d-flex align-items-center\"\n          state-to=\"offcanvas-app\"\n          state.object=\"6a96308f88ce2e69559ce874\"\n          aria-controls=\"offcanvas-app\"\n          aria-open\n          aria-haspopup=\"dialog\"\n          aria-expanded=\"false\">\n          <div state-to=\"offcanvas-app-view\" state.src=\"/apps/candidates/app.html\"></div>\n          <div state-to=\"offcanvas-app-form\" state.array=\"contacts\" state.object=\"{{object._id}}\"></div>\n          <div class=\"avatar-xs rounded-circle position-relative overflow-hidden flex-shrink-0\">\n            <div class=\"avatar-title bg-secondary-subtle text-secondary material-shadow\">\n              <span class=\"avatar-initial\">{{object.first_name[0]}}</span>\n              <img\n                class=\"position-absolute object-fit-cover\"\n                src=\"{{object.avatar[0].src}}\"\n                alt=\"Avatar\"\n                width=\"100%\"\n                height=\"100%\"\n                array=\"contacts\"\n                object=\"{{object._id}}\"\n                key=\"avatar[0].src\"\n                onerror=\"this.onerror=null; this.src='/assets/images/transparent.png';\"/>\n            </div>\n          </div>\n          <span class=\"flex-grow-1 ms-2 name\">{{object.first_name}} {{object.last_name}}</span>\n        </a>\n      ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "contact-name-field"
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
                "label": "Company",
                "tagName": "input",
                "filterTemplate": "<input id=\"company-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter company\" filter-query=\"$document .list-view\" filter-query-key=\"company.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.company}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "company-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter company"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "company"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Title",
                "tagName": "input",
                "filterTemplate": "<input id=\"title-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter title\" filter-query=\"$document .list-view\" filter-query-key=\"title.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.title}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "title-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter title"
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
                "label": "Email",
                "tagName": "input",
                "filterTemplate": "<input id=\"email-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter email\" filter-query=\"$document .list-view\" filter-query-key=\"email.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.email}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "email-field"
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
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Phone",
                "tagName": "input",
                "filterTemplate": "<input id=\"phone-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter phone\" filter-query=\"$document .list-view\" filter-query-key=\"phone.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.phone}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "phone-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter phone"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "phone"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "City",
                "tagName": "input",
                "filterTemplate": "<input id=\"city-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter city\" filter-query=\"$document .list-view\" filter-query-key=\"city.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.city}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "city-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter city"
                    },
                    {
                        "name": "required",
                        "value": false
                    },
                    {
                        "name": "key",
                        "value": "city"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Country",
                "tagName": "input",
                "filterTemplate": "<input id=\"country-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter country\" filter-query=\"$document .list-view\" filter-query-key=\"country.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.country}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "country-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter country"
                    },
                    {
                        "name": "required",
                        "value": false
                    },
                    {
                        "name": "key",
                        "value": "country"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Zip",
                "tagName": "input",
                "filterTemplate": "<input id=\"zip-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter zip\" filter-query=\"$document .list-view\" filter-query-key=\"zip.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.zip}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "zip-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter zip"
                    },
                    {
                        "name": "required",
                        "value": false
                    },
                    {
                        "name": "key",
                        "value": "zip"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Website",
                "tagName": "input",
                "filterTemplate": "<input id=\"website-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter website\" filter-query=\"$document .list-view\" filter-query-key=\"website.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.website}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "website-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter website"
                    },
                    {
                        "name": "required",
                        "value": false
                    },
                    {
                        "name": "key",
                        "value": "website"
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
                "filterTemplate": "<input id=\"description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter description\" filter-query=\"$document .list-view\" filter-query-key=\"description.$regex\" filter-query-options=\"i\" />",
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
                        "name": "placeholder",
                        "value": "Enter description"
                    },
                    {
                        "name": "required",
                        "value": false
                    },
                    {
                        "name": "key",
                        "value": "description"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Skills",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"skills-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"skills.$in\">\n\t\t\t\t\t\t<option value=\"javascript\">Javascript</option>\n\t\t\t\t\t\t<option value=\"python\">Python</option>\n\t\t\t\t\t\t<option value=\"css\">CSS</option>\n\t\t\t\t\t\t<option value=\"html\">HTML</option>\n\t\t\t\t\t\t<option value=\"react\">React</option>\n\t\t\t\t\t\t<option value=\"vue\">Vue</option>\n\t\t\t\t\t\t<option value=\"angular\">Angular</option>\n\t\t\t\t\t\t<option value=\"node.js\">Node.js</option>\n\t\t\t\t\t\t<option value=\"mongodb\">MongoDB</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "<span render=\"object.skills\" render-as=\"skills\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{skills}}\n</span>",
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "javascript"
                            }
                        ],
                        "innerText": "Javascript"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "python"
                            }
                        ],
                        "innerText": "Python"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "css"
                            }
                        ],
                        "innerText": "CSS"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "html"
                            }
                        ],
                        "innerText": "HTML"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "react"
                            }
                        ],
                        "innerText": "React"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "vue"
                            }
                        ],
                        "innerText": "Vue"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "angular"
                            }
                        ],
                        "innerText": "Angular"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "node.js"
                            }
                        ],
                        "innerText": "Node.js"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "mongodb"
                            }
                        ],
                        "innerText": "MongoDB"
                    }
                ],
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "candidate-skills"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    },
                    {
                        "name": "plugin",
                        "value": "choices"
                    },
                    {
                        "name": "key",
                        "value": "skills"
                    }
                ]
            },
            {
                "label": "Availability",
                "tagName": "input",
                "filterTemplate": "<input id=\"availability-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter availability\" filter-query=\"$document .list-view\" filter-query-key=\"availability.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.availability}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "availability-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter availability"
                    },
                    {
                        "name": "required",
                        "value": false
                    },
                    {
                        "name": "key",
                        "value": "availability"
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
                "filterTemplate": "\n\t\t\t\t\t<select id=\"type-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"type.$in\">\n\t\t\t\t\t\t<option value=\"lead\">Lead</option>\n\t\t\t\t\t\t<option value=\"partner\">Partner</option>\n\t\t\t\t\t\t<option value=\"customer\">Customer</option>\n\t\t\t\t\t\t<option value=\"vendor\">Vendor</option>\n\t\t\t\t\t\t<option value=\"candidate\">Candidate</option>\n\t\t\t\t\t\t<option value=\"advisor\">Advisor</option>\n\t\t\t\t\t\t<option value=\"consultant\">Consultant</option>\n\t\t\t\t\t\t<option value=\"employee\">Employee</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{type}}\n</span>",
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "lead"
                            }
                        ],
                        "innerText": "Lead"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "partner"
                            }
                        ],
                        "innerText": "Partner"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "customer"
                            }
                        ],
                        "innerText": "Customer"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "vendor"
                            }
                        ],
                        "innerText": "Vendor"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "candidate"
                            }
                        ],
                        "innerText": "Candidate"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "advisor"
                            }
                        ],
                        "innerText": "Advisor"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "consultant"
                            }
                        ],
                        "innerText": "Consultant"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "employee"
                            }
                        ],
                        "innerText": "Employee"
                    }
                ],
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "contacts-type"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "type"
                    }
                ]
            },
            {
                "label": "Status",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option value=\"new\">New</option>\n\t\t\t\t\t\t<option value=\"screening\">Screening</option>\n\t\t\t\t\t\t<option value=\"interview\">Interview</option>\n\t\t\t\t\t\t<option value=\"offered\">Offered</option>\n\t\t\t\t\t\t<option value=\"hired\">Hired</option>\n\t\t\t\t\t\t<option value=\"rejected\">Rejected</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.status}}",
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
                                "value": "new"
                            }
                        ],
                        "innerText": "New"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "screening"
                            }
                        ],
                        "innerText": "Screening"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "interview"
                            }
                        ],
                        "innerText": "Interview"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "offered"
                            }
                        ],
                        "innerText": "Offered"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "hired"
                            }
                        ],
                        "innerText": "Hired"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "rejected"
                            }
                        ],
                        "innerText": "Rejected"
                    }
                ],
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "contacts-status"
                    },
                    {
                        "name": "key",
                        "value": "status"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags.$in\">\n\t\t\t\t\t\t<option value=\"vip\">VIP</option>\n\t\t\t\t\t\t<option value=\"trial\">Trial</option>\n\t\t\t\t\t\t<option value=\"newsletter\">Newsletter</option>\n\t\t\t\t\t\t<option value=\"inactive\">Inactive</option>\n\t\t\t\t\t\t<option value=\"exiting\">Exiting</option>\n\t\t\t\t\t\t<option value=\"long-term\">Long-term</option>\n\t\t\t\t\t\t<option value=\"new\">New</option>\n\t\t\t\t\t\t<option value=\"prospect\">Prospect</option>\n\t\t\t\t\t\t<option value=\"referral\">Referral</option>\n\t\t\t\t\t\t<option value=\"candidate\">Candidate</option>\n\t\t\t\t\t\t<option value=\"priority\">Priority</option>\n\t\t\t\t\t\t<option value=\"blocked\">Blocked</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "<span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{tags}}\n</span>",
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "vip"
                            }
                        ],
                        "innerText": "VIP"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "trial"
                            }
                        ],
                        "innerText": "Trial"
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
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "exiting"
                            }
                        ],
                        "innerText": "Exiting"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "long-term"
                            }
                        ],
                        "innerText": "Long-term"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "new"
                            }
                        ],
                        "innerText": "New"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "prospect"
                            }
                        ],
                        "innerText": "Prospect"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "referral"
                            }
                        ],
                        "innerText": "Referral"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "candidate"
                            }
                        ],
                        "innerText": "Candidate"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "priority"
                            }
                        ],
                        "innerText": "Priority"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "blocked"
                            }
                        ],
                        "innerText": "Blocked"
                    }
                ],
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "contacts-tags"
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
    }
};
