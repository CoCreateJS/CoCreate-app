export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "6a96308f23efb4e2a9ef34e6",
        "name": "Crypto",
        "singularName": "Crypto Asset",
        "path": "/apps/crypto",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "crypto",
        "statuses": [
            {
                "name": "active",
                "label": "Active"
            },
            {
                "name": "inactive",
                "label": "Inactive"
            }
        ],
        "type": "finance",
        "tags": [
            "bitcoin",
            "ethereum",
            "altcoin"
        ],
        "mainViews": [
            "table",
            "grid",
            "kanban"
        ],
        "secondaryViews": [
            "details",
            "form"
        ],
        "fields": [
            {
                "label": "Asset Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"crypto-asset-name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter asset name\" filter-query=\"$document .list-view\" filter-query-key=\"name\" />",
                "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.array=\"crypto\" state.object=\"{{object._id}}\" state.src=\"/apps/crypto/details.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t<div  state-to=\"offcanvas-app-form\" state.array=\"crypto\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object.name}}</span>\n\t\t\t\t\t</a>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "crypto-asset-name"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter asset name"
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
                "label": "Symbol",
                "tagName": "input",
                "filterTemplate": "<input id=\"crypto-symbol-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter symbol\" filter-query=\"$document .list-view\" filter-query-key=\"symbol\" />",
                "tableTemplate": "{{object.symbol}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "crypto-symbol"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter symbol"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "symbol"
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
                "filterTemplate": "<input id=\"crypto-amount-filter\" class=\"form-control\" type=\"number\" placeholder=\"Enter amount\" filter-query=\"$document .list-view\" filter-query-key=\"amount\" />",
                "tableTemplate": "{{object.amount}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "crypto-amount"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter amount"
                    },
                    {
                        "name": "required",
                        "value": true
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
                "label": "Wallet",
                "tagName": "input",
                "filterTemplate": "<input id=\"crypto-wallet-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter wallet address\" filter-query=\"$document .list-view\" filter-query-key=\"wallet\" />",
                "tableTemplate": "{{object.wallet}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "crypto-wallet"
                    },
                    {
                        "name": "placeholder",
                        "value": "Enter wallet address"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "wallet"
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
                "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option template value=\"{{object.key}}\">{{object.label}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t\t<div array=\"crypto\" object=\"statuses\" render-query=\"$previous\"></div>\n\t\t\t\t",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "crypto-status"
                    },
                    {
                        "name": "required",
                        "value": true
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
            },
            {
                "label": "Type",
                "tagName": "select",
                "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{type}}\n</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "crypto-type"
                    },
                    {
                        "name": "key",
                        "value": "type"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "finance"
                            }
                        ],
                        "innerText": "Finance"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "crypto"
                            }
                        ],
                        "innerText": "Crypto"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "assets"
                            }
                        ],
                        "innerText": "Assets"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"bitcoin\">Bitcoin</option>\n\t\t\t\t\t\t<option value=\"ethereum\">Ethereum</option>\n\t\t\t\t\t\t<option value=\"altcoin\">Altcoin</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "<span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{tags}}\n</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "crypto-tags"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "tags"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "bitcoin"
                            }
                        ],
                        "innerText": "Bitcoin"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "ethereum"
                            }
                        ],
                        "innerText": "Ethereum"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "altcoin"
                            }
                        ],
                        "innerText": "Altcoin"
                    }
                ]
            }
        ],
        "icon": "ri-money-dollar-circle-line",
        "description": "App to manage and track Crypto.",
        "status": "active"
    },
    "upsert": true
};
