export default {
  "method": "object.update",
  "array": "apps",
  "object": {
    "_id": "68741e1d07a037d0d6d00efc",
    "name": "Purchase Orders",
    "singularName": "Purchase Order",
    "path": "apps/purchase-orders",
    "array": "purchase_orders",
    "icon": "ri-shopping-bag-line",
    "description": "App to manage and track Purchase Orders.",
    "status": "active",
    "category": "Procurement & Cost",
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
        "label": "PO Number",
        "tagName": "input",
        "tableTemplate": "<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/purchase-orders/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\"><div state-to=\"offcanvas-app-form\" state.array=\"purchase_orders\" state.object=\"{{object._id}}\"></div><span>{{object.po_number}}</span></a>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "PO-0001"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "po_number"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Supplier",
        "tagName": "input",
        "tableTemplate": "{{object.supplier}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Supplier name"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "supplier"
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
        "tableTemplate": "<pre key=\"items\">{{object.items}}</pre>",
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
        "label": "Expected Delivery",
        "tagName": "input",
        "tableTemplate": "{{object.expected_delivery}}",
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
            "name": "key",
            "value": "expected_delivery"
          },
          {
            "name": "type",
            "value": "dat"
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
        "label": "Total",
        "tagName": "input",
        "tableTemplate": "{{object.total}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
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
        "label": "Status",
        "tagName": "select",
        "filterTemplate": "<select class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\"><option value=\"\">Any</option><option template value=\"{{object.key}}\">{{object.label}}</option></select><div array=\"purchase_orders\" object=\"statuses\" render-query=\"$previous\"></div>",
        "tableTemplate": "{{object.status}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "purchase-orders-status"
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
                "value": "ordered"
              }
            ],
            "innerText": "Ordered"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "received"
              }
            ],
            "innerText": "Received"
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
          }
        ]
      }
    ]
  },
  "upsert": true
};
