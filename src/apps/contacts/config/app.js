export default {
  "method": "object.update",
  "upsert": true,
  "array": "apps",
  "object": {
    "_id": "6a96308f28d8dece819be2d4",
    "name": "Contacts",
    "singularName": "Contact",
    "path": "apps/contacts",
    "card": "/apps/contacts/card.html",
    "cardTemplate": "/apps/contacts/card-template.html",
    "array": "contacts",
    "category": "CRM",
    "mainViews": [
      "table",
      "grid",
      "kanban"
    ],
    "secondaryViews": [
      "details",
      "form"
    ],
    "icon": "ri-contacts-line",
    "description": "App to manage and track Contacts.",
    "status": "active",
    "fields": [
      {
        "label": "Name",
        "tagName": "input",
        "filterTemplate": "<input id=\"name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter name\" filter-query=\"$document .list-view\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "\n\t\t\t\t\t<div class=\"d-flex align-items-center\">\n\t\t\t\t\t\t<div class=\"flex-shrink-0\">\n\t\t\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/contacts/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t\t\t<div  state-to=\"offcanvas-app-form\" state.array=\"contacts\" state.object=\"{{object._id}}\"></div>\n\n\t\t\t\t\t\t\t<div class=\"avatar-xs rounded-circle position-relative overflow-hidden\" state-to=\"offcanvas-app-form\" state.array=\"contacts\" state.object=\"{{object._id}}\">\n\t\t\t\t\t\t\t\t\t<div class=\"avatar-title bg-secondary-subtle text-secondary material-shadow\">\n\t\t\t\t\t\t\t\t\t\t<span class=\"avatar-initial\">{{object.first_name[0]}}</span>\n\t\t\t\t\t\t\t\t\t\t<img\n\t\t\t\t\t\t\t\t\t\t\tclass=\"position-absolute object-fit-cover\"\n\t\t\t\t\t\t\t\t\t\t\tsrc=\"{{object.avatar[0].src}}\"\n\t\t\t\t\t\t\t\t\t\t\talt=\"Avatar\"\n\t\t\t\t\t\t\t\t\t\t\twidth=\"100%\"\n\t\t\t\t\t\t\t\t\t\t\theight=\"100%\"\n\t\t\t\t\t\t\t\t\t\t\tarray=\"contacts\"\n\t\t\t\t\t\t\t\t\t\t\tobject=\"{{object._id}}\"\n\t\t\t\t\t\t\t\t\t\t\tkey=\"avatar[0].src\"\n\t\t\t\t\t\t\t\t\t\t\tonerror=\"this.onerror=null; this.src='/assets/images/transparent.png';\"/>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<a role=\"button\" tabindex=\"0\" class=\"flex-grow-1 ms-2 name\" state-to=\"offcanvas-app-view\" state.src=\"/apps/contacts/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n              \t\t\t\t<div  state-to=\"offcanvas-app-form\" state.array=\"contacts\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t\t<span>{{object.name}}</span>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</div>\n\t\t\t\t",
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
        "label": "First Name",
        "tagName": "input",
        "filterTemplate": "<input id=\"first_name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter first name\" filter-query=\"$document .list-view\" filter-query-key=\"first_name.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.first_name}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "first_name-field"
          },
          {
            "name": "placeholder",
            "value": "Enter first name"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "first_name"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Last Name",
        "tagName": "input",
        "filterTemplate": "<input id=\"last_name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter last name\" filter-query=\"$document .list-view\" filter-query-key=\"last_name.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.last_name}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "last_name-field"
          },
          {
            "name": "placeholder",
            "value": "Enter last name"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "last_name"
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
        ],
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
            "value": "contacts-status"
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
        "label": "Tags",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags.$in\">\n\t\t\t\t\t\t<option value=\"vip\">VIP</option>\n\t\t\t\t\t\t<option value=\"trial\">Trial</option>\n\t\t\t\t\t\t<option value=\"newsletter\">Newsletter</option>\n\t\t\t\t\t\t<option value=\"inactive\">Inactive</option>\n\t\t\t\t\t\t<option value=\"exiting\">Exiting</option>\n\t\t\t\t\t\t<option value=\"long-term\">Long-term</option>\n\t\t\t\t\t\t<option value=\"new\">New</option>\n\t\t\t\t\t\t<option value=\"prospect\">Prospect</option>\n\t\t\t\t\t\t<option value=\"referral\">Referral</option>\n\t\t\t\t\t\t<option value=\"candidate\">Candidate</option>\n\t\t\t\t\t\t<option value=\"priority\">Priority</option>\n\t\t\t\t\t\t<option value=\"blocked\">Blocked</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{tags}}\n</span>",
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
        ],
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
        ]
      }
    ]
  }
};
