export default {
  "method": "object.update",
  "array": "apps",
  "upsert": true,
  "object": {
    "_id": "68741e1d07a037d0d6d00f00",
    "name": "Support Tickets",
    "singularName": "Support Ticket",
    "path": "apps/support-tickets",
    "array": "support_tickets",
    "category": "CRM",
    "icon": "ri-ticket-line",
    "description": "App to manage and track Support Tickets.",
    "status": "active",
    "fields": [
      {
        "label": "Ticket ID",
        "tagName": "input",
        "filterTemplate": "<input id=\"ticketId-filter\" class=\"form-control\" type=\"text\" placeholder=\"ID\" filter-query=\"$document .list-view\" filter-query-key=\"_id\" />",
        "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/support-tickets/details.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"support_tickets\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object._id}}</span>\n\t\t\t\t\t</a>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "ticketId"
          },
          {
            "name": "placeholder",
            "value": "ID"
          },
          {
            "name": "readonly",
            "value": true
          },
          {
            "name": "key",
            "value": "_id"
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
        "filterTemplate": "<input id=\"title-filter\" class=\"form-control\" type=\"text\" placeholder=\"Title\" filter-query=\"$document .list-view\" filter-query-key=\"title\" />",
        "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/support-tickets/details.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\">\n\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"support_tickets\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object.title}}</span>\n\t\t\t\t\t</a>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "tasksTitle-field"
          },
          {
            "name": "placeholder",
            "value": "Title"
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
        "label": "Client Name",
        "tagName": "input",
        "filterTemplate": "<input id=\"client_name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Client Name\" filter-query=\"$document .list-view\" filter-query-key=\"client_name\" />",
        "tableTemplate": "{{object.client_name}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "client_nameName-field"
          },
          {
            "name": "placeholder",
            "value": "Client Name"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "client_name"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Assigned To",
        "tagName": "input",
        "filterTemplate": "<input id=\"assigned_to-filter\" class=\"form-control\" type=\"text\" placeholder=\"Assigned to\" filter-query=\"$document .list-view\" filter-query-key=\"assigned_to\" />",
        "tableTemplate": "{{object.assigned_to}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "assignedtoName-field"
          },
          {
            "name": "placeholder",
            "value": "Assigned to"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "assigned_to"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Create Date",
        "tagName": "input",
        "filterTemplate": "<input id=\"create_date-filter\" class=\"form-control\" type=\"dat\" placeholder=\"Create Date\" filter-query=\"$document .list-view\" filter-query-key=\"create_date\" />",
        "tableTemplate": "{{object.create_date}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "date-field"
          },
          {
            "name": "date-picker",
            "value": "flatpickr"
          },
          {
            "name": "data-date-format",
            "value": "d M, Y"
          },
          {
            "name": "placeholder",
            "value": "Create Date"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "create_date"
          },
          {
            "name": "type",
            "value": "dat"
          }
        ]
      },
      {
        "label": "Due Date",
        "tagName": "input",
        "filterTemplate": "<input id=\"due_date-filter\" class=\"form-control\" type=\"dat\" placeholder=\"Due Date\" filter-query=\"$document .list-view\" filter-query-key=\"due_date\" />",
        "tableTemplate": "{{object.due_date}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "duedate-field"
          },
          {
            "name": "date-picker",
            "value": "flatpickr"
          },
          {
            "name": "data-date-format",
            "value": "d M, Y"
          },
          {
            "name": "placeholder",
            "value": "Due Date"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "due_date"
          },
          {
            "name": "type",
            "value": "dat"
          }
        ]
      },
      {
        "label": "Priority",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"priority-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"priority\">\n\t\t\t\t\t\t<option value=\"\">Select Priority</option>\n\t\t\t\t\t\t<option value=\"High\">High</option>\n\t\t\t\t\t\t<option value=\"Medium\">Medium</option>\n\t\t\t\t\t\t<option value=\"Low\">Low</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "{{object.priority}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "support-tickets-priority"
          },
          {
            "name": "key",
            "value": "priority"
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
            "innerText": "Select Priority"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "High"
              }
            ],
            "innerText": "High"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Medium"
              }
            ],
            "innerText": "Medium"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Low"
              }
            ],
            "innerText": "Low"
          }
        ]
      },
      {
        "label": "Status",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option template value=\"{{object.key}}\">{{object.label}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t\t<div array=\"support_tickets\" object=\"statuses\" render-query=\"$previous\"></div>\n\t\t\t\t",
        "tableTemplate": "{{object.status}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "support-tickets-status"
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
                "value": "inprogress"
              }
            ],
            "innerText": "In Progress"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "closed"
              }
            ],
            "innerText": "Closed"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "open"
              }
            ],
            "innerText": "Open"
          }
        ]
      },
      {
        "label": "Stage",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"stage-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"stage\">\n\t\t\t\t\t\t<option value=\"\">Select Stage</option>\n\t\t\t\t\t\t<option template value=\"{{object.key}}\">{{object.label}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t\t<div crud=\"false\" array=\"support_tickets\" object=\"stages\" render-query=\"$previous\"></div>\n\t\t\t\t",
        "tableTemplate": "{{object.stage}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "support-tickets-stage"
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
                "value": "created"
              }
            ],
            "innerText": "Created"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "assigned"
              }
            ],
            "innerText": "Assigned"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "resolved"
              }
            ],
            "innerText": "Resolved"
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
        "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"bug\">Bug</option>\n\t\t\t\t\t\t<option value=\"feature\">Feature</option>\n\t\t\t\t\t\t<option value=\"question\">Question</option>\n\t\t\t\t\t\t<option value=\"urgent\">Urgent</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "\n\t\t\t\t\t<span array=\"support_tickets\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n\t\t\t\t\t\t<span template class=\"badge bg-primary-subtle text-primary me-1\">\n\t\t\t\t\t\t\t{{tags}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "support-tickets-tags"
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
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "bug"
              }
            ],
            "innerText": "Bug"
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
                "value": "question"
              }
            ],
            "innerText": "Question"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "urgent"
              }
            ],
            "innerText": "Urgent"
          }
        ],
        "children": [
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "bug"
              }
            ],
            "innerText": "Bug"
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
                "value": "question"
              }
            ],
            "innerText": "Question"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "urgent"
              }
            ],
            "innerText": "Urgent"
          }
        ]
      },
      {
        "label": "Type",
        "tagName": "select",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "support-tickets-type"
          },
          {
            "name": "key",
            "value": "type"
          }
        ],
        "options": [
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "support"
              }
            ],
            "innerText": "Support"
          }
        ],
        "children": [
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "support"
              }
            ],
            "innerText": "Support"
          }
        ]
      }
    ]
  }
};