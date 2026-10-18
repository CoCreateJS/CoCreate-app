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
        "_id": "68741e1d07a037d0d6d00eef",
        "name": "Endpoints",
        "singularName": "Endpoint",
        "path": "/apps/endpoints",
        "card": "/apps/endpoints/components/card.html",
        "cardTemplate": "/apps/endpoints/templates/card.html",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "endpoints",
        "category": "Settings",
        "mainViews": [
            "table",
            "grid"
        ],
        "secondaryViews": [
            "form"
        ],
        "icon": "/assets/svg/remix/terminal-box-line.svg",
        "description": "Manage reusable outbound API operations and their executable AST request configuration.",
        "status": "active",
        "fields": [
            {
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"endpoint-name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by name\" filter-query=\"$document .list-view\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" class=\"name\" state-to=\"offcanvas-app-view\" state.src=\"/apps/endpoints/app.html\" aria-controls=\"offcanvas-app\" aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n            <div state-to=\"offcanvas-app-form\" state.array=\"endpoints\" state.object=\"{{object._id}}\"></div>\n            <span>{{object.name}}</span>\n          </a>\n        ",
                "attributes": [
                    { "name": "class", "value": "form-control" },
                    { "name": "id", "value": "endpoint-name" },
                    { "name": "key", "value": "name" },
                    { "name": "type", "value": "text" },
                    { "name": "required", "value": true }
                ]
            },
            {
                "label": "API Provider",
                "tagName": "select",
                "filterTemplate": "<select id=\"endpoint-api-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"api_id\"><option value=\"\">All providers</option><option template value=\"{{object._id}}\">{{object.name}}</option></select><div array=\"apis\" render-query=\"$previous\"></div>",
                "tableTemplate": "<span class=\"text-uppercase fw-semibold text-primary\" array=\"apis\" object=\"{{object.api_id}}\" key=\"name\"></span>",
                "attributes": [
                    { "name": "class", "value": "form-select" },
                    { "name": "id", "value": "endpoint-api" },
                    { "name": "key", "value": "api_id" },
                    { "name": "required", "value": true }
                ]
            },
            {
                "label": "Method",
                "tagName": "select",
                "filterTemplate": "<select id=\"endpoint-method-filter\" class=\"form-select text-uppercase\" filter-query=\"$document .list-view\" filter-query-key=\"method\"><option value=\"\">All methods</option><option value=\"get\">GET</option><option value=\"post\">POST</option><option value=\"put\">PUT</option><option value=\"patch\">PATCH</option><option value=\"delete\">DELETE</option></select>",
                "tableTemplate": "<span class=\"badge bg-primary-subtle text-primary text-uppercase\">{{object.method}}</span>",
                "attributes": [
                    { "name": "class", "value": "form-select text-uppercase" },
                    { "name": "id", "value": "endpoint-method" },
                    { "name": "key", "value": "method" },
                    { "name": "required", "value": true }
                ],
                "children": [
                    { "tagName": "option", "attributes": [{ "name": "value", "value": "get" }], "innerText": "GET" },
                    { "tagName": "option", "attributes": [{ "name": "value", "value": "post" }], "innerText": "POST" },
                    { "tagName": "option", "attributes": [{ "name": "value", "value": "put" }], "innerText": "PUT" },
                    { "tagName": "option", "attributes": [{ "name": "value", "value": "patch" }], "innerText": "PATCH" },
                    { "tagName": "option", "attributes": [{ "name": "value", "value": "delete" }], "innerText": "DELETE" }
                ]
            },
            {
                "label": "Endpoint",
                "tagName": "textarea",
                "filterTemplate": "<input id=\"endpoint-route-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by endpoint\" filter-query=\"$document .list-view\" filter-query-key=\"endpoint.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "<code>{{object.endpoint}}</code>",
                "attributes": [
                    { "name": "class", "value": "form-control font-monospace" },
                    { "name": "id", "value": "endpoint-route" },
                    { "name": "key", "value": "endpoint" },
                    { "name": "type", "value": "json" },
                    { "name": "required", "value": true }
                ]
            },
            {
                "label": "Enabled",
                "tagName": "input",
                "filterTemplate": "<select id=\"endpoint-enabled-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"enabled\"><option value=\"\">Any state</option><option value=\"true\" value-type=\"boolean\">Enabled</option><option value=\"false\" value-type=\"boolean\">Disabled</option></select>",
                "tableTemplate": "<span class=\"badge bg-secondary-subtle text-secondary text-uppercase\">{{object.enabled}}</span>",
                "attributes": [
                    { "name": "class", "value": "form-check-input" },
                    { "name": "id", "value": "endpoint-enabled" },
                    { "name": "key", "value": "enabled" },
                    { "name": "type", "value": "checkbox" }
                ]
            },
            {
                "label": "Description",
                "tagName": "textarea",
                "filterTemplate": "<input id=\"endpoint-description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Search descriptions\" filter-query=\"$document .list-view\" filter-query-key=\"description.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "<span class=\"text-truncate d-inline-block\" style=\"max-width: 250px\">{{object.description}}</span>",
                "attributes": [
                    { "name": "class", "value": "form-control" },
                    { "name": "id", "value": "endpoint-description" },
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
                    { "name": "id", "value": "endpoint-modified" },
                    { "name": "key", "value": "modified.on" },
                    { "name": "type", "value": "date" },
                    { "name": "readonly", "value": true }
                ]
            }
        ]
    }
};
