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
    "_id": "68741e1d07a037d0d6d00ef0",
    "name": "Webhooks",
    "singularName": "Webhook",
    "path": "apps/apis/webhooks",
    "array": "webhooks",
    "category": "Integrations",
    "mainViews": [
      "table",
      "grid"
    ],
    "secondaryViews": [
      "details",
      "form"
    ],
    "icon": "ri-bubble-chart-line",
    "description": "Configure inbound webhooks, paths, dynamic signatures, and sequential event handlers natively using JSON AST.",
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
            "value": "webhook-provider-field"
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
        "label": "Webhook Path",
        "tagName": "input",
        "filterTemplate": "<input id=\"path-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by path (e.g. stripe/payments)\" filter-query=\"$document .list-view\" filter-query-key=\"path.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "\n\t\t\t\t\t<div class=\"d-flex align-items-center\">\n\t\t\t\t\t\t<a role=\"button\" tabindex=\"0\" class=\"flex-grow-1 font-monospace fs-13\" state-to=\"offcanvas-app-view\" state.src=\"/apps/apis/webhooks/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\">\n\t\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"webhooks\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t\t<code>/webhooks/{{object.path}}</code>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</div>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-control font-monospace"
          },
          {
            "name": "id",
            "value": "webhook-path-field"
          },
          {
            "name": "placeholder",
            "value": "e.g. stripe/payments"
          },
          {
            "name": "required",
            "value": true
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
        "label": "Event Locator (Action)",
        "tagName": "input",
        "filterTemplate": "<input id=\"action-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by locator\" filter-query=\"$document .list-view\" filter-query-key=\"action.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "<code class=\"text-muted\">{{object.action}}</code>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control font-monospace"
          },
          {
            "name": "id",
            "value": "webhook-action-field"
          },
          {
            "name": "placeholder",
            "value": "e.g. $event.type"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "action"
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
        "filterTemplate": "\n\t\t\t\t\t<select id=\"webhook-status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option value=\"active\">Active</option>\n\t\t\t\t\t\t<option value=\"inactive\">Inactive</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span class=\"badge {{#if (eq object.status 'active')}}bg-success-subtle text-success{{else}}bg-danger-subtle text-danger{{/if}}\">{{object.status}}</span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "webhook-status-field"
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