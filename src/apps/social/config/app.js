export default {
  "method": "object.update",
  "array": "apps",
  "object": {
    "_id": "6a96308fe438a005aaa9a967",
    "name": "Social",
    "singularName": "Post",
    "path": "apps/social",
    "card": "/apps/social/card.html",
    "cardTemplate": "/apps/social/card-template.html",
    "array": "posts",
    "icon": "ri-share-line",
    "description": "App to manage and track Social.",
    "status": "active",
    "category": "Marketing",
    "fields": [
      {
        "label": "Title",
        "tagName": "input",
        "tableTemplate": "{{object.title}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "placeholder",
            "value": "Post title"
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
        "label": "Content",
        "tagName": "textarea",
        "tableTemplate": "{{object.content}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "rows",
            "value": 4
          },
          {
            "name": "placeholder",
            "value": "Post body or caption"
          },
          {
            "name": "key",
            "value": "content"
          },
          {
            "name": "type",
            "value": "textarea"
          }
        ]
      },
      {
        "label": "Channels",
        "tagName": "select",
        "tableTemplate": "<span render=\"object.channels\" render-as=\"channels\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{channels}}\n</span>",
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
            "value": "channels"
          }
        ],
        "children": [
          {
            "tagName": "option",
            "attributes": [
              {
                "key": "value",
                "value": "Marketing"
              }
            ],
            "innerText": "Marketing"
          }
        ]
      },
      {
        "label": "Main Views",
        "tagName": "select",
        "tableTemplate": "<span render=\"object.mainViews\" render-as=\"mainViews\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{mainViews}}\n</span>",
        "attributes": [
          {
            "name": "key",
            "value": "mainViews"
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
                "key": "value",
                "value": "table"
              }
            ],
            "innerText": "table"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "key": "value",
                "value": "grid"
              }
            ],
            "innerText": "grid"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "key": "value",
                "value": "kanban"
              }
            ],
            "innerText": "kanban"
          }
        ]
      },
      {
        "label": "Secondary Views",
        "tagName": "select",
        "tableTemplate": "<span render=\"object.secondaryViews\" render-as=\"secondaryViews\" template class=\"badge bg-primary-subtle text-primary me-1\">\n  {{secondaryViews}}\n</span>",
        "attributes": [
          {
            "name": "key",
            "value": "secondaryViews"
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
                "key": "value",
                "value": "details"
              }
            ],
            "innerText": "details"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "key": "value",
                "value": "form"
              }
            ],
            "innerText": "form"
          }
        ]
      },
      {
        "label": "Publish Date",
        "tagName": "input",
        "tableTemplate": "{{object.publish_date}}",
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
            "value": "publish_date"
          },
          {
            "name": "type",
            "value": "dat"
          }
        ]
      }
    ]
  },
  "upsert": true
};
