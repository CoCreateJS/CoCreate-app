/********************************************************************************
 * Copyright (C) 2023-2026 CoCreate and Contributors.
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
        "_id": "68741e1d07a037d0d6d00ef0",
        "name": "Webhooks",
        "singularName": "Webhook",
        "path": "/apps/apis/webhooks",
        "card": "/apps/apis/webhooks/components/card.html",
        "cardTemplate": "/apps/apis/webhooks/templates/card.html",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "webhooks",
        "category": "Settings",
        "mainViews": [
            "table",
            "grid"
        ],
        "secondaryViews": [
            "form"
        ],
        "icon": "/assets/svg/remix/bubble-chart-line.svg",
        "description": "Manage inbound provider routes, signature verification, event processing, and response AST pipelines.",
        "status": "active",
        "fields": [
            {
                "label": "Webhook Path",
                "tagName": "input",
                "filterTemplate": "<input id=\"webhook-path-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by path\" filter-query=\"$document .list-view\" filter-query-key=\"path.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" class=\"name font-monospace\" state-to=\"offcanvas-app-view\" state.src=\"/apps/apis/webhooks/aside.html\" aria-controls=\"offcanvas-app\" aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n            <div state-to=\"offcanvas-app-form\" state.array=\"webhooks\" state.object=\"{{object._id}}\"></div>\n            <code>/webhooks/{{object.path}}</code>\n          </a>\n        ",
                "attributes": [
                    { "name": "class", "value": "form-control font-monospace" },
                    { "name": "id", "value": "webhook-path" },
                    { "name": "key", "value": "path" },
                    { "name": "type", "value": "text" },
                    { "name": "required", "value": true }
                ]
            },
            {
                "label": "API Provider",
                "tagName": "select",
                "filterTemplate": "<select id=\"webhook-api-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"api_id\"><option value=\"\">All providers</option><option template value=\"{{object._id}}\">{{object.name}}</option></select><div array=\"apis\" render-query=\"$previous\"></div>",
                "tableTemplate": "<span class=\"text-uppercase fw-semibold text-primary\" array=\"apis\" object=\"{{object.api_id}}\" key=\"name\"></span>",
                "attributes": [
                    { "name": "class", "value": "form-select" },
                    { "name": "id", "value": "webhook-api" },
                    { "name": "key", "value": "api_id" },
                    { "name": "required", "value": true }
                ]
            },
            {
                "label": "Enabled",
                "tagName": "input",
                "filterTemplate": "<select id=\"webhook-enabled-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"enabled\"><option value=\"\">Any state</option><option value=\"true\" value-type=\"boolean\">Enabled</option><option value=\"false\" value-type=\"boolean\">Disabled</option></select>",
                "tableTemplate": "<span class=\"badge bg-secondary-subtle text-secondary text-uppercase\">{{object.enabled}}</span>",
                "attributes": [
                    { "name": "class", "value": "form-check-input" },
                    { "name": "id", "value": "webhook-enabled" },
                    { "name": "key", "value": "enabled" },
                    { "name": "type", "value": "checkbox" }
                ]
            },
            {
                "label": "Description",
                "tagName": "textarea",
                "filterTemplate": "<input id=\"webhook-description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Search descriptions\" filter-query=\"$document .list-view\" filter-query-key=\"description.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "<span class=\"text-truncate d-inline-block\" style=\"max-width: 300px\">{{object.description}}</span>",
                "attributes": [
                    { "name": "class", "value": "form-control" },
                    { "name": "id", "value": "webhook-description" },
                    { "name": "key", "value": "description" },
                    { "name": "type", "value": "text" },
                    { "name": "required", "value": true }
                ]
            },
            {
                "label": "Modified",
                "tagName": "input",
                "filterTemplate": "",
                "tableTemplate": "{{object.modified.on}}",
                "attributes": [
                    { "name": "class", "value": "form-control" },
                    { "name": "id", "value": "webhook-modified" },
                    { "name": "key", "value": "modified.on" },
                    { "name": "type", "value": "date" },
                    { "name": "readonly", "value": true }
                ]
            }
        ]
    }
};
