/********************************************************************************
 * Copyright (C) 2026 CoCreate and Contributors.
 *
 * Licensed under GNU AGPLv3.
 ********************************************************************************/

export default {
    method: "object.update",
    upsert: true,
    array: "apps",
    object: {
        _id: "28b6ddbe8b35de252ecd79e1",
        name: "Clusters",
        singularName: "Cluster",
        path: "/apps/clusters",
        card: "/apps/clusters/card.html",
        cardTemplate: "/apps/clusters/templates/card.html",
        templates: {
            card: "templates/card.html",
            list: "templates/list.html"
        },
        array: "clusters",
        category: "Infrastructure",
        mainViews: ["table", "grid"],
        secondaryViews: ["details", "form"],
        icon: "ri-stack-line",
        description: "Manage persistent clusters and inspect their server capacity.",
        status: "active",
        fields: [
            {
                label: "Name",
                tagName: "input",
                filterTemplate: '<input id="cluster-name-filter" class="form-control" type="text" placeholder="Filter by name" filter-query="$document .list-view" filter-query-key="name.$regex" filter-query-options="i" />',
                tableTemplate: `
                    <a role="button" tabindex="0" class="name" state-to="offcanvas-app-view" state.src="/apps/clusters/details.html" aria-controls="offcanvas-app" aria-expanded="false" aria-open>
                        <div state-to="offcanvas-app-form" state.array="clusters" state.object="{{object._id}}"></div>
                        <span>{{object.name}}</span>
                    </a>
                `,
                attributes: [
                    { name: "class", value: "form-control" },
                    { name: "id", value: "cluster-name" },
                    { name: "key", value: "name" },
                    { name: "type", value: "text" },
                    { name: "required", value: true }
                ]
            },
            {
                label: "Servers",
                tableTemplate: '<span array="servers" object key="$length" filter-query-key="cluster_id" filter-query-value="{{object._id}}" filter-limit>0</span>',
                attributes: [
                    { name: "key", value: "server_count" },
                    { name: "type", value: "number" },
                    { name: "readonly", value: true }
                ]
            },
            {
                label: "Status",
                tagName: "select",
                filterTemplate: '<select id="cluster-status-filter" class="form-select" filter-query="$document .list-view" filter-query-key="status"><option value="">All statuses</option><option value="queued">Queued</option><option value="provisioning">Provisioning</option><option value="active">Active</option><option value="draining">Draining</option><option value="error">Error</option></select>',
                tableTemplate: '<span class="badge bg-secondary-subtle text-secondary text-uppercase">{{object.status}}</span>',
                attributes: [
                    { name: "class", value: "form-select" },
                    { name: "id", value: "cluster-status" },
                    { name: "key", value: "status" }
                ]
            }
        ]
    }
};
