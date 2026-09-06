export default {
  "method": "object.update",
  "array": "apps",
  "object": {
    "_id": "6a96308f79df2000df2ee4b3",
    "name": "Sellers",
    "singularName": "Seller",
    "path": "apps/sellers",
    "array": "companies",
    "filter": {
      "tags": "seller"
    },
    "category": "Sales & Billing",
    "mainViews": [
      "table",
      "kanban"
    ],
    "secondaryViews": [
      "details",
      "form"
    ],
    "icon": "ri-user-add-line",
    "description": "App to manage and track Sellers.",
    "status": "active",
    "fields": [
      {
        "label": "Name",
        "tagName": "input",
        "filterTemplate": "<input type=\"text\" class=\"form-control\" placeholder=\"Filter by name\" filter-query-key=\"name\" />",
        "tableTemplate": "\n          <div class=\"d-flex align-items-center\">\n            <div class=\"flex-shrink-0\">\n              <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/sellers/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n                <div state-to=\"offcanvas-app-form\" state.array=\"companies\" state.object=\"{{object._id}}\"></div>\n                <div class=\"avatar-xs rounded-circle position-relative overflow-hidden\">\n                  <div class=\"avatar-title bg-secondary-subtle text-secondary material-shadow\">\n                    <span class=\"avatar-initial\">{{object.name[0]}}</span>\n                    <img\n                      class=\"position-absolute object-fit-cover\"\n                      src=\"{{object.logo[0].src}}\"\n                      alt=\"Company Logo\"\n                      width=\"100%\"\n                      height=\"100%\"\n                      array=\"companies\"\n                      object=\"{{object._id}}\"\n                      key=\"logo[0].src\"\n                      onerror=\"this.onerror=null; this.src='/assets/images/transparent.png';\"/>\n                  </div>\n                </div>\n              </a>\n            </div>\n            <div class=\"flex-grow-1 ms-2 name\">\n              <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/sellers/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n                <div state-to=\"offcanvas-app-form\" state.array=\"companies\" state.object=\"{{object._id}}\"></div>\n                <span>{{object.name}}</span>\n              </a>\n            </div>\n          </div>\n        ",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "companyname-field"
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
        "label": "Owner Name",
        "tagName": "input",
        "filterTemplate": "<input type=\"text\" class=\"form-control\" placeholder=\"Filter by owner\" filter-query-key=\"owner\" />",
        "tableTemplate": "{{object.owner}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Enter owner name"
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
        "label": "Industry Type",
        "tagName": "select",
        "filterTemplate": "\n          <select class=\"form-control\" filter-query-key=\"industry_type\">\n            <option value=\"\">All Industries</option>\n            <option value=\"technology\">Technology</option>\n            <option value=\"finance\">Finance</option>\n            <option value=\"healthcare\">Healthcare</option>\n            <option value=\"other\">Other</option>\n          </select>\n        ",
        "tableTemplate": "<span render=\"object.industry_type\" render-as=\"industry_type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n       {{industry_type}}\n     </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Select industry type"
          },
          {
            "name": "key",
            "value": "industry_type"
          }
        ],
        "children": [
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "technology"
              }
            ],
            "innerText": "Technology"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "finance"
              }
            ],
            "innerText": "Finance"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "healthcare"
              }
            ],
            "innerText": "Healthcare"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "other"
              }
            ],
            "innerText": "Other"
          }
        ]
      },
      {
        "label": "Rating",
        "tagName": "input",
        "filterTemplate": "<input type=\"number\" class=\"form-control\" placeholder=\"Filter by rating\" filter-query-key=\"rating\" min=\"1\" max=\"5\" />",
        "tableTemplate": "{{object.rating}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Enter rating"
          },
          {
            "name": "min",
            "value": 1
          },
          {
            "name": "max",
            "value": 5
          },
          {
            "name": "key",
            "value": "rating"
          },
          {
            "name": "type",
            "value": "number"
          }
        ]
      },
      {
        "label": "Location",
        "tagName": "input",
        "filterTemplate": "<input type=\"text\" class=\"form-control\" placeholder=\"Filter by location\" filter-query-key=\"location\" />",
        "tableTemplate": "{{object.location}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
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
        "label": "Contact Person",
        "tagName": "input",
        "filterTemplate": "<input type=\"text\" class=\"form-control\" placeholder=\"Filter by contact person\" filter-query-key=\"contact_person\" />",
        "tableTemplate": "{{object.contact_person}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Enter contact person name"
          },
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
        "label": "Email",
        "tagName": "input",
        "filterTemplate": "<input type=\"email\" class=\"form-control\" placeholder=\"Filter by email\" filter-query-key=\"email\" />",
        "tableTemplate": "{{object.email}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Enter email address"
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
        "label": "Phone Number",
        "tagName": "input",
        "filterTemplate": "<input type=\"tel\" class=\"form-control\" placeholder=\"Filter by phone\" filter-query-key=\"phone_number\" />",
        "tableTemplate": "{{object.phone_number}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Enter phone number"
          },
          {
            "name": "key",
            "value": "phone_number"
          },
          {
            "name": "type",
            "value": "tel"
          }
        ]
      },
      {
        "label": "Website",
        "tagName": "input",
        "filterTemplate": "<input type=\"url\" class=\"form-control\" placeholder=\"Filter by website\" filter-query-key=\"website\" />",
        "tableTemplate": "<a href=\"{{object.website}}\" target=\"_blank\">{{object.website}}</a>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Enter website URL"
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
        "label": "Status",
        "tagName": "select",
        "filterTemplate": "<select class=\"form-control\" filter-query-key=\"statuses\">\n            <option value=\"\">All Statuses</option>\n            <option value=\"active\">Active</option>\n            <option value=\"inactive\">Inactive</option>\n          </select>",
        "tableTemplate": "<span render=\"object.statuses\" render-as=\"statuses\" template class=\"badge bg-primary-subtle text-primary me-1\">\n       {{statuses}}\n     </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Select status"
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
        "label": "Type",
        "tagName": "select",
        "filterTemplate": "<select class=\"form-control\" filter-query-key=\"type\">\n            <option value=\"\">All Types</option>\n            <option value=\"seller\">Seller</option>\n            <option value=\"company\">Company</option>\n          </select>",
        "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n       {{type}}\n     </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Select type"
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
                "value": "seller"
              }
            ],
            "innerText": "Seller"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "company"
              }
            ],
            "innerText": "Company"
          }
        ]
      },
      {
        "label": "Tags",
        "tagName": "select",
        "filterTemplate": "<select class=\"form-control\" filter-query-key=\"tags\">\n            <option value=\"\">All Tags</option>\n            <option value=\"seller\">Seller</option>\n            <option value=\"business\">Business</option>\n          </select>",
        "tableTemplate": "<span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">\n       {{tags}}\n     </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Select tags"
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
                "value": "seller"
              }
            ],
            "innerText": "Seller"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "business"
              }
            ],
            "innerText": "Business"
          }
        ]
      }
    ]
  },
  "upsert": true
};
