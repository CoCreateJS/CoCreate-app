module.exports = {
  "method": "object.update",
  "array": "apps",
  "object": {
    "_id": "686ecb750cb20318c29a050f",
    "name": "Payments",
    "singularName": "Payment",
    "path": "apps/payments",
    "array": "transactions",
    "category": "Sales & Billing",
    "icon": "ri-wallet-line",
    "description": "App to manage and track Payments.",
    "status": "active",
    "fields": [
      {
        "label": "Payment ID",
        "tagName": "input",
        "filterTemplate": "<input id=\"payment-id-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter payment ID\" filter-query=\"$document .list-view\" filter-query-key=\"payment_id\" />",
        "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/payments/details.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"transactions\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object.payment_id}}</span>\n\t\t\t\t\t</a>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "payment-id"
          },
          {
            "name": "placeholder",
            "value": "Enter payment ID"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "payment_id"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Customer",
        "tagName": "input",
        "filterTemplate": "<input id=\"customer_name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter customer name\" filter-query=\"$document .list-view\" filter-query-key=\"customer_name.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.customer_name}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "customer_name-field"
          },
          {
            "name": "placeholder",
            "value": "Enter customer name"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "customer_name"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Invoice ID",
        "tagName": "input",
        "filterTemplate": "<input id=\"invoice_id-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter invoice ID\" filter-query=\"$document .list-view\" filter-query-key=\"invoice_id.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.array=\"invoices\" state.object=\"{{object.invoice_id}}\" state.src=\"/apps/invoices/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t{{object.invoice_id}}\n\t\t\t\t\t</a>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "invoice-id-field"
          },
          {
            "name": "placeholder",
            "value": "Enter invoice ID"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "invoice_id"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Product",
        "options": [
          {
            "label": "Puma Tshirt",
            "value": "Puma Tshirt"
          },
          {
            "label": "Adidas Sneakers",
            "value": "Adidas Sneakers"
          },
          {
            "label": "350 ml Glass Grocery Container",
            "value": "350 ml Glass Grocery Container"
          },
          {
            "label": "American egale outfitters Shirt",
            "value": "American egale outfitters Shirt"
          },
          {
            "label": "Galaxy Watch4",
            "value": "Galaxy Watch4"
          },
          {
            "label": "Apple iPhone 12",
            "value": "Apple iPhone 12"
          },
          {
            "label": "Funky Prints T-shirt",
            "value": "Funky Prints T-shirt"
          },
          {
            "label": "USB Flash Drive Personalized with 3D Print",
            "value": "USB Flash Drive Personalized with 3D Print"
          },
          {
            "label": "Oxford Button-Down Shirt",
            "value": "Oxford Button-Down Shirt"
          },
          {
            "label": "Classic Short Sleeve Shirt",
            "value": "Classic Short Sleeve Shirt"
          },
          {
            "label": "Half Sleeve T-Shirts (Blue)",
            "value": "Half Sleeve T-Shirts (Blue)"
          },
          {
            "label": "Noise Evolve Smartwatch",
            "value": "Noise Evolve Smartwatch"
          }
        ],
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"product-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"product\">\n\t\t\t\t\t\t<option value=\"\">Product</option>\n\t\t\t\t\t\t<option value=\"Puma Tshirt\">Puma Tshirt</option>\n\t\t\t\t\t\t<option value=\"Adidas Sneakers\">Adidas Sneakers</option>\n\t\t\t\t\t\t<option value=\"350 ml Glass Grocery Container\">350 ml Glass Grocery Container</option>\n\t\t\t\t\t\t<option value=\"American egale outfitters Shirt\">American egale outfitters Shirt</option>\n\t\t\t\t\t\t<option value=\"Galaxy Watch4\">Galaxy Watch4</option>\n\t\t\t\t\t\t<option value=\"Apple iPhone 12\">Apple iPhone 12</option>\n\t\t\t\t\t\t<option value=\"Funky Prints T-shirt\">Funky Prints T-shirt</option>\n\t\t\t\t\t\t<option value=\"USB Flash Drive Personalized with 3D Print\">USB Flash Drive Personalized with 3D Print</option>\n\t\t\t\t\t\t<option value=\"Oxford Button-Down Shirt\">Oxford Button-Down Shirt</option>\n\t\t\t\t\t\t<option value=\"Classic Short Sleeve Shirt\">Classic Short Sleeve Shirt</option>\n\t\t\t\t\t\t<option value=\"Half Sleeve T-Shirts (Blue)\">Half Sleeve T-Shirts (Blue)</option>\n\t\t\t\t\t\t<option value=\"Noise Evolve Smartwatch\">Noise Evolve Smartwatch</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.product\" render-as=\"product\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{product}}\n    </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "productname-field"
          },
          {
            "name": "name",
            "value": "productname-field"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "product"
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
            "innerText": "Product"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Puma Tshirt"
              }
            ],
            "innerText": "Puma Tshirt"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Adidas Sneakers"
              }
            ],
            "innerText": "Adidas Sneakers"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "350 ml Glass Grocery Container"
              }
            ],
            "innerText": "350 ml Glass Grocery Container"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "American egale outfitters Shirt"
              }
            ],
            "innerText": "American egale outfitters Shirt"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Galaxy Watch4"
              }
            ],
            "innerText": "Galaxy Watch4"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Apple iPhone 12"
              }
            ],
            "innerText": "Apple iPhone 12"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Funky Prints T-shirt"
              }
            ],
            "innerText": "Funky Prints T-shirt"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "USB Flash Drive Personalized with 3D Print"
              }
            ],
            "innerText": "USB Flash Drive Personalized with 3D Print"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Oxford Button-Down Shirt"
              }
            ],
            "innerText": "Oxford Button-Down Shirt"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Classic Short Sleeve Shirt"
              }
            ],
            "innerText": "Classic Short Sleeve Shirt"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Half Sleeve T-Shirts (Blue)"
              }
            ],
            "innerText": "Half Sleeve T-Shirts (Blue)"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Noise Evolve Smartwatch"
              }
            ],
            "innerText": "Noise Evolve Smartwatch"
          }
        ]
      },
      {
        "label": "Payment Date",
        "tagName": "input",
        "filterTemplate": "<input id=\"payment_date-filter\" class=\"form-control\" type=\"dt\" placeholder=\"Select payment date\" filter-query=\"$document .list-view\" filter-query-key=\"payment_date\" />",
        "tableTemplate": "{{object.payment_date}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
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
            "name": "data-date-format",
            "value": "d M, Y"
          },
          {
            "name": "data-enable-time",
            "value": true
          },
          {
            "name": "placeholder",
            "value": "Select date"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "payment_date"
          },
          {
            "name": "type",
            "value": "dae"
          }
        ]
      },
      {
        "label": "Amount",
        "tagName": "input",
        "filterTemplate": "<input id=\"amount-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter amount\" filter-query=\"$document .list-view\" filter-query-key=\"amount.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.amount}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "amount-field"
          },
          {
            "name": "placeholder",
            "value": "Total amount"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "step",
            "value": "0.01"
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
        "label": "Payment Method",
        "options": [
          {
            "label": "Mastercard",
            "value": "Mastercard"
          },
          {
            "label": "Visa",
            "value": "Visa"
          },
          {
            "label": "COD",
            "value": "COD"
          },
          {
            "label": "Paypal",
            "value": "Paypal"
          }
        ],
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"payment_method-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"payment_method\">\n\t\t\t\t\t\t<option value=\"\">Payment Method</option>\n\t\t\t\t\t\t<option value=\"Mastercard\">Mastercard</option>\n\t\t\t\t\t\t<option value=\"Visa\">Visa</option>\n\t\t\t\t\t\t<option value=\"COD\">COD</option>\n\t\t\t\t\t\t<option value=\"Paypal\">Paypal</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.payment_method\" render-as=\"payment_method\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{payment_method}}\n    </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "payment-field"
          },
          {
            "name": "name",
            "value": "payment-method"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "payment_method"
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
                "value": "COD"
              }
            ],
            "innerText": "COD"
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
        "label": "Payment Status",
        "options": [
          {
            "label": "Pending",
            "value": "Pending"
          },
          {
            "label": "Inprogress",
            "value": "Inprogress"
          },
          {
            "label": "Cancelled",
            "value": "Cancelled"
          },
          {
            "label": "Completed",
            "value": "Completed"
          }
        ],
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"payment_status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"payment_status\">\n\t\t\t\t\t\t<option value=\"\">Payment Status</option>\n\t\t\t\t\t\t<option value=\"Pending\">Pending</option>\n\t\t\t\t\t\t<option value=\"Inprogress\">Inprogress</option>\n\t\t\t\t\t\t<option value=\"Cancelled\">Cancelled</option>\n\t\t\t\t\t\t<option value=\"Completed\">Completed</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.payment_status\" render-as=\"payment_status\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{payment_status}}\n    </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "payment-status"
          },
          {
            "name": "name",
            "value": "payment-status"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "payment_status"
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
            "innerText": "Payment Status"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Pending"
              }
            ],
            "innerText": "Pending"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Inprogress"
              }
            ],
            "innerText": "Inprogress"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Cancelled"
              }
            ],
            "innerText": "Cancelled"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Completed"
              }
            ],
            "innerText": "Completed"
          }
        ]
      },
      {
        "label": "Status",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option value=\"active\">Active</option>\n\t\t\t\t\t\t<option value=\"inactive\">Inactive</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": " {{object.status}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "payments-status"
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
        "filterTemplate": "\n\t\t\t\t\t<select id=\"type-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"type\">\n\t\t\t\t\t\t<option value=\"\">Select Type</option>\n\t\t\t\t\t\t<option value=\"payments\">Payments</option>\n\t\t\t\t\t\t<option value=\"transactions\">Transactions</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{type}}\n    </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "payments-type"
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
                "value": "payments"
              }
            ],
            "innerText": "Payments"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "transactions"
              }
            ],
            "innerText": "Transactions"
          }
        ]
      },
      {
        "label": "Tags",
        "options": [
          {
            "label": "financial",
            "value": "financial"
          },
          {
            "label": "payment_processing",
            "value": "payment_processing"
          }
        ],
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"financial\">financial</option>\n\t\t\t\t\t\t<option value=\"payment_processing\">payment_processing</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "\n\t\t\t\t\t<span array=\"transactions\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n\t\t\t\t\t\t<span template class=\"badge bg-primary-subtle text-primary me-1\">\n\t\t\t\t\t\t\t{{tags}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "payments-tags"
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
                "value": "financial"
              }
            ],
            "innerText": "financial"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "payment_processing"
              }
            ],
            "innerText": "payment_processing"
          }
        ]
      }
    ]
  },
  "upsert": true
};