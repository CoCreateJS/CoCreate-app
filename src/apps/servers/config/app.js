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
        "_id": "6a96308ff9a6bb732ce54723",
        "name": "Servers",
        "singularName": "Server",
        "path": "/apps/servers",
        "card": "/apps/servers/components/card.html",
        "cardTemplate": "/apps/servers/templates/card.html",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "servers",
        "category": "Settings",
        "mainViews": [
            "table",
            "grid"
        ],
        "secondaryViews": [
            "details",
            "form"
        ],
        "icon": "ri-server-line",
        "description": "Monitor server topology and manage worker control state.",
        "status": "active",
        "fields": [
            {
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"server-name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by name\" filter-query=\"$document .list-view\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" class=\"name d-flex flex-column align-items-start\" state-to=\"offcanvas-app-view\" state.src=\"/apps/servers/aside.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"servers\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object.name}}</span>\n\t\t\t\t\t\t<code class=\"fs-10 text-muted\">{{object._id}}</code>\n\t\t\t\t\t</a>\n\t\t\t\t",
                "attributes": [
                    { "name": "class", "value": "form-control" },
                    { "name": "id", "value": "server-name" },
                    { "name": "key", "value": "name" },
                    { "name": "type", "value": "text" },
                    { "name": "required", "value": true }
                ]
            },
            {
                "label": "Status",
                "tagName": "select",
                "filterTemplate": "<select id=\"server-status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\"><option value=\"\">All statuses</option><option value=\"running\">Running</option><option value=\"stopped\">Stopped</option><option value=\"draining\">Draining</option><option value=\"error\">Error</option></select>",
                "tableTemplate": "<span class=\"badge bg-secondary-subtle text-secondary text-uppercase\">{{object.status}}</span>",
                "attributes": [
                    { "name": "class", "value": "form-select" },
                    { "name": "id", "value": "server-status" },
                    { "name": "key", "value": "status" }
                ]
            },
            {
                "label": "IP Address",
                "tagName": "input",
                "filterTemplate": "<input id=\"server-ip-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by IP\" filter-query=\"$document .list-view\" filter-query-key=\"ip.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "<code>{{object.ip}}</code>",
                "attributes": [
                    { "name": "class", "value": "form-control" },
                    { "name": "id", "value": "server-ip" },
                    { "name": "key", "value": "ip" },
                    { "name": "type", "value": "text" }
                ]
            },
            {
                "label": "Provider",
                "tagName": "input",
                "filterTemplate": "<input id=\"server-provider-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by provider\" filter-query=\"$document .list-view\" filter-query-key=\"infrastructure.provider.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.infrastructure.provider}}",
                "attributes": [
                    { "name": "class", "value": "form-control" },
                    { "name": "id", "value": "server-provider" },
                    { "name": "key", "value": "infrastructure.provider" },
                    { "name": "type", "value": "text" }
                ]
            },
            {
                "label": "Region",
                "tagName": "input",
                "filterTemplate": "<input id=\"server-region-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by region\" filter-query=\"$document .list-view\" filter-query-key=\"infrastructure.region.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "{{object.infrastructure.region}}",
                "attributes": [
                    { "name": "class", "value": "form-control" },
                    { "name": "id", "value": "server-region" },
                    { "name": "key", "value": "infrastructure.region" },
                    { "name": "type", "value": "text" }
                ]
            },
            {
                "label": "Workers",
                "tagName": "input",
                "filterTemplate": "<input id=\"server-workers-filter\" class=\"form-control\" type=\"number\" placeholder=\"Worker count\" filter-query=\"$document .list-view\" filter-query-key=\"totalWorkers\" />",
                "tableTemplate": "{{object.totalWorkers}}",
                "attributes": [
                    { "name": "class", "value": "form-control" },
                    { "name": "id", "value": "server-total-workers" },
                    { "name": "key", "value": "totalWorkers" },
                    { "name": "type", "value": "number" }
                ]
            },
            {
                "label": "Worker Status",
                "tagName": "select",
                "filterTemplate": "<select id=\"worker-status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"worker1.status\"><option value=\"\">All worker statuses</option><option value=\"running\">Running</option><option value=\"stopped\">Stopped</option><option value=\"draining\">Draining</option><option value=\"error\">Error</option></select>",
                "tableTemplate": "{{object.worker1.status}}",
                "attributes": [
                    { "name": "class", "value": "form-select" },
                    { "name": "id", "value": "worker-status" },
                    { "name": "key", "value": "worker1.status" }
                ]
            },
            {
                "label": "Cordoned",
                "tagName": "input",
                "filterTemplate": "",
                "tableTemplate": "{{object.worker1.isCordoned}}",
                "attributes": [
                    { "name": "class", "value": "form-check-input" },
                    { "name": "id", "value": "worker-cordoned" },
                    { "name": "key", "value": "worker1.isCordoned" },
                    { "name": "type", "value": "checkbox" }
                ]
            },
            {
                "label": "Shedding",
                "tagName": "input",
                "filterTemplate": "",
                "tableTemplate": "{{object.worker1.isShedding}}",
                "attributes": [
                    { "name": "class", "value": "form-check-input" },
                    { "name": "id", "value": "worker-shedding" },
                    { "name": "key", "value": "worker1.isShedding" },
                    { "name": "type", "value": "checkbox" }
                ]
            },
            {
                "label": "Draining",
                "tagName": "input",
                "filterTemplate": "",
                "tableTemplate": "{{object.worker1.isDraining}}",
                "attributes": [
                    { "name": "class", "value": "form-check-input" },
                    { "name": "id", "value": "worker-draining" },
                    { "name": "key", "value": "worker1.isDraining" },
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
                    { "name": "id", "value": "server-modified" },
                    { "name": "key", "value": "modified.on" },
                    { "name": "type", "value": "date" },
                    { "name": "readonly", "value": true }
                ]
            }
        ]
    }
};
