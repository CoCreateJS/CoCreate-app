export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "6a96308f1cbed14a0983e2e1",
        "name": "Invoices",
        "singularName": "Invoice",
        "path": "/apps/invoices",
        "card": "/apps/invoices/components/card.html",
        "cardTemplate": "/apps/invoices/templates/card.html",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "invoices",
        "filter": {
            "type": "invoice"
        },
        "category": "Sales & Billing",
        "icon": "ri-file-list-3-line",
        "description": "App to manage and track Invoices.",
        "status": "active",
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
                "label": "Invoice No",
                "tagName": "input",
                "filterTemplate": "<input id=\"invoice_no-filter\" class=\"form-control\" type=\"text\" placeholder=\"Invoice No\" filter-query=\"$document .list-view\" filter-query-key=\"invoice.number\" />",
                "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/invoices/aside.html\" aria-controls=\"offcanvas-app\" aria-haspopup=\"dialog\" aria-expanded=\"false\"  aria-open>\n            <div state-to=\"offcanvas-app-form\" state.array=\"invoices\" state.object=\"{{object._id}}\"></div>\n            <span>{{object.invoice.number}}</span>\n          </a>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "invoicenoInput"
                    },
                    {
                        "name": "placeholder",
                        "value": "Invoice No"
                    },
                    {
                        "name": "readonly",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "invoice.number"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Customer",
                "tableTemplate": "<span array=\"contacts\" object=\"{{object.contact_id}}\" key=\"name\"></span>",
                "attributes": [
                    {
                        "name": "key",
                        "value": "customer"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Date",
                "tagName": "input",
                "filterTemplate": "<input id=\"date-filter\" class=\"form-control\" type=\"dat\" filter-query=\"$document .list-view\" filter-query-key=\"date\" />",
                "tableTemplate": "{{object.date}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "date-field"
                    },
                    {
                        "name": "date-picker",
                        "value": "flatpickr"
                    },
                    {
                        "name": "data-time",
                        "value": true
                    },
                    {
                        "name": "placeholder",
                        "value": "Select Date-time"
                    },
                    {
                        "name": "key",
                        "value": "dat"
                    },
                    {
                        "name": "type",
                        "value": "dat"
                    }
                ]
            },
            {
                "label": "Total Amount",
                "tagName": "input",
                "tableTemplate": "{{object.cart.total}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "totalamountInput"
                    },
                    {
                        "name": "placeholder",
                        "value": "$0.00"
                    },
                    {
                        "name": "readonly",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "cart.total"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Payment Status",
                "tagName": "select",
                "tableTemplate": "<span class=\"badge bg-primary-subtle text-primary me-1\">{{object.payment.status}}</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "choices-payment-status"
                    },
                    {
                        "name": "plugin",
                        "value": "choices"
                    },
                    {
                        "name": "data-choices-search-false",
                        "value": true
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "payment.status"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": ""
                            }
                        ],
                        "innerText": "Select Payment Status"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Paid"
                            }
                        ],
                        "innerText": "Paid"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Unpaid"
                            }
                        ],
                        "innerText": "Unpaid"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Refund"
                            }
                        ],
                        "innerText": "Refund"
                    }
                ]
            },
            {
                "label": "Notes",
                "tagName": "textarea",
                "tableTemplate": "{{object.notes}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control alert alert-info"
                    },
                    {
                        "name": "id",
                        "value": "exampleFormControlTextarea1"
                    },
                    {
                        "name": "rows",
                        "value": 2
                    },
                    {
                        "name": "placeholder",
                        "value": "Notes"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "notes"
                    },
                    {
                        "name": "type",
                        "value": "textarea"
                    }
                ]
            },
            {
                "label": "Registration Number",
                "tagName": "input",
                "tableTemplate": "{{object.company.registrationNumber}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "registrationNumber"
                    },
                    {
                        "name": "maxlength",
                        "value": 12
                    },
                    {
                        "name": "placeholder",
                        "value": "Legal Registration No"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "company.registrationNumber"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Company Email",
                "tagName": "input",
                "tableTemplate": "{{object.company.email}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "companyEmail"
                    },
                    {
                        "name": "placeholder",
                        "value": "Email Address"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "company.email"
                    },
                    {
                        "name": "type",
                        "value": "email"
                    }
                ]
            },
            {
                "label": "Company Website",
                "tagName": "input",
                "tableTemplate": "{{object.company.website}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "companyWebsite"
                    },
                    {
                        "name": "placeholder",
                        "value": "Website"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "company.website"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Company Contact No",
                "tagName": "input",
                "tableTemplate": "{{object.company.contactNo}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "compnayContactno"
                    },
                    {
                        "name": "data-plugin",
                        "value": "cleave-phone"
                    },
                    {
                        "name": "placeholder",
                        "value": "Contact No"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "company.contactNo"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Billing Name",
                "tagName": "input",
                "tableTemplate": "{{object.billing.fullName}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "billingName"
                    },
                    {
                        "name": "placeholder",
                        "value": "Full Name"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "billing.fullName"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Billing Address",
                "tagName": "textarea",
                "tableTemplate": "{{object.billing.address}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "billingAddress"
                    },
                    {
                        "name": "rows",
                        "value": 3
                    },
                    {
                        "name": "placeholder",
                        "value": "Address"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "billing.address"
                    },
                    {
                        "name": "type",
                        "value": "textarea"
                    }
                ]
            },
            {
                "label": "Billing Phone No",
                "tagName": "input",
                "tableTemplate": "{{object.billing.phoneNumber}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "billingPhoneno"
                    },
                    {
                        "name": "data-plugin",
                        "value": "cleave-phone"
                    },
                    {
                        "name": "placeholder",
                        "value": "(123)456-7890"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "billing.phoneNumber"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Billing Tax No",
                "tagName": "input",
                "tableTemplate": "{{object.billing.taxNumber}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "billingTaxno"
                    },
                    {
                        "name": "placeholder",
                        "value": "Tax Number"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "billing.taxNumber"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Shipping Name",
                "tagName": "input",
                "tableTemplate": "{{object.shipping.fullName}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "shippingName"
                    },
                    {
                        "name": "placeholder",
                        "value": "Full Name"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "shipping.fullName"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Shipping Address",
                "tagName": "textarea",
                "tableTemplate": "{{object.shipping.address}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "shippingAddress"
                    },
                    {
                        "name": "rows",
                        "value": 3
                    },
                    {
                        "name": "placeholder",
                        "value": "Address"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "shipping.address"
                    },
                    {
                        "name": "type",
                        "value": "textarea"
                    }
                ]
            },
            {
                "label": "Shipping Phone No",
                "tagName": "input",
                "tableTemplate": "{{object.shipping.phoneNumber}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "shippingPhoneno"
                    },
                    {
                        "name": "data-plugin",
                        "value": "cleave-phone"
                    },
                    {
                        "name": "placeholder",
                        "value": "(123)456-7890"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "shipping.phoneNumber"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Shipping Tax No",
                "tagName": "input",
                "tableTemplate": "{{object.shipping.taxNumber}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "shippingTaxno"
                    },
                    {
                        "name": "placeholder",
                        "value": "Tax Number"
                    },
                    {
                        "name": "required",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "shipping.taxNumber"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Payment Method",
                "tagName": "select",
                "tableTemplate": "<span render=\"object.payment.method\" render-as=\"payment_method\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{payment_method}}\n</span>",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "choices-payment-type"
                    },
                    {
                        "name": "plugin",
                        "value": "choices"
                    },
                    {
                        "name": "data-choices-search-false",
                        "value": true
                    },
                    {
                        "name": "data-choices-removeItem",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "payment.method"
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": ""
                            }
                        ],
                        "innerText": "Payment Method"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Mastercard"
                            }
                        ],
                        "innerText": "Mastercard"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Credit Card"
                            }
                        ],
                        "innerText": "Credit Card"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Visa"
                            }
                        ],
                        "innerText": "Visa"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Paypal"
                            }
                        ],
                        "innerText": "Paypal"
                    }
                ]
            },
            {
                "label": "Card Holder Name",
                "tagName": "input",
                "tableTemplate": "{{object.payment.cardholderName}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "cardholderName"
                    },
                    {
                        "name": "placeholder",
                        "value": "Card Holder Name"
                    },
                    {
                        "name": "key",
                        "value": "payment.cardholderName"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Card Number",
                "tagName": "input",
                "tableTemplate": "{{object.payment.cardNumber}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "cardNumber"
                    },
                    {
                        "name": "placeholder",
                        "value": "xxxx xxxx xxxx xxxx"
                    },
                    {
                        "name": "key",
                        "value": "payment.cardNumber"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Amount To Pay",
                "tagName": "input",
                "tableTemplate": "{{object.payment.amount}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "amountTotalPay"
                    },
                    {
                        "name": "placeholder",
                        "value": "$0.00"
                    },
                    {
                        "name": "readonly",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "payment.amount"
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
                "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option template value=\"{{object.key}}\">{{object.label}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t\t<div array=\"invoices\" object=\"statuses\" render-query=\"$previous\"></div>\n\t\t\t\t",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "invoices-status"
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
                                "value": ""
                            }
                        ],
                        "innerText": "Select Status"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "template",
                                "value": "{{object.key}}"
                            }
                        ],
                        "innerText": "{{object.label}}"
                    }
                ]
            },
            {
                "tagName": "select",
                "label": "Type",
                "type": "select",
                "filterTemplate": "<select id=\"type-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"type\">\n\t\t\t\t\t<option value=\"\">Select Type</option>\n\t\t\t\t\t<option value=\"Invoice\">Invoice</option>\n\t\t\t\t\t<option value=\"Estimate\">Estimate</option>\n\t\t\t\t\t<option value=\"Sales Order\">Sales Order</option>\n\t\t\t\t</select>",
                "tableTemplate": "{{object.type}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "invoices-type"
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
                                "value": ""
                            }
                        ],
                        "innerText": "Select Type"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Invoice"
                            }
                        ],
                        "innerText": "Invoice"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Estimate"
                            }
                        ],
                        "innerText": "Estimate"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "Sales Order"
                            }
                        ],
                        "innerText": "Sales Order"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"overdue\">Overdue</option>\n\t\t\t\t\t\t<option value=\"recurring\">Recurring</option>\n\t\t\t\t\t\t<option value=\"partial\">Partial</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
                "tableTemplate": "\n\t\t\t\t\t<span array=\"invoices\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n\t\t\t\t\t\t<span template class=\"badge bg-primary-subtle text-primary me-1\">\n\t\t\t\t\t\t\t{{tags}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "invoices-tags"
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
                                "value": "overdue"
                            }
                        ],
                        "innerText": "Overdue"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "recurring"
                            }
                        ],
                        "innerText": "Recurring"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "partial"
                            }
                        ],
                        "innerText": "Partial"
                    }
                ]
            }
        ],
    },
    "upsert": true
};
