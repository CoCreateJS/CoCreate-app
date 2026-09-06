/********************************************************************************
 * Copyright (C) 2026 CoCreate and Contributors.
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

export default {
  "method": "object.update",
  "upsert": true,
  "array": "apps",
  "object": {
    "_id": "6a96308fbe321a28ad3edec1",
    "name": "Server Configs",
    "singularName": "Server Config",
    "path": "apps/servers/configs",
    "card": "/apps/servers/configs/card.html",
    "cardTemplate": "/apps/servers/configs/card-template.html",
    "array": "servers_config",
    "category": "Settings",
    "mainViews": [
      "table",
      "grid"
    ],
    "secondaryViews": [
      "form"
    ],
    "icon": "ri-settings-3-line",
    "description": "Manage scoped runtime configuration for servers, workers, storage drivers, telemetry, autoscaling, and AI.",
    "status": "active",
    "fields": [
      {
        "label": "Name",
        "tagName": "input",
        "filterTemplate": "<input id=\"server-config-name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by name\" filter-query=\"$document .list-view\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" class=\"name\" state-to=\"offcanvas-app-view\" state.src=\"/apps/servers/configs/form.html\" aria-controls=\"offcanvas-app\" aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n            <div state-to=\"offcanvas-app-form\" state.array=\"servers_config\" state.object=\"{{object._id}}\"></div>\n            <span>{{object.name}}</span>\n          </a>\n        ",
        "attributes": [
          { "name": "class", "value": "form-control" },
          { "name": "id", "value": "server-config-name" },
          { "name": "key", "value": "name" },
          { "name": "type", "value": "text" },
          { "name": "required", "value": true }
        ]
      },
      {
        "label": "Type",
        "tagName": "input",
        "filterTemplate": "<select id=\"server-config-type-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"type\"><option value=\"\">All types</option><option value=\"ai\">AI</option><option value=\"autoscaler\">Autoscaler</option><option value=\"storage\">Storage</option><option value=\"telemetry\">Telemetry</option></select>",
        "tableTemplate": "<span class=\"badge bg-primary-subtle text-primary text-uppercase\">{{object.type}}</span>",
        "attributes": [
          { "name": "class", "value": "form-control" },
          { "name": "id", "value": "server-config-type" },
          { "name": "key", "value": "type" },
          { "name": "type", "value": "text" },
          { "name": "required", "value": true }
        ]
      },
      {
        "label": "Provider",
        "tagName": "input",
        "filterTemplate": "<input id=\"server-config-provider-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by provider\" filter-query=\"$document .list-view\" filter-query-key=\"provider.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.provider}}",
        "attributes": [
          { "name": "class", "value": "form-control" },
          { "name": "id", "value": "server-config-provider" },
          { "name": "key", "value": "provider" },
          { "name": "type", "value": "text" }
        ]
      },
      {
        "label": "Cluster",
        "tagName": "input",
        "filterTemplate": "<input id=\"server-config-cluster-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by cluster\" filter-query=\"$document .list-view\" filter-query-key=\"cluster\" />",
        "tableTemplate": "<code>{{object.cluster}}</code>",
        "attributes": [
          { "name": "class", "value": "form-control" },
          { "name": "id", "value": "server-config-cluster" },
          { "name": "key", "value": "cluster" },
          { "name": "type", "value": "text" }
        ]
      },
      {
        "label": "Server",
        "tagName": "input",
        "filterTemplate": "<input id=\"server-config-server-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by server\" filter-query=\"$document .list-view\" filter-query-key=\"server\" />",
        "tableTemplate": "<code>{{object.server}}</code>",
        "attributes": [
          { "name": "class", "value": "form-control" },
          { "name": "id", "value": "server-config-server" },
          { "name": "key", "value": "server" },
          { "name": "type", "value": "text" }
        ]
      },
      {
        "label": "Worker",
        "tagName": "input",
        "filterTemplate": "<input id=\"server-config-worker-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by worker\" filter-query=\"$document .list-view\" filter-query-key=\"worker\" />",
        "tableTemplate": "<code>{{object.worker}}</code>",
        "attributes": [
          { "name": "class", "value": "form-control" },
          { "name": "id", "value": "server-config-worker" },
          { "name": "key", "value": "worker" },
          { "name": "type", "value": "text" }
        ]
      },
      {
        "label": "Enabled",
        "tagName": "input",
        "filterTemplate": "<select id=\"server-config-enabled-filter\" class=\"form-select\" value-type=\"boolean\" filter-query=\"$document .list-view\" filter-query-key=\"enabled\"><option value=\"\">Any state</option><option value=\"true\">Enabled</option><option value=\"false\">Disabled</option></select>",
        "tableTemplate": "<span class=\"badge bg-secondary-subtle text-secondary text-uppercase\">{{object.enabled}}</span>",
        "attributes": [
          { "name": "class", "value": "form-check-input" },
          { "name": "id", "value": "server-config-enabled" },
          { "name": "key", "value": "enabled" },
          { "name": "type", "value": "checkbox" }
        ]
      },
      {
        "label": "Modified",
        "tagName": "input",
        "filterTemplate": "",
        "tableTemplate": "{{object.modified.on}}",
        "attributes": [
          { "name": "class", "value": "form-control" },
          { "name": "id", "value": "server-config-modified" },
          { "name": "key", "value": "modified.on" },
          { "name": "type", "value": "date" },
          { "name": "readonly", "value": true }
        ]
      }
    ]
  }
};
