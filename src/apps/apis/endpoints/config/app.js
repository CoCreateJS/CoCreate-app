/********************************************************************************
 * Copyright (C) 2023 CoCreate and Contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 ********************************************************************************/

module.exports = {
  "method": "object.update",
  "upsert": true,
  "array": "apps",
  "object": {
    "_id": "68741e1d07a037d0d6d00eef",
    "name": "Endpoints",
    "singularName": "Endpoint",
    "path": "apps/apis/endpoints",
    "array": "endpoints",
    "category": "Integrations",
    "mainViews": [
      "table",
      "grid"
    ],
    "secondaryViews": [
      "details",
      "form"
    ],
    "icon": "ri-terminal-box-line",
    "description": "Configure individual outbound REST API endpoints, paths, parameter configurations, and system action flows.",
    "status": "active",
    "fields": [
      {
        "label": "API Provider",
        "tagName": "select",
        "filterTemplate": "<select id=\"provider-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"api_id\"><option value=\"\">Filter by Provider</option><option template value=\"{{object._id}}\">{{object.name}}</option></select><div array=\"apis\" render-query=\"$previous\"></div>",
        "tableTemplate": "<span class=\"text-uppercase fw-semibold text-primary\" array=\"apis\" object=\"{{object.api_id}}\" key=\"name\"></span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "endpoint-provider-field"
          },
          {
            "name": "key",
            "value": "api_id"
          },
          {
            "name": "required",
            "value": true
          }
        ]
      },
      {
        "label": "Endpoint",
        "tagName": "input",
        "filterTemplate": "<input id=\"endpoint-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by route (e.g. POST /customers)\" filter-query=\"$document .list-view\" filter-query-key=\"endpoint.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "\n\t\t\t\t\t<div class=\"d-flex align-items-center\">\n\t\t\t\t\t\t<a role=\"button\" tabindex=\"0\" class=\"flex-grow-1 font-monospace fs-13\" state-to=\"offcanvas-app-view\" state.src=\"/apps/apis/endpoints/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\">\n\t\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"endpoints\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t\t<code>{{object.endpoint}}</code>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</div>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-control font-monospace"
          },
          {
            "name": "id",
            "value": "endpoint-route-field"
          },
          {
            "name": "placeholder",
            "value": "e.g. POST /customers"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "endpoint"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Path Override",
        "tagName": "input",
        "filterTemplate": "<input id=\"path-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by path override\" filter-query=\"$document .list-view\" filter-query-key=\"path.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "<code class=\"text-muted\">{{object.path}}</code>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "endpoint-path-field"
          },
          {
            "name": "placeholder",
            "value": "e.g. /customers"
          },
          {
            "name": "required",
            "value": false
          },
          {
            "name": "key",
            "value": "path"
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
        "filterTemplate": "<input id=\"endpoint-description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Search descriptions...\" filter-query=\"$document .list-view\" filter-query-key=\"description.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "<span class=\"text-truncate d-inline-block\" style=\"max-width: 200px;\">{{object.description}}</span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "endpoint-description-field"
          },
          {
            "name": "placeholder",
            "value": "Describe this endpoint's transaction..."
          },
          {
            "name": "key",
            "value": "description"
          }
        ]
      },
      {
        "label": "Status",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"endpoint-status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option value=\"active\">Active</option>\n\t\t\t\t\t\t<option value=\"inactive\">Inactive</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span class=\"badge {{#if (eq object.status 'active')}}bg-success-subtle text-success{{else}}bg-danger-subtle text-danger{{/if}}\">{{object.status}}</span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "endpoint-status-field"
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
        ]
      }
    ]
  }
};