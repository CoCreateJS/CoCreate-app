export default {
  "method": "object.update",
  "array": "apps",
  "object": {
    "_id": "68741e1d07a037d0d6d00ee4",
    "name": "Projects",
    "singularName": "Project",
    "path": "apps/projects",
    "array": "projects",
    "mainViews": [
      "table",
      "grid",
      "kanban"
    ],
    "secondaryViews": [
      "details",
      "form"
    ],
    "icon": "ri-briefcase-line",
    "description": "App to manage and track Projects.",
    "status": "active",
    "fields": [
      {
        "label": "Project Name",
        "tagName": "input",
        "filterTemplate": "<input id=\"project-name-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter project name\" filter-query=\"$document .list-view\" filter-query-key=\"name\" />",
        "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/projects/details.html\" aria-controls=\"offcanvas-app\" aria-expanded=\"false\" aria-open>\n            <div state-to=\"offcanvas-app-form\" state.array=\"projects\" state.object=\"{{object._id}}\"></div>\n            <span>{{object.name}}</span>\n          </a>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "project-name"
          },
          {
            "name": "placeholder",
            "value": "Enter project name"
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
        "tagName": "textarea",
        "filterTemplate": "<input id=\"project-description-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter description\" filter-query=\"$document .list-view\" filter-query-key=\"description\" />",
        "tableTemplate": "{{object.description}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "project-description"
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
        "label": "Thumbnail Image",
        "tagName": "input",
        "tableTemplate": "<img src=\"{{object.thumbnail}}\" alt=\"Thumbnail\" class=\"avatar-xs rounded\" />",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "project-thumbnail-img"
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
            "value": "thumbnail"
          },
          {
            "name": "type",
            "value": "file"
          }
        ]
      },
      {
        "label": "Priority",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"priority-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"priority\">\n\t\t\t\t\t\t<option value=\"\">Select Priority</option>\n\t\t\t\t\t\t<option value=\"High\">High</option>\n\t\t\t\t\t\t<option value=\"Medium\">Medium</option>\n\t\t\t\t\t\t<option value=\"Low\">Low</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.priority\" render-as=\"priority\" template class=\"badge bg-primary-subtle text-primary me-1\">\n       {{priority}}\n     </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "choices-priority-input"
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
            "value": "priority"
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
            "innerText": "Select Priority"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "High"
              }
            ],
            "innerText": "High"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Medium"
              }
            ],
            "innerText": "Medium"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Low"
              }
            ],
            "innerText": "Low"
          }
        ]
      },
      {
        "label": "Status",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option value=\"inprogress\">In Progress</option>\n\t\t\t\t\t\t<option value=\"completed\">Completed</option>\n\t\t\t\t\t\t<option value=\"on_hold\">On Hold</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "{{object.status}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "project-status"
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
                "value": "inprogress"
              }
            ],
            "innerText": "In Progress"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "completed"
              }
            ],
            "innerText": "Completed"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "on_hold"
              }
            ],
            "innerText": "On Hold"
          }
        ]
      },
      {
        "label": "Stage",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"stage-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"stage\">\n\t\t\t\t\t\t<option value=\"\">Select Stage</option>\n\t\t\t\t\t\t<option value=\"planning\">Planning</option>\n\t\t\t\t\t\t<option value=\"development\">Development</option>\n\t\t\t\t\t\t<option value=\"testing\">Testing</option>\n\t\t\t\t\t\t<option value=\"deployment\">Deployment</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.stage\" render-as=\"stage\" template class=\"badge bg-primary-subtle text-primary me-1\">\n       {{stage}}\n     </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "project-stage"
          },
          {
            "name": "key",
            "value": "stage"
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
            "innerText": "Select Stage"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "planning"
              }
            ],
            "innerText": "Planning"
          },
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
                "value": "deployment"
              }
            ],
            "innerText": "Deployment"
          }
        ]
      },
      {
        "label": "Type",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"type-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"type\">\n\t\t\t\t\t\t<option value=\"\">Select Type</option>\n\t\t\t\t\t\t<option value=\"project\">Project</option>\n\t\t\t\t\t\t<option value=\"task\">Task</option>\n\t\t\t\t\t\t<option value=\"issue\">Issue</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n       {{type}}\n     </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "project-type"
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
                "value": "project"
              }
            ],
            "innerText": "Project"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "task"
              }
            ],
            "innerText": "Task"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "issue"
              }
            ],
            "innerText": "Issue"
          }
        ]
      },
      {
        "label": "Tags",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"internal\">Internal</option>\n\t\t\t\t\t\t<option value=\"external\">External</option>\n\t\t\t\t\t\t<option value=\"urgent\">Urgent</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "\n\t\t\t\t\t<span array=\"projects\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n\t\t\t\t\t\t<span template class=\"badge bg-primary-subtle text-primary me-1\">\n\t\t\t\t\t\t\t{{tags}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "project-tags"
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
                "value": "internal"
              }
            ],
            "innerText": "Internal"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "external"
              }
            ],
            "innerText": "External"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "urgent"
              }
            ],
            "innerText": "Urgent"
          }
        ]
      },
      {
        "label": "Deadline",
        "tagName": "input",
        "filterTemplate": "<input id=\"deadline-filter\" class=\"form-control\" type=\"dat\" filter-query=\"$document .list-view\" filter-query-key=\"deadline\" />",
        "tableTemplate": "{{object.deadline}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "datepicker-deadline-input"
          },
          {
            "name": "plugin",
            "value": "flatpickr"
          },
          {
            "name": "placeholder",
            "value": "Enter due date"
          },
          {
            "name": "key",
            "value": "deadline"
          },
          {
            "name": "type",
            "value": "dat"
          }
        ]
      },
      {
        "label": "Attachments",
        "tagName": "div",
        "tableTemplate": "\n\t\t\t\t\t<span array=\"projects\" object=\"{{object._id}}\" key=\"attachments\" render-query=\"[template]\">\n\t\t\t\t\t\t<span template>\n\t\t\t\t\t\t\t<a href=\"{{attachments}}\" target=\"_blank\">Attachment</a>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t",
        "attributes": [
          {
            "name": "plugin",
            "value": "dropzone"
          },
          {
            "name": "class",
            "value": "dropzone"
          },
          {
            "name": "id",
            "value": "project-attachments"
          },
          {
            "name": "key",
            "value": "attachments"
          },
          {
            "name": "type",
            "value": "file"
          }
        ]
      },
      {
        "label": "Privacy",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"privacy-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"privacy\">\n\t\t\t\t\t\t<option value=\"\">Select Privacy</option>\n\t\t\t\t\t\t<option value=\"Private\">Private</option>\n\t\t\t\t\t\t<option value=\"Team\">Team</option>\n\t\t\t\t\t\t<option value=\"Public\">Public</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.privacy\" render-as=\"privacy\" template class=\"badge bg-primary-subtle text-primary me-1\">\n       {{privacy}}\n     </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "choices-privacy-status-input"
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
            "value": "privacy"
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
            "innerText": "Select Privacy"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Private"
              }
            ],
            "innerText": "Private"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Team"
              }
            ],
            "innerText": "Team"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Public"
              }
            ],
            "innerText": "Public"
          }
        ]
      },
      {
        "label": "Categories",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"categories-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"categories\">\n\t\t\t\t\t\t<option value=\"\">Select Category</option>\n\t\t\t\t\t\t<option value=\"Designing\">Designing</option>\n\t\t\t\t\t\t<option value=\"Development\">Development</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.categories\" render-as=\"categories\" template class=\"badge bg-primary-subtle text-primary me-1\">\n       {{categories}}\n     </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "choices-categories-input"
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
            "value": "categories"
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
            "innerText": "Select Category"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Designing"
              }
            ],
            "innerText": "Designing"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Development"
              }
            ],
            "innerText": "Development"
          }
        ]
      },
      {
        "label": "Skills",
        "tagName": "input",
        "filterTemplate": "<input id=\"skills-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter Skills\" filter-query=\"$document .list-view\" filter-query-key=\"skills\" />",
        "tableTemplate": "{{object.skills}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "choices-text-input"
          },
          {
            "name": "plugin",
            "value": "choices"
          },
          {
            "name": "data-choices-limit",
            "value": "Required Limit"
          },
          {
            "name": "placeholder",
            "value": "Enter Skills"
          },
          {
            "name": "key",
            "value": "skills"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Team Lead",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"team-lead-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"team_lead\">\n\t\t\t\t\t\t<option value=\"\">Select Team Lead</option>\n\t\t\t\t\t\t<option value=\"Brent Gonzalez\">Brent Gonzalez</option>\n\t\t\t\t\t\t<option value=\"Darline Williams\">Darline Williams</option>\n\t\t\t\t\t\t<option value=\"Sylvia Wright\">Sylvia Wright</option>\n\t\t\t\t\t\t<option value=\"Ellen Smith\">Ellen Smith</option>\n\t\t\t\t\t\t<option value=\"Jeffrey Salazar\">Jeffrey Salazar</option>\n\t\t\t\t\t\t<option value=\"Mark Williams\">Mark Williams</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.team_lead\" render-as=\"team_lead\" template class=\"badge bg-primary-subtle text-primary me-1\">\n       {{team_lead}}\n     </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "choices-lead-input"
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
            "value": "team_lead"
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
            "innerText": "Select Team Lead"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Brent Gonzalez"
              }
            ],
            "innerText": "Brent Gonzalez"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Darline Williams"
              }
            ],
            "innerText": "Darline Williams"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Sylvia Wright"
              }
            ],
            "innerText": "Sylvia Wright"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Ellen Smith"
              }
            ],
            "innerText": "Ellen Smith"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Jeffrey Salazar"
              }
            ],
            "innerText": "Jeffrey Salazar"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Mark Williams"
              }
            ],
            "innerText": "Mark Williams"
          }
        ]
      },
      {
        "label": "Team Members",
        "tagName": "div",
        "tableTemplate": "{{object.team_members}}",
        "attributes": [
          {
            "name": "src",
            "value": "components/avatar-group.html"
          },
          {
            "name": "key",
            "value": "team_members"
          },
          {
            "name": "type",
            "value": "custom"
          }
        ]
      }
    ]
  },
  "upsert": true
};