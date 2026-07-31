module.exports = {
  "method": "object.update",
  "array": "apps",
  "object": {
    "_id": "68741e1d07a037d0d6d00ee5",
    "name": "Activities",
    "singularName": "Activity",
    "path": "apps/activities",
    "array": "activities",
    "status": "active",
    "icon": "ri-calendar-line",
    "description": "App to manage and track Activities.",
    "fields": [
      {
        "label": "Activity Name",
        "tagName": "input",
        "filterTemplate": "<input id=\"activity-name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter activity name\" filter-query=\"$document .list-view\" filter-query-key=\"name\" />",
        "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/activities/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\">\n            <div state-to=\"offcanvas-app-form\" state.array=\"activities\" state.object=\"{{object._id}}\"></div>\n            <span>{{object.name}}</span>\n          </a>\n        ",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "activity-name"
          },
          {
            "name": "placeholder",
            "value": "Enter activity name"
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
        "label": "Status",
        "tagName": "select",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "activities-status"
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
                "value": "planned"
              }
            ],
            "innerText": "Planned"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "in_progress"
              }
            ],
            "innerText": "In Progress"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "completed"
              }
            ],
            "innerText": "Completed"
          }
        ],
        "tableTemplate": "{{object.status}}"
      },
      {
        "label": "Stage",
        "tagName": "select",
        "options": [
          {
            "name": "initiation",
            "label": "Initiation"
          },
          {
            "name": "execution",
            "label": "Execution"
          },
          {
            "name": "closure",
            "label": "Closure"
          }
        ],
        "filterTemplate": "\n          <select id=\"stage-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"stage\">\n            <option value=\"\">Select Stage</option>\n            <option template value=\"{{object.key}}\">{{object.label}}</option>\n          </select>\n        ",
        "tableTemplate": "<span render=\"object.stage\" render-as=\"stage\" template class=\"badge bg-primary-subtle text-primary me-1\">{{stage}}</span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "activities-stage"
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
                "value": "initiation"
              }
            ],
            "innerText": "Initiation"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "execution"
              }
            ],
            "innerText": "Execution"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "closure"
              }
            ],
            "innerText": "Closure"
          }
        ]
      },
      {
        "label": "Tags",
        "tagName": "select",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "activities-tags"
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
                "value": "meeting"
              }
            ],
            "innerText": "Meeting"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "call"
              }
            ],
            "innerText": "Call"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "email"
              }
            ],
            "innerText": "Email"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "follow-up"
              }
            ],
            "innerText": "Follow-up"
          }
        ],
        "tableTemplate": "<span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">{{tags}}</span>"
      },
      {
        "label": "Description",
        "tagName": "textarea",
        "filterTemplate": "<textarea id=\"description-filter\" class=\"form-control\" placeholder=\"Enter activity description\" filter-query=\"$document .list-view\" filter-query-key=\"description\"></textarea>",
        "tableTemplate": "{{object.description}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "activity-description"
          },
          {
            "name": "placeholder",
            "value": "Enter activity description"
          },
          {
            "name": "rows",
            "value": 4
          },
          {
            "name": "key",
            "value": "description"
          },
          {
            "name": "type",
            "value": "textarea"
          }
        ]
      }
    ]
  },
  "upsert": true
};