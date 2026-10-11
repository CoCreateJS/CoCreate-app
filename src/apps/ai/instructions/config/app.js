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
        "_id": "db642be613418dda0ef345a1",
        "name": "AI Instructions",
        "singularName": "AI Instruction",
        "path": "/apps/ai/instructions",
        "card": "/apps/ai/instructions/components/card.html",
        "cardTemplate": "/apps/ai/instructions/templates/card.html",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "ai-instructions",
        "category": "Settings",
        "mainViews": [
            "table",
            "grid"
        ],
        "secondaryViews": [
            "details",
            "form"
        ],
        "icon": "/assets/svg/remix/file-list-3-line.svg",
        "description": "Manage runtime instructions and capability context used by CoCreate AI.",
        "status": "active",
        "fields": [
            {
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"ai-instruction-name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by name\" filter-query=\"$document .list-view\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" class=\"name\" state-to=\"offcanvas-app-view\" state.src=\"/apps/ai/instructions/app.html\" aria-controls=\"offcanvas-app\" aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n            <div state-to=\"offcanvas-app-form\" state.array=\"ai-instructions\" state.object=\"{{object._id}}\"></div>\n            <span>{{object.name}}</span>\n          </a>\n        ",
                "attributes": [
                    { "name": "class", "value": "form-control" },
                    { "name": "id", "value": "ai-instruction-name" },
                    { "name": "key", "value": "name" },
                    { "name": "type", "value": "text" },
                    { "name": "required", "value": true }
                ]
            },
            {
                "label": "Default",
                "tagName": "input",
                "filterTemplate": "<select id=\"ai-instruction-default-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"default\"><option value=\"\">Any state</option><option value=\"true\" value-type=\"boolean\">Default</option><option value=\"false\" value-type=\"boolean\">Not default</option></select>",
                "tableTemplate": "<span class=\"badge bg-secondary-subtle text-secondary text-uppercase\">{{object.default}}</span>",
                "attributes": [
                    { "name": "class", "value": "form-check-input" },
                    { "name": "id", "value": "ai-instruction-default" },
                    { "name": "key", "value": "default" },
                    { "name": "type", "value": "checkbox" }
                ]
            },
            {
                "label": "Enabled",
                "tagName": "input",
                "filterTemplate": "<select id=\"ai-instruction-enabled-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"enabled\"><option value=\"\">Any state</option><option value=\"true\" value-type=\"boolean\">Enabled</option><option value=\"false\" value-type=\"boolean\">Disabled</option></select>",
                "tableTemplate": "<span class=\"badge bg-secondary-subtle text-secondary text-uppercase\">{{object.enabled}}</span>",
                "attributes": [
                    { "name": "class", "value": "form-check-input" },
                    { "name": "id", "value": "ai-instruction-enabled" },
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
                    { "name": "id", "value": "ai-instruction-modified" },
                    { "name": "key", "value": "modified.on" },
                    { "name": "type", "value": "date" },
                    { "name": "readonly", "value": true }
                ]
            }
        ]
    }
};
