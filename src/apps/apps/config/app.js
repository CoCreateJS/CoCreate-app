export default {
  "method": "object.update",
  "array": "apps",
  "object": {
    "_id": "68e736cc0615d8268cc50fd6",
    "name": "Apps",
    "singularName": "App",
    "path": "apps/",
    "array": "apps",
    "category": "apps",
    "status": "active",
    "icon": "ri-apps-2-line",
    "description": "App to manage and track Apps.",
    "fields": [
      {
        "label": "Name",
        "tagName": "input",
        "filterTemplate": "<input id=\"name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter Name\" filter-query=\"$document .list-view\" filter-query-key=\"name\" />",
        "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/apps/details.html\" aria-controls=\"offcanvas-app\" aria-haspopup=\"dialog\" aria-open>\n            <div state-to=\"offcanvas-app-form\" state.array=\"apps\" state.object=\"{{object._id}}\"></div>\n            <span>{{object.name}}</span>\n          </a>\n        ",
        "attributes": [
          { "name": "key", "value": "name" },
          { "name": "type", "value": "text" },
          { "name": "class", "value": "form-control" },
          {
            "name": "id",
            "value": "opportunity-name"
          },
          {
            "name": "placeholder",
            "value": "Enter app name"
          },
          {
            "name": "required",
            "value": true
          }
        ]
      },
      {
        "label": "Singular Name",
        "tagName": "input",
        "filterTemplate": "<input id=\"singularName-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter singular name\" filter-query=\"$document .list-view\" filter-query-key=\"singularName.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.singularName}}",
        "attributes": [
          {
            "name": "key",
            "value": "singularName"
          },
          {
            "name": "type",
            "value": "text"
          },
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "singularName-field"
          },
          {
            "name": "placeholder",
            "value": "Enter singular app name"
          },
          {
            "name": "required",
            "value": true
          }
        ]
      },
      {
        "label": "Path",
        "tagName": "input",
        "filterTemplate": "<input id=\"path-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter path\" filter-query=\"$document .list-view\" filter-query-key=\"path.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.path}}",
        "attributes": [
          {
            "name": "key",
            "value": "path"
          },
          {
            "name": "type",
            "value": "text"
          },
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "path-field"
          },
          {
            "name": "placeholder",
            "value": "Enter app path"
          },
          {
            "name": "required",
            "value": true
          }
        ]
      },
      {
        "label": "Array",
        "tagName": "input",
        "filterTemplate": "<input id=\"array-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter array\" filter-query=\"$document .list-view\" filter-query-key=\"array.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.array}}",
        "attributes": [
          {
            "name": "key",
            "value": "array"
          },
          {
            "name": "type",
            "value": "text"
          },
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "array-field"
          },
          {
            "name": "placeholder",
            "value": "Enter array name"
          },
          {
            "name": "required",
            "value": true
          }
        ]
      },
      {
        "label": "Status",
        "tagName": "select",
        "filterTemplate": "\n          <select id=\"statuses-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"statuses\">\n            <option value=\"\">All Statuses</option>\n            <option value=\"active\">Active</option>\n            <option value=\"inactive\">Inactive</option>\n          </select>\n        ",
        "tableTemplate": "{{object.status}}",
        "attributes": [
          {
            "name": "key",
            "value": "statuses"
          },
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "statuses-field"
          },
          {
            "name": "placeholder",
            "value": "Select app status"
          },
          {
            "name": "required",
            "value": false
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
            "innerText": "All Statuses"
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
        "label": "Type",
        "tagName": "select",
        "filterTemplate": "\n          <select id=\"type-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"type.$in\">\n            <option value=\"default\">Default</option>\n            <option value=\"custom\">Custom</option>\n          </select>\n        ",
        "tableTemplate": "\n          <span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n            {{type}}\n          </span>\n        ",
        "attributes": [
          {
            "name": "key",
            "value": "type"
          },
          {
            "name": "type",
            "value": "multiselect"
          },
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "type-field"
          },
          {
            "name": "placeholder",
            "value": "Select app type"
          },
          {
            "name": "required",
            "value": false
          }
        ],
        "children": [
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "default"
              }
            ],
            "innerText": "Default"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "custom"
              }
            ],
            "innerText": "Custom"
          }
        ]
      },
      {
        "label": "Tags",
        "tagName": "select",
        "filterTemplate": "\n          <select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags.$in\">\n            <option value=\"core\">Core</option>\n            <option value=\"plugin\">Plugin</option>\n            <option value=\"module\">Module</option>\n            <option value=\"extension\">Extension</option>\n          </select>\n        ",
        "tableTemplate": "\n        <span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">\n              {{tags}}\n            </span>\n         ",
        "attributes": [
          {
            "name": "key",
            "value": "tags"
          },
          {
            "name": "type",
            "value": "multiselect"
          },
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "tags-field"
          },
          {
            "name": "placeholder",
            "value": "Select app tags"
          },
          {
            "name": "required",
            "value": false
          }
        ],
        "children": [
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "core"
              }
            ],
            "innerText": "Core"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "plugin"
              }
            ],
            "innerText": "Plugin"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "module"
              }
            ],
            "innerText": "Module"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "extension"
              }
            ],
            "innerText": "Extension"
          }
        ]
      },
      {
        "label": "Main Views",
        "tagName": "select",
        "filterTemplate": "\n          <select id=\"mainViews-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"mainViews.$in\">\n            <option value=\"table\">Table</option>\n            <option value=\"grid\">Grid</option>\n            <option value=\"kanban\">Kanban</option>\n          </select>\n        ",
        "tableTemplate": "\n          <span render=\"object.mainViews\" render-as=\"mainViews\" template class=\"badge bg-primary-subtle text-primary me-1\">\n            {{mainViews}}\n          </span>\n        ",
        "attributes": [
          {
            "name": "key",
            "value": "mainViews"
          },
          {
            "name": "multiple",
            "value": ""
          },
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "mainViews-field"
          },
          {
            "name": "placeholder",
            "value": "Select main views"
          },
          {
            "name": "required",
            "value": false
          }
        ],
        "children": [
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "table"
              }
            ],
            "innerText": "Table"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "grid"
              }
            ],
            "innerText": "Grid"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "kanban"
              }
            ],
            "innerText": "Kanban"
          }
        ]
      },
      {
        "label": "Secondary Views",
        "tagName": "select",
        "filterTemplate": "\n          <select id=\"secondaryViews-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"secondaryViews.$in\">\n            <option value=\"details\">Details</option>\n            <option value=\"form\">Form</option>\n          </select>\n        ",
        "tableTemplate": "\n          <span render=\"object.secondaryViews\" render-as=\"secondaryViews\" template class=\"badge bg-primary-subtle text-primary me-1\">\n            {{secondaryViews}}\n          </span>\n        ",
        "attributes": [
          {
            "name": "key",
            "value": "secondaryViews"
          },
          {
            "name": "type",
            "value": "multiselect"
          },
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "secondaryViews-field"
          },
          {
            "name": "placeholder",
            "value": "Select secondary views"
          },
          {
            "name": "required",
            "value": false
          }
        ],
        "children": [
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "details"
              }
            ],
            "innerText": "Details"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "form"
              }
            ],
            "innerText": "Form"
          }
        ]
      },
      {
        "label": "Fields",
        "tagName": "textarea",
        "attributes": [
          {
            "name": "key",
            "value": "fields"
          },
          {
            "name": "type",
            "value": "json"
          },
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "fields-field"
          },
          {
            "name": "placeholder",
            "value": "Enter fields as JSON"
          },
          {
            "name": "required",
            "value": false
          }
        ]
      }
    ]
  },
  "upsert": true
};