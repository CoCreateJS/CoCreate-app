module.exports = {
  "method": "object.update",
  "upsert": true,
  "array": "apps",
  "object": {
    "_id": "68741e1d07a037d0d6b00aeb",
    "name": "Messages",
    "singularName": "Message",
    "path": "apps/chat",
    "array": "messages",
    "category": "Workspace",
    "mainViews": [
      "table",
      "kanban"
    ],
    "secondaryViews": [
      "details",
      "form"
    ],
    "fields": [
      {
        "label": "Chat ID",
        "tagName": "input",
        "filterTemplate": "<input id=\"chat-id-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter chat id\" filter-query=\"$document .list-view\" filter-query-key=\"chat_id.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.chat_id}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "chat-chat-id-field"
          },
          {
            "name": "placeholder",
            "value": "Enter chat id"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "chat_id"
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
        "filterTemplate": "<input id=\"content-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter content\" filter-query=\"$document .list-view\" filter-query-key=\"content.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.content}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "chat-content-field"
          },
          {
            "name": "rows",
            "value": 3
          },
          {
            "name": "placeholder",
            "value": "Enter message content"
          },
          {
            "name": "required",
            "value": true
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
        "label": "Parent ID",
        "tagName": "input",
        "filterTemplate": "<input id=\"parent-id-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter parent id\" filter-query=\"$document .list-view\" filter-query-key=\"parent_id.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.parent_id}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "chat-parent-id-field"
          },
          {
            "name": "placeholder",
            "value": "Enter parent message id"
          },
          {
            "name": "key",
            "value": "parent_id"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Is System",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"is-system-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"is_system\">\n\t\t\t\t\t\t<option value=\"\">All</option>\n\t\t\t\t\t\t<option value=\"true\">System</option>\n\t\t\t\t\t\t<option value=\"false\">User</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "{{object.is_system}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "chat-is-system-field"
          },
          {
            "name": "key",
            "value": "is_system"
          }
        ],
        "children": [
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "false"
              }
            ],
            "innerText": "User Message"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "true"
              }
            ],
            "innerText": "System Message"
          }
        ]
      },
      {
        "label": "Related",
        "tagName": "textarea",
        "filterTemplate": "<input id=\"related-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter related ids\" filter-query=\"$document .list-view\" filter-query-key=\"related.id.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.related}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "chat-related-field"
          },
          {
            "name": "rows",
            "value": 2
          },
          {
            "name": "placeholder",
            "value": "Enter related references"
          },
          {
            "name": "key",
            "value": "related"
          },
          {
            "name": "type",
            "value": "textarea"
          }
        ]
      },
      {
        "label": "Files",
        "tagName": "textarea",
        "filterTemplate": "<input id=\"files-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter file ids\" filter-query=\"$document .list-view\" filter-query-key=\"files.$in\" />",
        "tableTemplate": "{{object.files}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "chat-files-field"
          },
          {
            "name": "rows",
            "value": 2
          },
          {
            "name": "placeholder",
            "value": "Enter file ids"
          },
          {
            "name": "key",
            "value": "files"
          },
          {
            "name": "type",
            "value": "textarea"
          }
        ]
      },
      {
        "label": "Created On",
        "tagName": "input",
        "filterTemplate": "<input id=\"created-on-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter created date\" filter-query=\"$document .list-view\" filter-query-key=\"created.on\" />",
        "tableTemplate": "{{object.created.on}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "chat-created-on-field"
          },
          {
            "name": "placeholder",
            "value": "Enter created date"
          },
          {
            "name": "key",
            "value": "created.on"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Created By",
        "tagName": "input",
        "filterTemplate": "<input id=\"created-by-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter creator id\" filter-query=\"$document .list-view\" filter-query-key=\"created.by.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.created.by}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "chat-created-by-field"
          },
          {
            "name": "placeholder",
            "value": "Enter creator id"
          },
          {
            "name": "key",
            "value": "created.by"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Modified On",
        "tagName": "input",
        "filterTemplate": "<input id=\"modified-on-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter modified date\" filter-query=\"$document .list-view\" filter-query-key=\"modified.on\" />",
        "tableTemplate": "{{object.modified.on}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "chat-modified-on-field"
          },
          {
            "name": "placeholder",
            "value": "Enter modified date"
          },
          {
            "name": "key",
            "value": "modified.on"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Modified By",
        "tagName": "input",
        "filterTemplate": "<input id=\"modified-by-filter\" class=\"form-control\" type=\"text\" placeholder=\"Filter modifier id\" filter-query=\"$document .list-view\" filter-query-key=\"modified.by.$regex\" filter-query-options=\"i\" />",
        "tableTemplate": "{{object.modified.by}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "chat-modified-by-field"
          },
          {
            "name": "placeholder",
            "value": "Enter modifier id"
          },
          {
            "name": "key",
            "value": "modified.by"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      }
    ],
    "icon": "ri-chat-3-line",
    "description": "App to manage and track Chat.",
    "status": "active"
  }
};
