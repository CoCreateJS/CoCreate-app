module.exports = {
  "method": "object.update",
  "array": "apps",
  "object": {
    "_id": "68741e1d07a037d0d6d00efb",
    "name": "Orders",
    "singularName": "Order",
    "path": "apps/orders",
    "array": "orders",
    "icon": "ri-shopping-cart-line",
    "description": "App to manage and track Orders.",
    "status": "active",
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
        "label": "Order Number",
        "tagName": "input",
        "filterTemplate": "<input class=\"form-control\" type=\"text\" placeholder=\"Order number\" filter-query=\"$document .list-view\" filter-query-key=\"order_number\" />",
        "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/tasks/details.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"tasks\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object.name}}</span>\n\t\t\t\t\t</a>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "SO-0001"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "order_number"
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
        "filterTemplate": "<input class=\"form-control\" type=\"text\" placeholder=\"Customer\" filter-query=\"$document .list-view\" filter-query-key=\"customer.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.customer}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Customer name"
          },
          {
            "name": "required",
            "value": true
          },
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
        "label": "Items",
        "tagName": "textarea",
        "filterTemplate": "<input class=\"form-control\" type=\"text\" placeholder=\"Item\" filter-query=\"$document .list-view\" filter-query-key=\"items\" />",
        "tableTemplate": "<span array=\"sales_orders\" object=\"{{object._id}}\" key=\"items\" render-query=\"[template]\"><span template>{{items}}</span></span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "JSON array of items [{product, qty, price}]"
          },
          {
            "name": "key",
            "value": "items"
          },
          {
            "name": "type",
            "value": "array"
          }
        ]
      },
      {
        "label": "Order Date",
        "tagName": "input",
        "filterTemplate": "<input class=\"form-control\" type=\"dat\" filter-query=\"$document .list-view\" filter-query-key=\"order_date\" />",
        "tableTemplate": "{{object.order_date}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
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
            "name": "placeholder",
            "value": "Select date"
          },
          {
            "name": "key",
            "value": "order_date"
          },
          {
            "name": "type",
            "value": "dat"
          }
        ]
      },
      {
        "label": "Shipping Address",
        "tagName": "textarea",
        "tableTemplate": "{{object.shipping_address}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "rows",
            "value": 2
          },
          {
            "name": "placeholder",
            "value": "Shipping address"
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
        "label": "Billing Address",
        "tagName": "textarea",
        "tableTemplate": "{{object.billing_address}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "rows",
            "value": 2
          },
          {
            "name": "placeholder",
            "value": "Billing address"
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
        "label": "Subtotal",
        "tagName": "input",
        "tableTemplate": "{{object.subtotal}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Subtotal"
          },
          {
            "name": "key",
            "value": "subtotal"
          },
          {
            "name": "type",
            "value": "number"
          }
        ]
      },
      {
        "label": "Tax",
        "tagName": "input",
        "tableTemplate": "{{object.tax}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Tax amount"
          },
          {
            "name": "key",
            "value": "tax"
          },
          {
            "name": "type",
            "value": "number"
          }
        ]
      },
      {
        "label": "Shipping Cost",
        "tagName": "input",
        "tableTemplate": "{{object.shipping_cost}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Shipping cost"
          },
          {
            "name": "key",
            "value": "shipping_cost"
          },
          {
            "name": "type",
            "value": "number"
          }
        ]
      },
      {
        "label": "Total",
        "tagName": "input",
        "tableTemplate": "{{object.total}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Total"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "total"
          },
          {
            "name": "type",
            "value": "number"
          }
        ]
      },
      {
        "label": "Payment Method",
        "tagName": "select",
        "filterTemplate": "<select class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"payment_method\"><option value=\"\">Any</option><option value=\"Credit Card\">Credit Card</option><option value=\"Paypal\">Paypal</option><option value=\"COD\">COD</option></select>",
        "tableTemplate": "<span render=\"object.payment_method\" render-as=\"payment_method\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{payment_method}}\n    </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
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
            "innerText": "Any"
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
                "value": "Paypal"
              }
            ],
            "innerText": "Paypal"
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
          }
        ]
      },
      {
        "label": "Status",
        "tagName": "select",
        "filterTemplate": "<select class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\"><option value=\"\">Any</option><option template value=\"{{object.key}}\">{{object.label}}</option></select><div array=\"sales_orders\" object=\"statuses\" render-query=\"$previous\"></div>",
        "tableTemplate": "{{object.status}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "sales-orders-status"
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
            "innerText": "Any"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "pending"
              }
            ],
            "innerText": "Pending"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "processing"
              }
            ],
            "innerText": "Processing"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "shipped"
              }
            ],
            "innerText": "Shipped"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "delivered"
              }
            ],
            "innerText": "Delivered"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "cancelled"
              }
            ],
            "innerText": "Cancelled"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "returned"
              }
            ],
            "innerText": "Returned"
          }
        ]
      },
      {
        "label": "Tags",
        "tagName": "select",
        "filterTemplate": "<select class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags.$in\"><option value=\"express\">Express</option><option value=\"gift\">Gift</option><option value=\"bulk\">Bulk</option></select>",
        "tableTemplate": "<span render=\"object.tags\" render-as=\"tags\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{tags}}\n    </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
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
                "value": "express"
              }
            ],
            "innerText": "Express"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "gift"
              }
            ],
            "innerText": "Gift"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "bulk"
              }
            ],
            "innerText": "Bulk"
          }
        ]
      }
    ]
  },
  "upsert": true
};