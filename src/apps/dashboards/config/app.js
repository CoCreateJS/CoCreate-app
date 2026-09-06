export default {
  "method": "object.update",
  "array": "apps",
  "object": {
    "_id": "6a96308fea6decf4bea7a277",
    "name": "Dashboards",
    "singularName": "Dashboard",
    "path": "apps/dashboards",
    "array": "dashboards",
    "category": "Workspace",
    "status": "active",
    "icon": "ri-dashboard-line",
    "description": "App to manage and track Dashboards.",
    "fields": [
      {
        "label": "Dashboard Name",
        "tagName": "input",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "dashboard-name"
          },
          {
            "name": "placeholder",
            "value": "Enter dashboard name"
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
        ],
        "tableTemplate": "<span>{{object.name}}</span>"
      },
      {
        "label": "Icon",
        "tagName": "input",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "dashboard-icon"
          },
          {
            "name": "placeholder",
            "value": "Enter icon class"
          },
          {
            "name": "key",
            "value": "icon"
          },
          {
            "name": "type",
            "value": "text"
          }
        ],
        "tableTemplate": "<i class=\"{{object.icon}}\"></i>"
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
            "value": "dashboard-status"
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
        ],
        "tableTemplate": "<span class=\"badge bg-primary-subtle text-primary\">{{object.status}}</span>"
      },
      {
        "label": "Path",
        "tagName": "input",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "dashboard-path"
          },
          {
            "name": "placeholder",
            "value": "Enter dashboard path"
          },
          {
            "name": "key",
            "value": "path"
          },
          {
            "name": "type",
            "value": "text"
          }
        ],
        "tableTemplate": "<span>{{object.path}}</span>"
      }
    ]
  },
  "upsert": true
};
