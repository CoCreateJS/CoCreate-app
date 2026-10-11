export default {
    "method": "object.update",
    "array": "apps",
    "object": {
        "_id": "686ecb750cb20318c29a050e",
        "name": "Estimates",
        "singularName": "Estimate",
        "path": "/apps/estimates",
        "card": "/apps/estimates/components/card.html",
        "cardTemplate": "/apps/estimates/templates/card.html",
        "templates": {
            "card": "templates/card.html",
            "list": "templates/list.html"
        },
        "array": "invoices",
        "filter": {
            "type": "estimate"
        },
        "category": "Sales & Billing",
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
                "label": "Estimate No",
                "tagName": "input",
                "filterTemplate": "<input id=\"estimate_no-filter\" class=\"form-control\" type=\"text\" placeholder=\"Estimate No\" filter-query=\"$document .list-view\" filter-query-key=\"estimate_no\" />",
                "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/estimates/app.html\" aria-controls=\"offcanvas-app\" aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n            <div state-to=\"offcanvas-app-form\" state.array=\"invoices\" state.object=\"{{object._id}}\"></div>\n            <span>{{object.estimate_no}}</span>\n          </a>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control bg-light border-0"
                    },
                    {
                        "name": "id",
                        "value": "estimatenoInput"
                    },
                    {
                        "name": "placeholder",
                        "value": "Estimate No"
                    },
                    {
                        "name": "readonly",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "estimate_no"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Title",
                "tagName": "input",
                "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/estimates/app.html\" aria-controls=\"offcanvas-app\" aria-haspopup=\"dialog\" aria-expanded=\"false\">\n            <div state-to=\"offcanvas-app-form\" state.array=\"invoices\" state.object=\"{{object._id}}\"></div>\n            <span>{{object.title}}</span>\n          </a>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-control"
                    },
                    {
                        "name": "id",
                        "value": "estimateTitleInput"
                    },
                    {
                        "name": "placeholder",
                        "value": "Title"
                    },
                    {
                        "name": "key",
                        "value": "title"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Client",
                "tableTemplate": "<span array=\"contacts\" object=\"{{object.contact_id}}\" key=\"name\"></span>",
                "attributes": [
                    {
                        "name": "key",
                        "value": "client_name"
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
                "tableTemplate": "{{object.total_amount}}",
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
                        "value": "total_amount"
                    },
                    {
                        "name": "type",
                        "value": "currency"
                    }
                ]
            },
            {
                "label": "Amount To Pay",
                "tagName": "input",
                "tableTemplate": "{{object.amount_total_pay}}",
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
                        "value": "amount_total_pay"
                    },
                    {
                        "name": "type",
                        "value": "currency"
                    }
                ]
            },
            {
                "label": "Payment Status",
                "tagName": "select",
                "filterTemplate": "\n          <select id=\"payment_status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"payment_status\">\n            <option value=\"\">Select Payment Status</option>\n            <option value=\"Paid\">Paid</option>\n            <option value=\"Unpaid\">Unpaid</option>\n            <option value=\"Refund\">Refund</option>\n          </select>\n        ",
                "tableTemplate": "<span render=\"object.payment_status\" render-as=\"payment_status\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{payment_status}}\n    </span>",
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
                        "value": "payment_status"
                    }
                ]
            },
            {
                "label": "Payment Method",
                "tagName": "select",
                "filterTemplate": "\n          <select id=\"payment_method-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"payment_method\">\n            <option value=\"\">Payment Method</option>\n            <option value=\"Mastercard\">Mastercard</option>\n            <option value=\"Credit Card\">Credit Card</option>\n            <option value=\"Visa\">Visa</option>\n            <option value=\"Paypal\">Paypal</option>\n          </select>\n        ",
                "tableTemplate": "<span render=\"object.payment_method\" render-as=\"payment_method\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{payment_method}}\n    </span>",
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
                        "value": "payment_method"
                    }
                ]
            },
            {
                "label": "Card Holder Name",
                "tagName": "input",
                "tableTemplate": "{{object.cardholder_name}}",
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
                        "value": "cardholder_name"
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
                "tableTemplate": "{{object.card_number}}",
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
                        "value": "card_number"
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
                        "value": "descriptionInput"
                    },
                    {
                        "name": "rows",
                        "value": 3
                    },
                    {
                        "name": "placeholder",
                        "value": "Description"
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
                "label": "Status",
                "tagName": "select",
                "filterTemplate": "\n          <select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n            <option value=\"\">Select Status</option>\n            <option template value=\"{{object.key}}\">{{object.label}}</option>\n          </select>\n          <div array=\"invoices\" object=\"statuses\" render-query=\"$previous\"></div>\n        ",
                "tableTemplate": "{{object.status}}",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "estimates-status"
                    },
                    {
                        "name": "key",
                        "value": "status"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "filterTemplate": "\n          <select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n            <option value=\"overdue\">Overdue</option>\n            <option value=\"recurring\">Recurring</option>\n            <option value=\"partial\">Partial</option>\n          </select>\n        ",
                "tableTemplate": "\n          <span array=\"invoices\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n            <span template class=\"badge bg-primary-subtle text-primary me-1\">\n              {{tags}}\n            </span>\n          </span>\n        ",
                "attributes": [
                    {
                        "name": "class",
                        "value": "form-select"
                    },
                    {
                        "name": "id",
                        "value": "estimates-tags"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    },
                    {
                        "name": "key",
                        "value": "tags"
                    }
                ]
            },
            {
                "label": "Registration Number",
                "tagName": "input",
                "filterTemplate": "<input id=\"registration_number-filter\" class=\"form-control\" type=\"text\" placeholder=\"Registration No\" filter-query=\"$document .list-view\" filter-query-key=\"registration_number\" />",
                "tableTemplate": "{{object.registration_number}}",
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
                        "value": "registration_number"
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
                "filterTemplate": "<input id=\"company_email-filter\" class=\"form-control\" type=\"email\" placeholder=\"Email\" filter-query=\"$document .list-view\" filter-query-key=\"company_email\" />",
                "tableTemplate": "{{object.company_email}}",
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
                        "value": "company_email"
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
                "filterTemplate": "<input id=\"company_website-filter\" class=\"form-control\" type=\"text\" placeholder=\"Website\" filter-query=\"$document .list-view\" filter-query-key=\"company_website\" />",
                "tableTemplate": "{{object.company_website}}",
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
                        "value": "company_website"
                    },
                    {
                        "name": "type",
                        "value": "url"
                    }
                ]
            },
            {
                "label": "Company Contact No",
                "tagName": "input",
                "filterTemplate": "<input id=\"company_contact_no-filter\" class=\"form-control\" type=\"text\" placeholder=\"Contact No\" filter-query=\"$document .list-view\" filter-query-key=\"company_contact_no\" />",
                "tableTemplate": "{{object.company_contact_no}}",
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
                        "value": "company_contact_no"
                    },
                    {
                        "name": "type",
                        "value": "tel"
                    }
                ]
            },
            {
                "label": "Billing Name",
                "tagName": "input",
                "filterTemplate": "<input id=\"billing_name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Billing Name\" filter-query=\"$document .list-view\" filter-query-key=\"billing_name\" />",
                "tableTemplate": "{{object.billing_name}}",
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
                        "value": "billing_name"
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
                "filterTemplate": "<input id=\"billing_address-filter\" class=\"form-control\" type=\"text\" placeholder=\"Billing Address\" filter-query=\"$document .list-view\" filter-query-key=\"billing_address\" />",
                "tableTemplate": "{{object.billing_address}}",
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
                        "value": "billing_address"
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
                "filterTemplate": "<input id=\"billing_phone_no-filter\" class=\"form-control\" type=\"text\" placeholder=\"Billing Phone No\" filter-query=\"$document .list-view\" filter-query-key=\"billing_phone_no\" />",
                "tableTemplate": "{{object.billing_phone_no}}",
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
                        "value": "billing_phone_no"
                    },
                    {
                        "name": "type",
                        "value": "tel"
                    }
                ]
            },
            {
                "label": "Billing Tax No",
                "tagName": "input",
                "filterTemplate": "<input id=\"billing_tax_no-filter\" class=\"form-control\" type=\"text\" placeholder=\"Billing Tax No\" filter-query=\"$document .list-view\" filter-query-key=\"billing_tax_no\" />",
                "tableTemplate": "{{object.billing_tax_no}}",
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
                        "value": "billing_tax_no"
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
                "filterTemplate": "<input id=\"shipping_name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Shipping Name\" filter-query=\"$document .list-view\" filter-query-key=\"shipping_name\" />",
                "tableTemplate": "{{object.shipping_name}}",
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
                        "value": "shipping_name"
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
                "filterTemplate": "<input id=\"shipping_address-filter\" class=\"form-control\" type=\"text\" placeholder=\"Shipping Address\" filter-query=\"$document .list-view\" filter-query-key=\"shipping_address\" />",
                "tableTemplate": "{{object.shipping_address}}",
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
                        "value": "shipping_address"
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
                "filterTemplate": "<input id=\"shipping_phone_no-filter\" class=\"form-control\" type=\"text\" placeholder=\"Shipping Phone No\" filter-query=\"$document .list-view\" filter-query-key=\"shipping_phone_no\" />",
                "tableTemplate": "{{object.shipping_phone_no}}",
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
                        "value": "shipping_phone_no"
                    },
                    {
                        "name": "type",
                        "value": "tel"
                    }
                ]
            },
            {
                "label": "Shipping Tax No",
                "tagName": "input",
                "filterTemplate": "<input id=\"shipping_tax_no-filter\" class=\"form-control\" type=\"text\" placeholder=\"Shipping Tax No\" filter-query=\"$document .list-view\" filter-query-key=\"shipping_tax_no\" />",
                "tableTemplate": "{{object.shipping_tax_no}}",
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
                        "value": "shipping_tax_no"
                    },
                    {
                        "name": "type",
                        "value": "text"
                    }
                ]
            },
            {
                "label": "Statuses",
                "tagName": "select",
                "attributes": [
                    {
                        "name": "key",
                        "value": "statuses"
                    },
                    {
                        "name": "multiple",
                        "value": true
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
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "draft"
                            }
                        ],
                        "innerText": "Draft"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "sent"
                            }
                        ],
                        "innerText": "Sent"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "accepted"
                            }
                        ],
                        "innerText": "Accepted"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "declined"
                            }
                        ],
                        "innerText": "Declined"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "paid"
                            }
                        ],
                        "innerText": "Paid"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "partially_paid"
                            }
                        ],
                        "innerText": "Partially Paid"
                    },
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
                                "value": "void"
                            }
                        ],
                        "innerText": "Void"
                    }
                ]
            },
            {
                "label": "Type",
                "tagName": "select",
                "attributes": [
                    {
                        "name": "key",
                        "value": "type"
                    },
                    {
                        "name": "multiple",
                        "value": true
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
                        "innerText": "finance"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "sales"
                            }
                        ],
                        "innerText": "sales"
                    }
                ]
            },
            {
                "label": "Tags",
                "tagName": "select",
                "attributes": [
                    {
                        "name": "key",
                        "value": "tags"
                    },
                    {
                        "name": "multiple",
                        "value": true
                    }
                ],
                "children": [
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "invoice"
                            }
                        ],
                        "innerText": "invoice"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "quote"
                            }
                        ],
                        "innerText": "quote"
                    },
                    {
                        "tagName": "option",
                        "attributes": [
                            {
                                "name": "value",
                                "value": "billing"
                            }
                        ],
                        "innerText": "billing"
                    }
                ]
            },
            {
                "label": "Stage",
                "tagName": "select",
                "attributes": [
                    {
                        "name": "key",
                        "value": "stage"
                    }
                ],
                "children": [],
                "options": []
            }
        ],
        "icon": "/assets/svg/remix/file-text-line.svg",
        "description": "App to manage and track Estimates.",
        "status": "active"
    },
    "upsert": true
};
