module.exports = {
  "method": "object.update",
  "array": "apps",
  "object": {
    "_id": "68741e1d07a037d0d6d00ef8",
    "name": "NFT",
    "singularName": "NFT",
    "path": "apps/nft",
    "array": "nft",
    "mainViews": [
      "table",
      "grid",
      "kanban"
    ],
    "secondaryViews": [
      "details",
      "form"
    ],
    "icon": "ri-apps-2-line",
    "description": "App to manage and track NFTs.",
    "status": "active",
    "fields": [
      {
        "label": "NFT Name",
        "tagName": "input",
        "filterTemplate": "<input id=\"nft-name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter NFT name\" filter-query=\"$document .list-view\" filter-query-key=\"name\" />",
        "tableTemplate": "\n          <a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/nft/details.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n              <div state-to=\"offcanvas-app-form\" state.array=\"nft\" state.object=\"{{object._id}}\"></div>\n              <span>{{object.name}}</span>\n          </a>\n        ",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "nft-name"
          },
          {
            "name": "placeholder",
            "value": "Enter NFT name"
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
        "label": "Token ID",
        "tagName": "input",
        "filterTemplate": "<input id=\"nft-token-id-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter token ID\" filter-query=\"$document .list-view\" filter-query-key=\"token_id\" />",
        "tableTemplate": "{{object.token_id}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "nft-token-id"
          },
          {
            "name": "placeholder",
            "value": "Enter token ID"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "token_id"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Owner",
        "tagName": "input",
        "filterTemplate": "<input id=\"nft-owner-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter owner\" filter-query=\"$document .list-view\" filter-query-key=\"owner\" />",
        "tableTemplate": "{{object.owner}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "nft-owner"
          },
          {
            "name": "placeholder",
            "value": "Enter owner"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "owner"
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
        "filterTemplate": "\n          <select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n            <option value=\"\">Select Status</option>\n            <option template value=\"{{object.key}}\">{{object.label}}</option>\n          </select>\n          <div array=\"nft\" object=\"statuses\" render-query=\"$previous\"></div>\n        ",
        "tableTemplate": "{{object.status}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "nft-status"
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
        "options": [
          {
            "name": "minted",
            "label": "Minted"
          },
          {
            "name": "listed",
            "label": "Listed"
          },
          {
            "name": "sold",
            "label": "Sold"
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
                "value": "minted"
              }
            ],
            "innerText": "Minted"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "listed"
              }
            ],
            "innerText": "Listed"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "sold"
              }
            ],
            "innerText": "Sold"
          }
        ]
      },
      {
        "label": "Type",
        "tagName": "select",
        "filterTemplate": "<select id=\"type-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"type\"><option value=\"\">Select Type</option><option template value=\"{{option}}\">{{option}}</option></select>",
        "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n       {{type}}\n     </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "nft-type"
          },
          {
            "name": "key",
            "value": "type"
          }
        ],
        "options": [
          {
            "value": "nft",
            "label": "NFT"
          },
          {
            "value": "digital_asset",
            "label": "Digital Asset"
          },
          {
            "value": "collectible",
            "label": "Collectible"
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
                "value": "nft"
              }
            ],
            "innerText": "NFT"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "digital_asset"
              }
            ],
            "innerText": "Digital Asset"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "collectible"
              }
            ],
            "innerText": "Collectible"
          }
        ]
      },
      {
        "label": "Tags",
        "tagName": "select",
        "filterTemplate": "\n          <select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n            <option value=\"art\">Art</option>\n            <option value=\"collectible\">Collectible</option>\n            <option value=\"music\">Music</option>\n            <option value=\"digital\">Digital</option>\n          </select>\n        ",
        "tableTemplate": "\n          <span array=\"nft\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n            <span template class=\"badge bg-primary-subtle text-primary me-1\">\n              {{tags}}\n            </span>\n          </span>\n        ",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "nft-tags"
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
        "options": [
          {
            "value": "art",
            "label": "Art"
          },
          {
            "value": "collectible",
            "label": "Collectible"
          },
          {
            "value": "music",
            "label": "Music"
          },
          {
            "value": "digital",
            "label": "Digital"
          }
        ],
        "children": [
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "art"
              }
            ],
            "innerText": "Art"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "collectible"
              }
            ],
            "innerText": "Collectible"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "music"
              }
            ],
            "innerText": "Music"
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
      },
      {
        "label": "Image URL",
        "tagName": "input",
        "filterTemplate": "<input id=\"nft-image-url-filter\" class=\"form-control\" type=\"url\" placeholder=\"Enter image URL\" filter-query=\"$document .list-view\" filter-query-key=\"imageUrl\" />",
        "tableTemplate": "<img src=\"{{object.imageUrl}}\" alt=\"NFT Image\" style=\"max-width: 50px; max-height: 50px;\" />",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "nft-image-url"
          },
          {
            "name": "placeholder",
            "value": "Enter image URL"
          },
          {
            "name": "type",
            "value": "url"
          },
          {
            "name": "key",
            "value": "imageUrl"
          }
        ]
      },
      {
        "label": "Description",
        "tagName": "textarea",
        "filterTemplate": "<textarea id=\"nft-description-filter\" class=\"form-control\" placeholder=\"Enter description\" filter-query=\"$document .list-view\" filter-query-key=\"description\"></textarea>",
        "tableTemplate": "<span title=\"{{object.description}}\">{{object.description | truncate:50}}</span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "nft-description"
          },
          {
            "name": "placeholder",
            "value": "Enter description"
          },
          {
            "name": "rows",
            "value": 3
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
        "label": "Collection",
        "tagName": "input",
        "filterTemplate": "<input id=\"nft-collection-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter collection name\" filter-query=\"$document .list-view\" filter-query-key=\"collection\" />",
        "tableTemplate": "{{object.collection}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "nft-collection"
          },
          {
            "name": "placeholder",
            "value": "Enter collection name"
          },
          {
            "name": "key",
            "value": "collection"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Mint Date",
        "tagName": "input",
        "filterTemplate": "<input id=\"nft-mint-date-filter\" class=\"form-control\" type=\"dat\" placeholder=\"Select mint date\" filter-query=\"$document .list-view\" filter-query-key=\"mintDate\" />",
        "tableTemplate": "{{object.mintDate | date:'yyyy-MM-dd'}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "nft-mint-date"
          },
          {
            "name": "type",
            "value": "dat"
          },
          {
            "name": "key",
            "value": "mintDate"
          }
        ]
      }
    ]
  },
  "upsert": true
};