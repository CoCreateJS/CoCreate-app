export default {
  "method": "object.update",
  "array": "apps",
  "object": {
    "_id": "68741e1d07a037d0d6d00ee9",
    "name": "Items",
    "singularName": "Item",
    "path": "apps/items",
    "card": "/apps/items/card.html",
    "cardTemplate": "/apps/items/card-template.html",
    "array": "items",
    "category": "Sales & Billing",
    "icon": "ri-box-3-line",
    "description": "App to manage and track Items.",
    "status": "active",
    "fields": [
      {
        "label": "Name",
        "tagName": "input",
        "filterTemplate": "<input id=\"title-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter name\" filter-query=\"$document .list-view\" filter-query-key=\"name\" />",
        "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/items/details.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n              <div state-to=\"offcanvas-app-form\" state.array=\"items\" state.object=\"{{object._id}}\"></div>\n              <span>{{object.name}}</span>\n\t\t\t\t\t</a>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "items-name-input"
          },
          {
            "name": "placeholder",
            "value": "Enter item name"
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
        "tagName": "div",
        "filterTemplate": "<input id=\"description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Search description\" filter-query=\"$document .list-view\" filter-query-key=\"description\" />",
        "tableTemplate": "{{object.description}}",
        "attributes": [
          {
            "name": "editor",
            "value": "ckeditor-classic"
          },
          {
            "name": "key",
            "value": "description"
          },
          {
            "name": "type",
            "value": "html"
          }
        ]
      },
      {
        "label": "Detail",
        "tagName": "div",
        "filterTemplate": "<input id=\"detail-filter\" class=\"form-control\" type=\"text\" placeholder=\"Search detail\" filter-query=\"$document .list-view\" filter-query-key=\"detail\" />",
        "tableTemplate": "{{object.detail}}",
        "attributes": [
          {
            "name": "editor",
            "value": "ckeditor-classic"
          },
          {
            "name": "key",
            "value": "detail"
          },
          {
            "name": "type",
            "value": "html"
          }
        ]
      },
      {
        "label": "Image",
        "tagName": "input",
        "tableTemplate": "<img src=\"{{object.image}}\" alt=\"Catalog Image\" class=\"avatar-xs rounded\" />",
        "attributes": [
          {
            "name": "class",
            "value": "form-control d-none"
          },
          {
            "name": "id",
            "value": "catalog-image-input"
          },
          {
            "name": "type",
            "value": "file"
          },
          {
            "name": "accept",
            "value": "image/png, image/gif, image/jpeg"
          },
          {
            "name": "key",
            "value": "image"
          },
          {
            "name": "type",
            "value": "file"
          }
        ]
      },
      {
        "label": "Gallery",
        "tagName": "div",
        "tableTemplate": "\n\t\t\t\t\t<span array=\"items\" object=\"{{object._id}}\" key=\"gallery\" render-query=\"[template]\">\n\t\t\t\t\t\t<span template>\n\t\t\t\t\t\t\t<a href=\"{{gallery}}\" target=\"_blank\">Gallery Image</a>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "dropzone"
          },
          {
            "name": "id",
            "value": "catalog-gallery-dropzone"
          },
          {
            "name": "key",
            "value": "gallery"
          },
          {
            "name": "type",
            "value": "file"
          }
        ]
      },
     {
        "label": "Seller",
        "tagName": "input",
        "filterTemplate": "<input id=\"seller_id-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter seller id\" filter-query=\"$document .list-view\" filter-query-key=\"seller_id\" />",
        "tableTemplate": "{{object.seller_id}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "items-seller-id-input"
          },
          {
            "name": "placeholder",
            "value": "Enter seller_id (reference)"
          },
          {
            "name": "key",
            "value": "seller_id"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Manufacturer Name",
        "tagName": "input",
        "filterTemplate": "<input id=\"manufacturer_name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter manufacturer name\" filter-query=\"$document .list-view\" filter-query-key=\"manufacturer.name\" />",
        "tableTemplate": "{{object.manufacturer.name}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "manufacturer-name-input"
          },
          {
            "name": "placeholder",
            "value": "Enter manufacturer name"
          },
          {
            "name": "key",
            "value": "manufacturer.name"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Manufacturer Brand",
        "tagName": "input",
        "filterTemplate": "<input id=\"manufacturer_brand-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter manufacturer brand\" filter-query=\"$document .list-view\" filter-query-key=\"manufacturer.brand\" />",
        "tableTemplate": "{{object.manufacturer.brand}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "manufacturer-brand-input"
          },
          {
            "name": "placeholder",
            "value": "Enter manufacturer brand"
          },
          {
            "name": "key",
            "value": "manufacturer.brand"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Stock",
        "tagName": "input",
        "filterTemplate": "<input id=\"stock-filter\" class=\"form-control\" type=\"text\" placeholder=\"Stock\" filter-query=\"$document .list-view\" filter-query-key=\"stock\" />",
        "tableTemplate": "{{object.stock}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "stock-input"
          },
          {
            "name": "placeholder",
            "value": "Stock"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "stock"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Price",
        "tagName": "input",
        "filterTemplate": "<input id=\"price-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter price\" filter-query=\"$document .list-view\" filter-query-key=\"price\" />",
        "tableTemplate": "{{object.price}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "items-price-input"
          },
          {
            "name": "placeholder",
            "value": "Enter price"
          },
          {
            "name": "aria-label",
            "value": "Price"
          },
          {
            "name": "key",
            "value": "price"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Discount",
        "tagName": "input",
        "filterTemplate": "<input id=\"discount-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter discount\" filter-query=\"$document .list-view\" filter-query-key=\"discount\" />",
        "tableTemplate": "{{object.discount}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "items-discount-input"
          },
          {
            "name": "placeholder",
            "value": "Enter discount"
          },
          {
            "name": "aria-label",
            "value": "discount"
          },
          {
            "name": "key",
            "value": "discount"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Orders",
        "tagName": "input",
        "filterTemplate": "<input id=\"orders-filter\" class=\"form-control\" type=\"text\" placeholder=\"Orders\" filter-query=\"$document .list-view\" filter-query-key=\"orders\" />",
        "tableTemplate": "{{object.orders}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "orders-input"
          },
          {
            "name": "placeholder",
            "value": "Orders"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "orders"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Meta Title",
        "tagName": "input",
        "filterTemplate": "<input id=\"meta_title-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter meta title\" filter-query=\"$document .list-view\" filter-query-key=\"meta.title\" />",
        "tableTemplate": "{{object.meta.title}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "meta-title-input"
          },
          {
            "name": "placeholder",
            "value": "Enter meta title"
          },
          {
            "name": "key",
            "value": "meta.title"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Meta Keywords",
        "tagName": "input",
        "filterTemplate": "<input id=\"meta_keywords-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter meta keywords\" filter-query=\"$document .list-view\" filter-query-key=\"meta.keywords\" />",
        "tableTemplate": "{{object.meta.keywords}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "meta-keywords-input"
          },
          {
            "name": "placeholder",
            "value": "Enter meta keywords"
          },
          {
            "name": "key",
            "value": "meta.keywords"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Meta Description",
        "tagName": "textarea",
        "filterTemplate": "<input id=\"meta_description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter meta description\" filter-query=\"$document .list-view\" filter-query-key=\"meta.description\" />",
        "tableTemplate": "{{object.meta.description}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "meta-description-input"
          },
          {
            "name": "rows",
            "value": 3
          },
          {
            "name": "placeholder",
            "value": "Enter meta description"
          },
          {
            "name": "key",
            "value": "meta.description"
          },
          {
            "name": "type",
            "value": "textarea"
          }
        ]
      },
      {
        "label": "Publish Status",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"publish_status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"publish.status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option value=\"Published\">Published</option>\n\t\t\t\t\t\t<option value=\"Scheduled\">Scheduled</option>\n\t\t\t\t\t\t<option value=\"Draft\">Draft</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "{{object.publish.status}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "choices-publish-status-input"
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
            "name": "key",
            "value": "publish.status"
          }
        ],
        "children": [
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Published"
              }
            ],
            "innerText": "Published"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Scheduled"
              }
            ],
            "innerText": "Scheduled"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Draft"
              }
            ],
            "innerText": "Draft"
          }
        ]
      },
      {
        "label": "Visibility",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"visibility-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"publish.visibility\">\n\t\t\t\t\t\t<option value=\"\">Select Visibility</option>\n\t\t\t\t\t\t<option value=\"Public\">Public</option>\n\t\t\t\t\t\t<option value=\"Hidden\">Hidden</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "{{object.publish.visibility}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "choices-publish-visibility-input"
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
            "name": "key",
            "value": "publish.visibility"
          }
        ],
        "children": [
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Public"
              }
            ],
            "innerText": "Public"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Hidden"
              }
            ],
            "innerText": "Hidden"
          }
        ]
      },
      {
        "label": "Publish On",
        "tagName": "input",
        "filterTemplate": "<input id=\"publish_date-filter\" class=\"form-control\" type=\"dat\" filter-query=\"$document .list-view\" filter-query-key=\"publish.on\" />",
        "tableTemplate": "{{object.publish.on}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "datepicker-publish-input"
          },
          {
            "name": "date-picker",
            "value": "flatpickr"
          },
          {
            "name": "data-date-format",
            "value": "d.m.y"
          },
          {
            "name": "data-enable-time",
            "value": true
          },
          {
            "name": "placeholder",
            "value": "Enter publish date"
          },
          {
            "name": "key",
            "value": "publish.on"
          },
          {
            "name": "type",
            "value": "dat"
          }
        ]
      },
      {
        "label": "Published By",
        "tagName": "input",
        "filterTemplate": "<input id=\"publish_by-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter publisher id or name\" filter-query=\"$document .list-view\" filter-query-key=\"publish.by\" />",
        "tableTemplate": "{{object.publish.by}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "publish-by-input"
          },
          {
            "name": "placeholder",
            "value": "Enter publisher id or name"
          },
          {
            "name": "key",
            "value": "publish.by"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Category",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"category-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"category\">\n\t\t\t\t\t\t<option value=\"\">Select Category</option>\n\t\t\t\t\t\t<option value=\"Appliances\">Appliances</option>\n\t\t\t\t\t\t<option value=\"Automotive Accessories\">Automotive Accessories</option>\n\t\t\t\t\t\t<option value=\"Electronics\">Electronics</option>\n\t\t\t\t\t\t<option value=\"Fashion\">Fashion</option>\n\t\t\t\t\t\t<option value=\"Furniture\">Furniture</option>\n\t\t\t\t\t\t<option value=\"Grocery\">Grocery</option>\n\t\t\t\t\t\t<option value=\"Kids\">Kids</option>\n\t\t\t\t\t\t<option value=\"Watches\">Watches</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "{{object.category}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "choices-category-input"
          },
          {
            "name": "name",
            "value": "choices-category-input"
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
                "value": "Appliances"
              }
            ],
            "innerText": "Appliances"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Automotive Accessories"
              }
            ],
            "innerText": "Automotive Accessories"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Electronics"
              }
            ],
            "innerText": "Electronics"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Fashion"
              }
            ],
            "innerText": "Fashion"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Furniture"
              }
            ],
            "innerText": "Furniture"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Grocery"
              }
            ],
            "innerText": "Grocery"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Kids"
              }
            ],
            "innerText": "Kids"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Watches"
              }
            ],
            "innerText": "Watches"
          }
        ]
      },
      {
        "label": "Short Description",
        "tagName": "textarea",
        "filterTemplate": "<input id=\"short_description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Short description\" filter-query=\"$document .list-view\" filter-query-key=\"short_description\" />",
        "tableTemplate": "{{object.short_description}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Must enter minimum of a 100 characters"
          },
          {
            "name": "rows",
            "value": 3
          },
          {
            "name": "key",
            "value": "short_description"
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
        "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option template value=\"{{object.key}}\">{{object.label}}</option>\n\t\t\t\t\t</select>\n\t\t\t\t\t<div array=\"items\" object=\"statuses\" render-query=\"$previous\"></div>\n\t\t\t\t",
        "tableTemplate": "{{object.status}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "items-status"
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
                "value": true
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
        "label": "Tags",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"\">Select Tags</option>\n\t\t\t\t\t\t<option value=\"new\">New</option>\n\t\t\t\t\t\t<option value=\"sale\">Sale</option>\n\t\t\t\t\t\t<option value=\"featured\">Featured</option>\n\t\t\t\t\t\t<option value=\"clearance\">Clearance</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "\n\t\t\t\t\t<span array=\"items\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n\t\t\t\t\t\t<span template class=\"badge bg-primary-subtle text-primary me-1\">\n\t\t\t\t\t\t\t{{tags}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "items-tags"
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
                "value": "new"
              }
            ],
            "innerText": "New"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "sale"
              }
            ],
            "innerText": "Sale"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "featured"
              }
            ],
            "innerText": "Featured"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "clearance"
              }
            ],
            "innerText": "Clearance"
          }
        ]
      },
      {
        "label": "Type",
        "tagName": "select",
        "filterTemplate": "<select id=\"type-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"type\"><option value=\"\">Select Type</option><option value=\"product\">Product</option><option value=\"service\">Service</option><option value=\"digital\">Digital</option></select>",
        "tableTemplate": "{{object.type}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "items-type-select"
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
                "value": "product"
              }
            ],
            "innerText": "Product"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "service"
              }
            ],
            "innerText": "Service"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "digital"
              }
            ],
            "innerText": "Digital"
          }
        ]
      }
    ]
  },
  "upsert": true
};
