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
        "_id": "6b0900000000000000000001",
        "name": "Workflows",
        "singularName": "Workflow",
        "path": "/apps/workflows",
        "card": "/apps/workflows/components/card.html",
        "cardTemplate": "/apps/workflows/templates/card.html",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "workflows",
        "category": "Settings",
        "mainViews": [
            "table",
            "grid"
        ],
        "secondaryViews": [
            "details",
            "form"
        ],
        "icon": "/assets/svg/remix/node-tree.svg",
        "description": "Create and maintain named workflows, their actions, and enabled status.",
        "status": "active",
        "fields": [
            {
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"workflow-name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by name\" filter-query=\"$document .list-view\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" class=\"name\" state-to=\"offcanvas-app-view\" state.src=\"/apps/workflows/app.html\" aria-controls=\"offcanvas-app\" aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n            <div state-to=\"offcanvas-app-form\" state.array=\"workflows\" state.object=\"{{object._id}}\"></div>\n            <span>{{object.name}}</span>\n          </a>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "workflow-name"
                    },
                    {
                        "name": "key",
                        "value": "name"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    },
                    {
                        "name": "required",
                        "value": true
                    }
                ]
            },
            {
                "label": "Description",
                "tagName": "textarea",
                "filterTemplate": "<input id=\"workflow-description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by description\" filter-query=\"$document .list-view\" filter-query-key=\"description.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "<span>{{object.description}}</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "workflow-description"
                    },
                    {
                        "name": "key",
                        "value": "description"
                    }
                ]
            },
            {
                "label": "Enabled",
                "tagName": "input",
                "filterTemplate": "<select id=\"workflow-enabled-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"enabled\"><option value=\"\">Any state</option><option value=\"true\" value-type=\"boolean\">Enabled</option><option value=\"false\" value-type=\"boolean\">Disabled</option></select>",
                "tableTemplate": "<span class=\"badge bg-secondary-subtle text-secondary text-uppercase\">{{object.enabled}}</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-check-input"
                    },
                    {
                        "name": "id",
                        "value": "workflow-enabled"
                    },
                    {
                        "name": "key",
                        "value": "enabled"
                    },
                    {
                        "name": "type",
                        "value": "checkbox"
                    }
                ]
            },
            {
                "label": "Updated",
                "tagName": "input",
                "filterTemplate": "",
                "tableTemplate": "{{object.updated.on}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "workflow-updated"
                    },
                    {
                        "name": "key",
                        "value": "updated.on"
                    },
                    {
                        "name": "type",
                        "value": "date"
                    },
                    {
                        "name": "readonly",
                        "value": true
                    }
                ]
            }
        ]
    }
};
