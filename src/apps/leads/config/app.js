export default {
    "method": "object.update",
    "array": "apps",
    "upsert": true,
    "object": {
        "_id": "686ecb750cb20318c29a050b",
        "name": "Leads",
        "singularName": "Lead",
        "path": "/apps/leads",
        "card": "/apps/leads/card.html",
        "cardTemplate": "/apps/leads/card-template.html",
        "array": "contacts",
        "category": "CRM",
        "icon": "ri-user-add-line",
        "description": "App to manage and track Leads.",
        "status": "active",
        "mainViews": [
            "table",
            "grid",
            "kanban"
        ],
        "secondaryViews": [
            "details",
            "form"
        ],
        "fields": [
            {
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter name\" filter-query=\"$document .list-view\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "\n        <a\n          role=\"button\"\n          tabindex=\"0\"\n          class=\"d-flex align-items-center\"\n          state-to=\"offcanvas-app\"\n          state.object=\"686ecb750cb20318c29a050b\"\n          aria-controls=\"offcanvas-app\"\n          aria-open\n          aria-haspopup=\"dialog\"\n          aria-expanded=\"false\">\n          <div state-to=\"offcanvas-app-view\" state.src=\"/apps/leads/details.html\"></div>\n          <div state-to=\"offcanvas-app-form\" state.array=\"contacts\" state.object=\"{{object._id}}\"></div>\n          <div class=\"avatar-xs rounded-circle position-relative overflow-hidden flex-shrink-0\">\n            <div class=\"avatar-title bg-secondary-subtle text-secondary material-shadow\">\n              <span class=\"avatar-initial\">{{object.first_name[0]}}</span>\n              <img\n                class=\"position-absolute object-fit-cover\"\n                src=\"{{object.avatar[0].src}}\"\n                alt=\"Avatar\"\n                width=\"100%\"\n                height=\"100%\"\n                array=\"contacts\"\n                object=\"{{object._id}}\"\n                key=\"avatar[0].src\"\n                onerror=\"this.onerror=null; this.src='/assets/images/transparent.png';\"/>\n            </div>\n          </div>\n          <span class=\"flex-grow-1 ms-2 name\">{{object.first_name}} {{object.last_name}}</span>\n        </a>\n      ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "lead-name-field"
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
                "filterTemplate": "<input id=\"company-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter Company\" filter-query=\"$document .list-view\" filter-query-key=\"company\" />",
                "tableTemplate": "{{object.company}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "lead-company"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter company name"
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
                "label": "Leads Score",
                "tagName": "input",
                "filterTemplate": "<!--<input id=\"leads_score-filter\" class=\"form-range\" type=\"range\" min=\"0\" value=\"\" filter-query=\"$document .list-view\" filter-query-key=\"leads_score\" /> -->",
                "tableTemplate": "{{object.leads_score}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-range"
                    },
                    {
                        "name": "id",
                        "value": "lead-score"
                    },
                    {
                        "name": "min",
                        "value": 0
                    },
                    {
                        "name": "key",
                        "value": "leads_score"
                    },
                    {
                        "name": "type",
                        "value": "range"
                    }
                ]
            },
            {
                "label": "Phone",
                "tagName": "input",
                "filterTemplate": "<input id=\"phone-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter Phone\" filter-query=\"$document .list-view\" filter-query-key=\"phone\" />",
                "tableTemplate": "{{object.phone}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "lead-phone"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter phone number"
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
                "label": "Location",
                "tagName": "input",
                "filterTemplate": "<input id=\"location-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter Location\" filter-query=\"$document .list-view\" filter-query-key=\"location\" />",
                "tableTemplate": "{{object.location}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "lead-location"
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
                "label": "Country",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"country-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"country\">\n\t\t\t\t\t\t<option value=\"\">Select Country</option>\n\t\t\t\t\t\t<option value=\"Argentina\">Argentina</option>\n\t\t\t\t\t\t<option value=\"Belgium\">Belgium</option>\n\t\t\t\t\t\t<option value=\"Brazil\">Brazil</option>\n\t\t\t\t\t\t<option value=\"Colombia\">Colombia</option>\n\t\t\t\t\t\t<option value=\"Denmark\">Denmark</option>\n\t\t\t\t\t\t<option value=\"France\">France</option>\n\t\t\t\t\t\t<option value=\"Germany\">Germany</option>\n\t\t\t\t\t\t<option value=\"Mexico\">Mexico</option>\n\t\t\t\t\t\t<option value=\"Russia\">Russia</option>\n\t\t\t\t\t\t<option value=\"Spain\">Spain</option>\n\t\t\t\t\t\t<option value=\"Syria\">Syria</option>\n\t\t\t\t\t\t<option value=\"United Kingdom\">United Kingdom</option>\n\t\t\t\t\t\t<option value=\"United States of America\">United States of America</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.country}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "lead-country"
                    },
                    {
                        "name": "key",
                        "value": "country"
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
                        "innerText": "Select Country"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Argentina"
                            }
                        ],
                        "innerText": "Argentina"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Belgium"
                            }
                        ],
                        "innerText": "Belgium"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Brazil"
                            }
                        ],
                        "innerText": "Brazil"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Colombia"
                            }
                        ],
                        "innerText": "Colombia"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Denmark"
                            }
                        ],
                        "innerText": "Denmark"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "France"
                            }
                        ],
                        "innerText": "France"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Germany"
                            }
                        ],
                        "innerText": "Germany"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Mexico"
                            }
                        ],
                        "innerText": "Mexico"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Russia"
                            }
                        ],
                        "innerText": "Russia"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Spain"
                            }
                        ],
                        "innerText": "Spain"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Syria"
                            }
                        ],
                        "innerText": "Syria"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "United Kingdom"
                            }
                        ],
                        "innerText": "United Kingdom"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "United States of America"
                            }
                        ],
                        "innerText": "United States of America"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "filterTemplate": "<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"\">Select Tag</option>\n\t\t\t\t\t\t<option value=\"vip\">VIP</option>\n\t\t\t\t\t\t<option value=\"hot\">Hot</option>\n\t\t\t\t\t</select>",
                "tableTemplate": "\n\t\t\t\t<span array=\"contacts\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n\t\t\t\t\t<span template class=\"badge bg-primary-subtle text-primary me-1\">\n\t\t\t\t\t\t{{tags}}\n\t\t\t\t\t</span>\n\t\t\t\t</span>\n\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
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
                                "value": "hot"
                            }
                        ],
                        "innerText": "Hot"
                    }
                ]
            },
            {
                "label": "Create Date",
                "tagName": "input",
                "filterTemplate": "<input id=\"{{fields.key}}-filter\" class=\"{{fields.attributes.class}}\" type=\"{{fields.type}}\" filter-query=\"$document .list-view\" filter-query-key=\"{{fields.key}}\"  />",
                "tableTemplate": "{{object.created.on}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "lead-created-date"
                    },
                    {
                        "name": "key",
                        "value": "created.on"
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
                "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option template value=\"{{object.key}}\">{{object.label}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t\t<div array=\"contacts\" object=\"statuses\" render-query=\"$previous\"></div>\n\t\t\t\t",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "lead-status"
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
                "label": "Stage",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"stage-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"stage\">\n\t\t\t\t\t\t<option value=\"\">Select Stage</option>\n\t\t\t\t\t\t<option value=\"prospect\">Prospect</option>\n\t\t\t\t\t\t<option value=\"qualified\">Qualified</option>\n\t\t\t\t\t\t<option value=\"proposal\">Proposal</option>\n\t\t\t\t\t\t<option value=\"negotiation\">Negotiation</option>\n\t\t\t\t\t\t<option value=\"won\">Won</option>\n\t\t\t\t\t\t<option value=\"lost\">Lost</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.stage}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "lead-stage"
                    },
                    {
                        "name": "key",
                        "value": "stage"
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
                        "innerText": "Select Stage"
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
                                "value": "qualified"
                            }
                        ],
                        "innerText": "Qualified"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "proposal"
                            }
                        ],
                        "innerText": "Proposal"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "negotiation"
                            }
                        ],
                        "innerText": "Negotiation"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "won"
                            }
                        ],
                        "innerText": "Won"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "lost"
                            }
                        ],
                        "innerText": "Lost"
                    }
                ]
            },
            {
                "label": "Type",
                "tagName": "select",
                "filterTemplate": "<select id=\"type-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"type\">\n\t\t\t\t\t\t<option value=\"\">Select Type</option>\n\t\t\t\t\t\t<option value=\"leads\">Leads</option>\n\t\t\t\t\t</select>",
                "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{type}}\n</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "lead-type"
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
                                "value": "leads"
                            }
                        ],
                        "innerText": "Leads"
                    }
                ]
            }
        ]
    }
};
