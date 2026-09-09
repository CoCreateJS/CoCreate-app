export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "686ecb750cb20318c29a050c",
        "name": "Opportunities",
        "singularName": "Opportunity",
        "path": "/apps/opportunities",
        "card": "/apps/opportunities/card.html",
        "cardTemplate": "/apps/opportunities/card-template.html",
        "array": "opportunities",
        "category": "CRM",
        "mainViews": [
            "table",
            "grid",
            "kanban"
        ],
        "secondaryViews": [
            "details",
            "form"
        ],
        "icon": "ri-hand-coin-line",
        "description": "App to manage and track Opportunities.",
        "status": "active",
        "fields": [
            {
                "label": "Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter Name\" filter-query=\"$document .list-view\" filter-query-key=\"name\" />",
                "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/opportunities/details.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"opportunities\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object.name}}</span>\n\t\t\t\t\t</a>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-name"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter opportunity name"
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
                "label": "Description",
                "tagName": "textarea",
                "tableTemplate": "{{object.description}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-description"
                    },
                    {
                        "name": "rows",
                        "value": 3
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter a brief description"
                    },
                    {
                        "name": "key",
                        "value": "description"
                    },
                    {
                        "name": "type",
                        "value": "textarea"
                    }
                ]
            },
            {
                "label": "Contact Name",
                "tagName": "input",
                "tableTemplate": "{{object.contact_name}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "contact-name"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter contact name"
                    },
                    {
                        "name": "key",
                        "value": "contact_name"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Company",
                "tagName": "input",
                "tableTemplate": "{{object.company}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-company"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter company name"
                    },
                    {
                        "name": "key",
                        "value": "company"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Amount",
                "tagName": "input",
                "tableTemplate": "{{object.amount}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-amount"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter amount"
                    },
                    {
                        "name": "min",
                        "value": 0
                    },
                    {
                        "name": "key",
                        "value": "amount"
                    },
                    {
                        "name": "type",
                        "value": "number"
                    }
                ]
            },
            {
                "label": "Closing Date",
                "tagName": "input",
                "tableTemplate": "{{object.closing_date}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "closing-date"
                    },
                    {
                        "name": "date-picker",
                        "value": "flatpickr"
                    },
                    {
                        "name": "placeholder",
                        "value": "Select closing date"
                    },
                    {
                        "name": "key",
                        "value": "closing_date"
                    },
                    {
                        "name": "type",
                        "value": "dat"
                    }
                ]
            },
            {
                "label": "Owner",
                "tagName": "input",
                "tableTemplate": "{{object.assigned_to}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-owner"
                    },
                    {
                        "name": "placeholder",
                        "value": "Assigned user or owner"
                    },
                    {
                        "name": "key",
                        "value": "assigned_to"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Lead Source",
                "tagName": "select",
                "options": [
                    {
                        "value": "Website",
                        "label": "Website"
                    },
                    {
                        "value": "Referral",
                        "label": "Referral"
                    },
                    {
                        "value": "Event",
                        "label": "Event"
                    },
                    {
                        "value": "Email",
                        "label": "Email"
                    },
                    {
                        "value": "Cold Call",
                        "label": "Cold Call"
                    }
                ],
                "tableTemplate": "{{object.lead_source}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-lead-source"
                    },
                    {
                        "name": "key",
                        "value": "lead_source"
                    }
                ],
                "children": [
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Website" }
                        ],
                        "innerText": "Website"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Referral" }
                        ],
                        "innerText": "Referral"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Event" }
                        ],
                        "innerText": "Event"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Email" }
                        ],
                        "innerText": "Email"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Cold Call" }
                        ],
                        "innerText": "Cold Call"
                    }
                ]
            },
            {
                "label": "Probability (%)",
                "tagName": "input",
                "tableTemplate": "{{object.probability}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-probability"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter probability (0-100)"
                    },
                    {
                        "name": "min",
                        "value": 0
                    },
                    {
                        "name": "max",
                        "value": 100
                    },
                    {
                        "name": "key",
                        "value": "probability"
                    },
                    {
                        "name": "type",
                        "value": "number"
                    }
                ]
            },
            {
                "label": "Expected Revenue",
                "tagName": "input",
                "tableTemplate": "{{object.expected_revenue}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-expected-revenue"
                    },
                    {
                        "name": "placeholder",
                        "value": "Estimated revenue (numeric)"
                    },
                    {
                        "name": "min",
                        "value": 0
                    },
                    {
                        "name": "key",
                        "value": "expected_revenue"
                    },
                    {
                        "name": "type",
                        "value": "number"
                    }
                ]
            },
            {
                "label": "Currency",
                "tagName": "select",
                "tableTemplate": "{{object.currency}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-currency"
                    },
                    {
                        "name": "key",
                        "value": "currency"
                    }
                ],
                "children": [
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "USD" }
                        ],
                        "innerText": "USD"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "EUR" }
                        ],
                        "innerText": "EUR"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "GBP" }
                        ],
                        "innerText": "GBP"
                    }
                ]
            },
            {
                "label": "Next Steps",
                "tagName": "textarea",
                "tableTemplate": "{{object.next_steps}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-next-steps"
                    },
                    {
                        "name": "rows",
                        "value": 2
                    },
                    {
                        "name": "placeholder",
                        "value": "Next actions / follow ups"
                    },
                    {
                        "name": "key",
                        "value": "next_steps"
                    }
                ]
            },
            {
                "label": "Products",
                "tagName": "select",
                "tableTemplate": "<span render=\"object.products\" render-as=\"product\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{product}}\n</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-products"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "products"
                    }
                ],
                "children": [
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Product A" }
                        ],
                        "innerText": "Product A"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Product B" }
                        ],
                        "innerText": "Product B"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Service X" }
                        ],
                        "innerText": "Service X"
                    }
                ]
            },
            {
                "label": "Stage",
                "options": [
                    {
                        "value": "Prospecting",
                        "label": "Prospecting"
                    },
                    {
                        "value": "Qualified",
                        "label": "Qualified"
                    },
                    {
                        "value": "Proposal Sent",
                        "label": "Proposal Sent"
                    },
                    {
                        "value": "Negotiation",
                        "label": "Negotiation"
                    },
                    {
                        "value": "Closed Won",
                        "label": "Closed Won"
                    },
                    {
                        "value": "Closed Lost",
                        "label": "Closed Lost"
                    }
                ],
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"stage-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"stage\">\n\t\t\t\t\t\t<option value=\"\">Select Stage</option>\n\t\t\t\t\t\t<option value=\"Prospecting\">Prospecting</option>\n\t\t\t\t\t\t<option value=\"Qualified\">Qualified</option>\n\t\t\t\t\t\t<option value=\"Proposal Sent\">Proposal Sent</option>\n\t\t\t\t\t\t<option value=\"Negotiation\">Negotiation</option>\n\t\t\t\t\t\t<option value=\"Closed Won\">Closed Won</option>\n\t\t\t\t\t\t<option value=\"Closed Lost\">Closed Lost</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.stage}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-stage"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "stage"
                    }
                ],
                "children": [
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "" }
                        ],
                        "innerText": "Select Stage"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Prospecting" }
                        ],
                        "innerText": "Prospecting"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Qualified" }
                        ],
                        "innerText": "Qualified"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Proposal Sent" }
                        ],
                        "innerText": "Proposal Sent"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Negotiation" }
                        ],
                        "innerText": "Negotiation"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Closed Won" }
                        ],
                        "innerText": "Closed Won"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Closed Lost" }
                        ],
                        "innerText": "Closed Lost"
                    }
                ]
            },
            {
                "label": "Priority",
                "options": [
                    {
                        "value": "High",
                        "label": "High"
                    },
                    {
                        "value": "Medium",
                        "label": "Medium"
                    },
                    {
                        "value": "Low",
                        "label": "Low"
                    }
                ],
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"priority-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"priority\">\n\t\t\t\t\t\t<option value=\"\">Select Priority</option>\n\t\t\t\t\t\t<option value=\"High\">High</option>\n\t\t\t\t\t\t<option value=\"Medium\">Medium</option>\n\t\t\t\t\t\t<option value=\"Low\">Low</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.priority}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-priority"
                    },
                    {
                        "name": "key",
                        "value": "priority"
                    }
                ],
                "children": [
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "" }
                        ],
                        "innerText": "Select Priority"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "High" }
                        ],
                        "innerText": "High"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Medium" }
                        ],
                        "innerText": "Medium"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "Low" }
                        ],
                        "innerText": "Low"
                    }
                ]
            },
            {
                "label": "Tags",
                "options": [
                    {
                        "value": "urgent",
                        "label": "Urgent"
                    },
                    {
                        "value": "follow-up",
                        "label": "Follow-Up"
                    },
                    {
                        "value": "important",
                        "label": "Important"
                    }
                ],
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"urgent\">Urgent</option>\n\t\t\t\t\t\t<option value=\"follow-up\">Follow-Up</option>\n\t\t\t\t\t\t<option value=\"important\">Important</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "<span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{tags}}\n</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "opportunity-tags"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "tags"
                    },
                    {
                        "name": "type",
                        "value": "multi-select"
                    }
                ],
                "children": [
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "urgent" }
                        ],
                        "innerText": "Urgent"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "follow-up" }
                        ],
                        "innerText": "Follow-Up"
                    },
                    {
                        "tagName": "a",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "important" }
                        ],
                        "innerText": "Important"
                    }
                ]
            },
            {
                "label": "Status",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"active\">Active</option>\n\t\t\t\t\t\t<option value=\"inactive\">Inactive</option>\n\t\t\t\t\t\t<option value=\"archived\">Archived</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
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
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "active" }
                        ],
                        "innerText": "Active"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "inactive" }
                        ],
                        "innerText": "Inactive"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            { "name": "href", "value": "#" },
                            { "name": "value", "value": "archived" }
                        ],
                        "innerText": "Archived"
                    }
                ]
            }
        ]
    },
    "upsert": true
};
