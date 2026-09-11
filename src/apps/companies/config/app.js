export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d00eed",
        "name": "Companies",
        "singularName": "Company",
        "path": "/apps/companies",
        "card": "/apps/companies/card.html",
        "cardTemplate": "/apps/companies/templates/card.html",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "companies",
        "category": "CRM",
        "icon": "ri-building-line",
        "description": "App to manage and track Companies.",
        "status": "active",
        "field": {
            "name": {
                "label": "Name",
                "attributes": "key=\"name\" type=\"text\" required class=\"form-control\" id=\"company-name-field\" placeholder=\"Enter company name\"",
                "tableTemplate": "\n          <div class=\"d-flex align-items-center\">\n            <div class=\"flex-shrink-0\">\n              <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/companies/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n                <div state-to=\"offcanvas-app-form\" state.array=\"companies\" state.object=\"{{object._id}}\"></div>\n                <div class=\"avatar-xs rounded-circle position-relative overflow-hidden\" state-to=\"offcanvas-app-form\" state.array=\"companies\" state.object=\"{{object._id}}\">\n                  <div class=\"avatar-title bg-secondary-subtle text-secondary material-shadow\">\n                    <span class=\"avatar-initial\">{{object.name[0]}}</span>\n                    <img\n                      class=\"position-absolute object-fit-cover\"\n                      src=\"{{object.logo[0].src}}\"\n                      alt=\"Company Logo\"\n                      width=\"100%\"\n                      height=\"100%\"\n                      array=\"companies\"\n                      object=\"{{object._id}}\"\n                      key=\"logo[0].src\"\n                      onerror=\"this.onerror=null; this.src='/assets/images/transparent.png';\"/>\n                  </div>\n                </div>\n              </a>\n            </div>\n            <div class=\"flex-grow-1 ms-2 name\">\n              <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/companies/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n                <div state-to=\"offcanvas-app-form\" state.array=\"companies\" state.object=\"{{object._id}}\"></div>\n                <span>{{object.name}}</span>\n              </a>\n            </div>\n          </div>\n        ",
                "filterTemplate": "<input id=\"companyname-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter company name\" filter-query=\"$document .list-view\" filter-query-key=\"name\" />",
            },
            "type": {
                "label": "Type",
                "tagName": "select",
                "attributes": "key=\"type\" class=\"form-select\" id=\"company-type-field\"",
                "tableTemplate": "{{object.type}}",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"company-type-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"type\">\n\t\t\t\t\t\t<option value=\"\">Select Type</option>\n\t\t\t\t\t\t<option value=\"Customer\">Customer</option>\n\t\t\t\t\t\t<option value=\"Partner\">Partner</option>\n\t\t\t\t\t\t<option value=\"Vendor\">Vendor</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "options": [
                    {
                        "attributes": "value=\"Customer\"",
                        "label": "Customer"
                    },
                    {
                        "attributes": "value=\"Seller\"",
                        "label": "Seller"
                    },
                    {
                        "attributes": "value=\"Vendor\"",
                        "label": "Vendor"
                    }
                ]
            }
        },
        "fields": [
            {
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"companyname-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter company name\" filter-query=\"$document .list-view\" filter-query-key=\"name\" />",
                "tableTemplate": "\n          <div class=\"d-flex align-items-center\">\n            <div class=\"flex-shrink-0\">\n              <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/companies/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n                <div state-to=\"offcanvas-app-form\" state.array=\"companies\" state.object=\"{{object._id}}\"></div>\n                <div class=\"avatar-xs rounded-circle position-relative overflow-hidden\" state-to=\"offcanvas-app-form\" state.array=\"companies\" state.object=\"{{object._id}}\">\n                  <div class=\"avatar-title bg-secondary-subtle text-secondary material-shadow\">\n                    <span class=\"avatar-initial\">{{object.name[0]}}</span>\n                    <img\n                      class=\"position-absolute object-fit-cover\"\n                      src=\"{{object.logo[0].src}}\"\n                      alt=\"Company Logo\"\n                      width=\"100%\"\n                      height=\"100%\"\n                      array=\"companies\"\n                      object=\"{{object._id}}\"\n                      key=\"logo[0].src\"\n                      onerror=\"this.onerror=null; this.src='/assets/images/transparent.png';\"/>\n                  </div>\n                </div>\n              </a>\n            </div>\n            <div class=\"flex-grow-1 ms-2 name\">\n              <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/companies/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n                <div state-to=\"offcanvas-app-form\" state.array=\"companies\" state.object=\"{{object._id}}\"></div>\n                <span>{{object.name}}</span>\n              </a>\n            </div>\n          </div>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "company-name-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter company name"
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
                "label": "Contact Person",
                "tagName": "input",
                "filterTemplate": "<input class=\"form-control\" type=\"text\" placeholder=\"Enter contact person\" filter-query=\"$document .list-view\" filter-query-key=\"contact_person\" />",
                "tableTemplate": "{{object.contact_person}}",
                "attributes": [
                    {
                        "name": "key",
                        "value": "contact_person"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Owner Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"owner-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter owner name\" filter-query=\"$document .list-view\" filter-query-key=\"owner\" />",
                "tableTemplate": "{{object.owner}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "owner-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter owner name"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "owner"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Industry",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"industry-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"industry\">\n\t\t\t\t\t\t<option value=\"\">Select industry</option>\n\t\t\t\t\t\t<option value=\"Computer Industry\">Computer Industry</option>\n\t\t\t\t\t\t<option value=\"Chemical Industries\">Chemical Industries</option>\n\t\t\t\t\t\t<option value=\"Health Services\">Health Services</option>\n\t\t\t\t\t\t<option value=\"Telecommunications Services\">Telecommunications Services</option>\n\t\t\t\t\t\t<option value=\"Textiles: Clothing, Footwear\">Textiles: Clothing, Footwear</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.industry}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "industry-field"
                    },
                    {
                        "name": "key",
                        "value": "industry"
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
                        "innerText": "Select industry type"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Computer Industry"
                            }
                        ],
                        "innerText": "Computer Industry"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Chemical Industries"
                            }
                        ],
                        "innerText": "Chemical Industries"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Health Services"
                            }
                        ],
                        "innerText": "Health Services"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Telecommunications Services"
                            }
                        ],
                        "innerText": "Telecommunications Services"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Textiles: Clothing, Footwear"
                            }
                        ],
                        "innerText": "Textiles: Clothing, Footwear"
                    }
                ]
            },
            {
                "label": "Rating",
                "tagName": "input",
                "filterTemplate": "<input id=\"rating-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter rating\" filter-query=\"$document .list-view\" filter-query-key=\"rating\" />",
                "tableTemplate": "{{object.rating}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "rating-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter rating"
                    },
                    {
                        "name": "key",
                        "value": "rating"
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
                "filterTemplate": "<input id=\"location-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter location\" filter-query=\"$document .list-view\" filter-query-key=\"location\" />",
                "tableTemplate": "{{object.location}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "location-field"
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
                "label": "Employee",
                "tagName": "input",
                "filterTemplate": "<input id=\"employee-filter\" class=\"form-control\" type=\"number\" placeholder=\"Number of employees\" filter-query=\"$document .list-view\" filter-query-key=\"employee\" />",
                "tableTemplate": "{{object.employees}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "employee-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter number of employee"
                    },
                    {
                        "name": "key",
                        "value": "employee"
                    },
                    {
                        "name": "type",
                        "value": "number"
                    }
                ]
            },
            {
                "label": "Website",
                "tagName": "input",
                "filterTemplate": "<input id=\"website-filter\" class=\"form-control\" type=\"url\" placeholder=\"Enter website\" filter-query=\"$document .list-view\" filter-query-key=\"website\" />",
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
                        "name": "key",
                        "value": "website"
                    },
                    {
                        "name": "type",
                        "value": "url"
                    }
                ]
            },
            {
                "label": "Contact Email",
                "tagName": "input",
                "filterTemplate": "<input id=\"contact_email-filter\" class=\"form-control\" type=\"email\" placeholder=\"Enter contact email\" filter-query=\"$document .list-view\" filter-query-key=\"contact_email\" />",
                "tableTemplate": "{{object.contact_email}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "contact_email-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter contact email"
                    },
                    {
                        "name": "key",
                        "value": "contact_email"
                    },
                    {
                        "name": "type",
                        "value": "email"
                    }
                ]
            },
            {
                "label": "Since",
                "tagName": "input",
                "filterTemplate": "<input id=\"since-filter\" class=\"form-control\" type=\"dat\" placeholder=\"Enter since\" filter-query=\"$document .list-view\" filter-query-key=\"since\" />",
                "tableTemplate": "{{object.since}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "since-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter since"
                    },
                    {
                        "name": "key",
                        "value": "since"
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
                "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option value=\"active\">Active</option>\n\t\t\t\t\t\t<option value=\"inactive\">Inactive</option>\n\t\t\t\t\t\t<option value=\"prospect\">Prospect</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "companies-status"
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
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"partner\">Partner</option>\n\t\t\t\t\t\t<option value=\"vendor\">Vendor</option>\n\t\t\t\t\t\t<option value=\"customer\">Customer</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "\n\t\t\t\t\t<span array=\"companies\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n\t\t\t\t\t\t<span template class=\"badge bg-primary-subtle text-primary me-1\">\n\t\t\t\t\t\t\t{{tags}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "companies-tags"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "tags"
                    },
                    {
                        "name": "type",
                        "value": "multiselect"
                    }
                ],
                "children": [
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
                                "value": "customer"
                            }
                        ],
                        "innerText": "Customer"
                    }
                ]
            }
        ]
    },
    "upsert": true
};
