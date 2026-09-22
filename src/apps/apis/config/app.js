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

export default {
    "method": "object.update",
    "upsert": true,
    "array": "apps",
    "object": {
        "_id": "68741e1d07a037d0d6d00eee",
        "name": "APIs",
        "singularName": "API",
        "path": "/apps/apis",
        "card": "/apps/apis/components/card.html",
        "listHeader": "/apps/apis/components/type-filter.html",
        "cardTemplate": "/apps/apis/templates/card.html",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "apis",
        "category": "Settings",
        "mainViews": [
            "table",
            "grid"
        ],
        "secondaryViews": [
            "form"
        ],
        "icon": "ri-key-2-line",
        "description": "App to manage and configure third-party API integration keys, base URLs, and connection protocols.",
        "status": "active",
        "fields": [
            {
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by provider (e.g. stripe)\" filter-query=\"$document .list-view\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "\n\t\t\t\t\t<div class=\"d-flex align-items-center\">\n\t\t\t\t\t\t<div class=\"flex-shrink-0\">\n\t\t\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/apis/aside.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\">\n\t\t\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"apis\" state.object=\"{{object._id}}\"></div>\n\n\t\t\t\t\t\t\t\t<div class=\"avatar-xs rounded-circle position-relative overflow-hidden\">\n\t\t\t\t\t\t\t\t\t<div class=\"avatar-title bg-primary-subtle text-primary material-shadow\">\n\t\t\t\t\t\t\t\t\t\t<span class=\"avatar-initial\">{{object.name[0]}}</span>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t</a>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<a role=\"button\" tabindex=\"0\" class=\"d-flex align-items-center align-self-stretch flex-grow-1 ms-2 name text-capitalize\" state-to=\"offcanvas-app-view\" state.src=\"/apps/apis/aside.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\">\n\t\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"apis\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t\t<span>{{object.name}}</span>\n\t\t\t\t\t\t</a>\n\t\t\t\t\t</div>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "api-name-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter API provider name"
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
                ]
            },
            {
                "label": "Base URL",
                "tagName": "input",
                "filterTemplate": "<input id=\"url-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter by URL\" filter-query=\"$document .list-view\" filter-query-key=\"url.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "<code>{{object.url}}</code>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "api-url-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "https://api.provider.com/v1"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "url"
                    },
                    {
                        "name": "type",
                        "value": "url"
                    }
                ]
            },
            {
                "label": "Description",
                "tagName": "textarea",
                "filterTemplate": "<input id=\"description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Search description\" filter-query=\"$document .list-view\" filter-query-key=\"description.$regex\" filter-query-options=\"i\" />",
                "tableTemplate": "<span class=\"text-truncate d-inline-block\" style=\"max-width: 250px;\">{{object.description}}</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "api-description-field"
                    },
                    {
                        "name": "placeholder",
                        "value": "Describe this integration..."
                    },
                    {
                        "name": "required",
                        "value": false
                    },
                    {
                        "name": "key",
                        "value": "description"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Enabled",
                "tagName": "input",
                "filterTemplate": "<select id=\"api-enabled-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"enabled\"><option value=\"\">Any state</option><option value=\"true\" value-type=\"boolean\">Enabled</option><option value=\"false\" value-type=\"boolean\">Disabled</option></select>",
                "tableTemplate": "<link rel=\"stylesheet\" href=\"/apps/apis/templates/card.css\" /><span class=\"apis-grid-badges apis-grid-status\" data-enabled=\"{{object.enabled}}\" role=\"status\" aria-label=\"API status\"><span class=\"apis-grid-enabled badge border border-success text-success\">Enabled</span><span class=\"apis-grid-disabled badge border text-muted\">Disabled</span></span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-check-input"
                    },
                    {
                        "name": "id",
                        "value": "api-enabled-field"
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
            }
        ]
    }
};
