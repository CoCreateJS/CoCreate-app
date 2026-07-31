module.exports = {
  "method": "object.update",
  "array": "apps",
  "object": {
    "_id": "686ecb750cb20318c29a050d",
    "name": "Expenses",
    "singularName": "Expense",
    "path": "apps/expenses",
    "array": "transactions",
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
    "icon": "ri-money-dollar-circle-line",
    "description": "App to manage and track Expenses.",
    "status": "active",
    "fields": [
      {
        "label": "Name",
        "tagName": "input",
        "filterTemplate": "<input id=\"name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter expense name\" filter-query=\"$document .list-view\" filter-query-key=\"name.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/expenses/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\" aria-open>\n              <div state-to=\"offcanvas-app-form\" state.array=\"transactions\" state.object=\"{{object._id}}\"></div>\n              <span>{{object.name}}</span>\n          </a>\n        ",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "name-field"
          },
          {
            "name": "placeholder",
            "value": "Enter expense name"
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
        "label": "Date",
        "tagName": "input",
        "filterTemplate": "<input id=\"date-filter\" class=\"form-control\" type=\"dat\" placeholder=\"Select date\" filter-query=\"$document .list-view\" filter-query-key=\"date\" />",
        "tableTemplate": "{{object.date}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "expense-date-field"
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
            "value": "dat"
          },
          {
            "name": "type",
            "value": "dat"
          }
        ]
      },
      {
        "label": "Category",
        "tagName": "select",
        "filterTemplate": "\n          <select id=\"category-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"category\">\n            <option value=\"\">Select category</option>\n            <option value=\"Office Supplies\">Office Supplies</option>\n            <option value=\"Travel\">Travel</option>\n            <option value=\"Meals\">Meals</option>\n            <option value=\"Utilities\">Utilities</option>\n            <option value=\"Software\">Software</option>\n            <option value=\"Marketing\">Marketing</option>\n            <option value=\"Other\">Other</option>\n          </select>\n        ",
        "tableTemplate": "<span render=\"object.category\" render-as=\"category\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{category}}\n    </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "category-field"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "category"
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
            "innerText": "Select category"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Office Supplies"
              }
            ],
            "innerText": "Office Supplies"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Travel"
              }
            ],
            "innerText": "Travel"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Meals"
              }
            ],
            "innerText": "Meals"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Utilities"
              }
            ],
            "innerText": "Utilities"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Software"
              }
            ],
            "innerText": "Software"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Marketing"
              }
            ],
            "innerText": "Marketing"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Other"
              }
            ],
            "innerText": "Other"
          }
        ]
      },
      {
        "label": "Vendor",
        "tagName": "input",
        "filterTemplate": "<input id=\"vendor-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter vendor/supplier\" filter-query=\"$document .list-view\" filter-query-key=\"vendor\" />",
        "tableTemplate": "{{object.vendor}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "vendor-field"
          },
          {
            "name": "placeholder",
            "value": "Enter vendor/supplier"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "vendor"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Reference #",
        "tagName": "input",
        "filterTemplate": "<input id=\"reference-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter reference or invoice number\" filter-query=\"$document .list-view\" filter-query-key=\"reference\" />",
        "tableTemplate": "{{object.reference}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "reference-field"
          },
          {
            "name": "placeholder",
            "value": "Enter reference or invoice number"
          },
          {
            "name": "key",
            "value": "reference"
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
        "filterTemplate": "<input id=\"description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter description\" filter-query=\"$document .list-view\" filter-query-key=\"description\" />",
        "tableTemplate": "{{object.description}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "description-field"
          },
          {
            "name": "rows",
            "value": 2
          },
          {
            "name": "placeholder",
            "value": "Enter description"
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
        "label": "Amount",
        "tagName": "input",
        "filterTemplate": "<input id=\"amount-filter\" class=\"form-control\" type=\"number\" placeholder=\"Total amount\" filter-query=\"$document .list-view\" filter-query-key=\"amount\" />",
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
            "name": "min",
            "value": 0
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
        "label": "Tax",
        "tagName": "input",
        "filterTemplate": "<input id=\"tax-filter\" class=\"form-control\" type=\"number\" placeholder=\"Tax amount\" filter-query=\"$document .list-view\" filter-query-key=\"tax\" />",
        "tableTemplate": "{{object.tax}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "tax-field"
          },
          {
            "name": "placeholder",
            "value": "Tax amount"
          },
          {
            "name": "min",
            "value": 0
          },
          {
            "name": "step",
            "value": "0.01"
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
        "label": "Currency",
        "tagName": "select",
        "filterTemplate": "\n          <select id=\"currency-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"currency\">\n            <option value=\"\">Select currency</option>\n            <option value=\"USD\">USD</option>\n            <option value=\"EUR\">EUR</option>\n            <option value=\"GBP\">GBP</option>\n            <option value=\"CAD\">CAD</option>\n            <option value=\"AUD\">AUD</option>\n            <option value=\"Other\">Other</option>\n          </select>\n        ",
        "tableTemplate": "<span render=\"object.currency\" render-as=\"currency\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{currency}}\n    </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "currency-field"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "currency"
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
            "innerText": "Select currency"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "USD"
              }
            ],
            "innerText": "USD"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "EUR"
              }
            ],
            "innerText": "EUR"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "GBP"
              }
            ],
            "innerText": "GBP"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "CAD"
              }
            ],
            "innerText": "CAD"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "AUD"
              }
            ],
            "innerText": "AUD"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Other"
              }
            ],
            "innerText": "Other"
          }
        ]
      },
      {
        "label": "Status",
        "tagName": "select",
        "filterTemplate": "\n          <select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n            <option value=\"\">Select Status</option>\n            <option template data-render-key=\"key\" data-render-value=\"label\" data-render-array=\"statuses\" value=\"{{object.key}}\">{{object.label}}</option>\n          </select>\n          <div class=\"d-none\" array=\"transactions\" object=\"statuses\" render-query=\"$previous\"></div>\n        ",
        "tableTemplate": "{{object.status}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "expenses-status"
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
                "value": ""
              },
              {
                "name": "data-render-key",
                "value": "key"
              },
              {
                "name": "data-render-value",
                "value": "label"
              },
              {
                "name": "data-render-array",
                "value": "statuses"
              },
              {
                "name": "value",
                "value": "{{object.key}}"
              }
            ],
            "innerText": "{{object.label}}"
          }
        ]
      },
      {
        "label": "Paid By",
        "tagName": "input",
        "filterTemplate": "<input id=\"paid_by-filter\" class=\"form-control\" type=\"text\" placeholder=\"Who paid for this expense?\" filter-query=\"$document .list-view\" filter-query-key=\"paid_by\" />",
        "tableTemplate": "{{object.paid_by}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "paidby-field"
          },
          {
            "name": "placeholder",
            "value": "Who paid for this expense?"
          },
          {
            "name": "key",
            "value": "paid_by"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Project/Department",
        "tagName": "input",
        "filterTemplate": "<input id=\"project-filter\" class=\"form-control\" type=\"text\" placeholder=\"Project or department (optional)\" filter-query=\"$document .list-view\" filter-query-key=\"project\" />",
        "tableTemplate": "{{object.project}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "project-field"
          },
          {
            "name": "placeholder",
            "value": "Project or department (optional)"
          },
          {
            "name": "key",
            "value": "project"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Due Date",
        "tagName": "input",
        "filterTemplate": "<input id=\"due_date-filter\" class=\"form-control\" type=\"dae\" placeholder=\"Due date (optional)\" filter-query=\"$document .list-view\" filter-query-key=\"due_date\" />",
        "tableTemplate": "{{object.due_date}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "duedate-field"
          },
          {
            "name": "placeholder",
            "value": "Due date (optional)"
          },
          {
            "name": "key",
            "value": "due_date"
          },
          {
            "name": "type",
            "value": "dat"
          }
        ]
      },
      {
        "label": "Approval By",
        "tagName": "input",
        "filterTemplate": "<input id=\"approval_by-filter\" class=\"form-control\" type=\"text\" placeholder=\"Person who approved (optional)\" filter-query=\"$document .list-view\" filter-query-key=\"approved_by\" />",
        "tableTemplate": "{{object.approved_by}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "approvalby-field"
          },
          {
            "name": "placeholder",
            "value": "Person who approved (optional)"
          },
          {
            "name": "key",
            "value": "approved_by"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Notes",
        "tagName": "textarea",
        "filterTemplate": "<input id=\"notes-filter\" class=\"form-control\" type=\"text\" placeholder=\"Additional notes\" filter-query=\"$document .list-view\" filter-query-key=\"notes\" />",
        "tableTemplate": "{{object.notes}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "notes-field"
          },
          {
            "name": "rows",
            "value": 2
          },
          {
            "name": "placeholder",
            "value": "Additional notes"
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
        "label": "ID",
        "tagName": "input",
        "tableTemplate": "{{object._id}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "id-field"
          },
          {
            "name": "readonly",
            "value": true
          },
          {
            "name": "key",
            "value": "id"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "statuses",
        "tagName": "select",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "key",
            "value": "statuses"
          }
        ],
        "option": [
          {
            "name": "pending",
            "label": "Pending"
          },
          {
            "name": "approved",
            "label": "Approved"
          },
          {
            "name": "rejected",
            "label": "Rejected"
          },
          {
            "name": "paid",
            "label": "Paid"
          },
          {
            "name": "reimbursed",
            "label": "Reimbursed"
          }
        ],
        "children": [
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
                "value": "approved"
              }
            ],
            "innerText": "Approved"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "rejected"
              }
            ],
            "innerText": "Rejected"
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
                "value": "reimbursed"
              }
            ],
            "innerText": "Reimbursed"
          }
        ]
      },
      {
        "label": "type",
        "tagName": "select",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "key",
            "value": "type"
          }
        ],
        "option": [
          {
            "name": "finance",
            "label": "finance"
          },
          {
            "name": "expense-tracking",
            "label": "expense-tracking"
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
                "value": "expense-tracking"
              }
            ],
            "innerText": "expense-tracking"
          }
        ]
      },
      {
        "label": "tags",
        "tagName": "select",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "key",
            "value": "tags"
          }
        ],
        "option": [
          {
            "name": "finance",
            "label": "finance"
          },
          {
            "name": "expenses",
            "label": "expenses"
          },
          {
            "name": "accounting",
            "label": "accounting"
          },
          {
            "name": "business",
            "label": "business"
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
                "value": "expenses"
              }
            ],
            "innerText": "expenses"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "accounting"
              }
            ],
            "innerText": "accounting"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "business"
              }
            ],
            "innerText": "business"
          }
        ]
      },
      {
        "label": "stage",
        "tagName": "select",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "key",
            "value": "stage"
          }
        ],
        "option": [
          {
            "name": "development",
            "label": "Development"
          },
          {
            "name": "testing",
            "label": "Testing"
          },
          {
            "name": "production",
            "label": "Production"
          }
        ],
        "children": [
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "development"
              }
            ],
            "innerText": "Development"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "testing"
              }
            ],
            "innerText": "Testing"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "production"
              }
            ],
            "innerText": "Production"
          }
        ]
      }
    ]
  },
  "upsert": true
};