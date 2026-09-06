export default {
  "method": "object.update",
  "array": "apps",
  "object": {
    "_id": "68741e1d07a037d0d6d00ef5",
    "name": "Jobs",
    "singularName": "Job",
    "path": "apps/jobs",
    "card": "/apps/jobs/card.html",
    "cardTemplate": "/apps/jobs/card-template.html",
    "array": "jobPosts",
    "category": "Human Resources",
    "mainViews": [
      "table",
      "grid",
      "kanban"
    ],
    "secondaryViews": [
      "details",
      "form"
    ],
    "icon": "ri-briefcase-2-line",
    "description": "App to manage and track Jobs.",
    "status": "active",
    "fields": [
      {
        "label": "Job Title",
        "tagName": "input",
        "filterTemplate": "<input id=\"title-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter job title\" filter-query=\"$document .list-view\" filter-query-key=\"jobTitle\" />",
        "tableTemplate": "\n\t\t\t\t\t<a role=\"button\" tabindex=\"0\" state-to=\"offcanvas-app-view\" state.src=\"/apps/jobs/details.html\" aria-controls=\"offcanvas-app\" aria-open aria-haspopup=\"dialog\" aria-expanded=\"false\">\n\t\t\t\t\t\t<div state-to=\"offcanvas-app-form\" state.array=\"jobPosts\" state.object=\"{{object._id}}\"></div>\n\t\t\t\t\t\t<span>{{object.jobTitle}}</span>\n\t\t\t\t\t</a>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "title-Input"
          },
          {
            "name": "placeholder",
            "value": "Enter job title"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "jobTitle"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Job Position",
        "tagName": "input",
        "filterTemplate": "<input id=\"position-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter job position\" filter-query=\"$document .list-view\" filter-query-key=\"position\" />",
        "tableTemplate": "{{object.position}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "position-Input"
          },
          {
            "name": "placeholder",
            "value": "Enter job position"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "position"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Job Category",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"category-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"category\">\n\t\t\t\t\t\t<option value=\"\">Select Category</option>\n\t\t\t\t\t\t<option value=\"Accounting & Finance\">Accounting & Finance</option>\n\t\t\t\t\t\t<option value=\"Purchasing Manager\">Purchasing Manager</option>\n\t\t\t\t\t\t<option value=\"Education & training\">Education & training</option>\n\t\t\t\t\t\t<option value=\"Marketing & Advertising\">Marketing & Advertising</option>\n\t\t\t\t\t\t<option value=\"It / Software Jobs\">It / Software Jobs</option>\n\t\t\t\t\t\t<option value=\"Digital Marketing\">Digital Marketing</option>\n\t\t\t\t\t\t<option value=\"Administrative Officer\">Administrative Officer</option>\n\t\t\t\t\t\t<option value=\"Government Jobs\">Government Jobs</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.category\" render-as=\"category\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{category}}\n    </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "name",
            "value": "category-Input"
          },
          {
            "name": "plugin",
            "value": "choices"
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
            "innerText": "Select Category"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Accounting & Finance"
              }
            ],
            "innerText": "Accounting & Finance"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Purchasing Manager"
              }
            ],
            "innerText": "Purchasing Manager"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Education & training"
              }
            ],
            "innerText": "Education & training"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Marketing & Advertising"
              }
            ],
            "innerText": "Marketing & Advertising"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "It / Software Jobs"
              }
            ],
            "innerText": "It / Software Jobs"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Digital Marketing"
              }
            ],
            "innerText": "Digital Marketing"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Administrative Officer"
              }
            ],
            "innerText": "Administrative Officer"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Government Jobs"
              }
            ],
            "innerText": "Government Jobs"
          }
        ]
      },
      {
        "label": "Job Type",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"type-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"type\">\n\t\t\t\t\t\t<option value=\"\">Select job type</option>\n\t\t\t\t\t\t<option value=\"Full Time\">Full Time</option>\n\t\t\t\t\t\t<option value=\"Part Time\">Part Time</option>\n\t\t\t\t\t\t<option value=\"Freelance\">Freelance</option>\n\t\t\t\t\t\t<option value=\"Internship\">Internship</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.type\" render-as=\"type\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{type}}\n    </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "name",
            "value": "type-Input"
          },
          {
            "name": "plugin",
            "value": "choices"
          },
          {
            "name": "required",
            "value": true
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
            "innerText": "Select job type"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Full Time"
              }
            ],
            "innerText": "Full Time"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Part Time"
              }
            ],
            "innerText": "Part Time"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Freelance"
              }
            ],
            "innerText": "Freelance"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "Internship"
              }
            ],
            "innerText": "Internship"
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
            "value": 3
          },
          {
            "name": "placeholder",
            "value": "Enter description"
          },
          {
            "name": "required",
            "value": true
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
        "label": "No. of Vacancy",
        "tagName": "input",
        "filterTemplate": "<input id=\" vacancy-filter\" class=\"form-control\" type=\"number\" placeholder=\"No. of vacancy\" filter-query=\"$document .list-view\" filter-query-key=\"vacancy\" />",
        "tableTemplate": "{{object.vacancy}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "vancancy-Input"
          },
          {
            "name": "placeholder",
            "value": "No. of vacancy"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "vacancy"
          },
          {
            "name": "type",
            "value": "number"
          }
        ]
      },
      {
        "label": "Experience",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"experience-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"experience\">\n\t\t\t\t\t\t<option value=\"\">Select Experience</option>\n\t\t\t\t\t\t<option value=\"0 Year\">0 Year</option>\n\t\t\t\t\t\t<option value=\"2 Years\">2 Years</option>\n\t\t\t\t\t\t<option value=\"3 Years\">3 Years</option>\n\t\t\t\t\t\t<option value=\"4 Years\">4 Years</option>\n\t\t\t\t\t\t<option value=\"5 Years\">5 Years</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.experience\" render-as=\"experience\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{experience}}\n    </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "name",
            "value": "experience-Input"
          },
          {
            "name": "plugin",
            "value": "choices"
          },
          {
            "name": "key",
            "value": "experience"
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
            "innerText": "Select Experience"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "0 Year"
              }
            ],
            "innerText": "0 Year"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "2 Years"
              }
            ],
            "innerText": "2 Years"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "3 Years"
              }
            ],
            "innerText": "3 Years"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "4 Years"
              }
            ],
            "innerText": "4 Years"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "5 Years"
              }
            ],
            "innerText": "5 Years"
          }
        ]
      },
      {
        "label": "Last Date of Apply",
        "tagName": "input",
        "filterTemplate": "<input id=\"last_apply_date-filter\" class=\"form-control\" type=\"dat\" filter-query=\"$document .list-view\" filter-query-key=\"last_apply_date\" />",
        "tableTemplate": "{{object.last_apply_date}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "last-apply-date-Input"
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
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "last_apply_date"
          },
          {
            "name": "type",
            "value": "dat"
          }
        ]
      },
      {
        "label": "Close Date",
        "tagName": "input",
        "filterTemplate": "<input id=\"close_date-filter\" class=\"form-control\" type=\"dat\" filter-query=\"$document .list-view\" filter-query-key=\"close_date\" />",
        "tableTemplate": "{{object.close_date}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "close-date-Input"
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
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "close_date"
          },
          {
            "name": "type",
            "value": "dat"
          }
        ]
      },
      {
        "label": "Start Salary",
        "tagName": "input",
        "filterTemplate": "<input id=\"start_salary-filter\" class=\"form-control\" type=\"number\" placeholder=\"Enter start salary\" filter-query=\"$document .list-view\" filter-query-key=\"start_salary\" />",
        "tableTemplate": "{{object.start_salary}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "start-salary-Input"
          },
          {
            "name": "placeholder",
            "value": "Enter start salary"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "start_salary"
          },
          {
            "name": "type",
            "value": "number"
          }
        ]
      },
      {
        "label": "Last Salary",
        "tagName": "input",
        "filterTemplate": "<input id=\"last_salary-filter\" class=\"form-control\" type=\"number\" placeholder=\"Enter end salary\" filter-query=\"$document .list-view\" filter-query-key=\"last_salary\" />",
        "tableTemplate": "{{object.last_salary}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "last-salary-Input"
          },
          {
            "name": "placeholder",
            "value": "Enter end salary"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "last_salary"
          },
          {
            "name": "type",
            "value": "number"
          }
        ]
      },
      {
        "label": "Country",
        "tagName": "input",
        "filterTemplate": "<input id=\"country-filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter country\" filter-query=\"$document .list-view\" filter-query-key=\"country\" />",
        "tableTemplate": "{{object.country}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "country-Input"
          },
          {
            "name": "placeholder",
            "value": "Enter country"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "country"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "State",
        "tagName": "input",
        "filterTemplate": "<input id=\"state.filter\" class=\"form-control\" type=\"text\" placeholder=\"Enter city\" filter-query=\"$document .list-view\" filter-query-key=\"state\" />",
        "tableTemplate": "{{object.state}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-control"
          },
          {
            "name": "id",
            "value": "city-Input"
          },
          {
            "name": "placeholder",
            "value": "Enter city"
          },
          {
            "name": "required",
            "value": true
          },
          {
            "name": "key",
            "value": "state"
          },
          {
            "name": "type",
            "value": "text"
          }
        ]
      },
      {
        "label": "Tags",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"tags-filter\" class=\"form-select\" multiple filter-query=\"$document .list-view\" filter-query-key=\"tags\">\n\t\t\t\t\t\t<option value=\"remote\">Remote</option>\n\t\t\t\t\t\t<option value=\"full-time\">Full-time</option>\n\t\t\t\t\t\t<option value=\"part-time\">Part-time</option>\n\t\t\t\t\t\t<option value=\"internship\">Internship</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "\n\t\t\t\t\t<span array=\"job\" object=\"{{object._id}}\" key=\"tags\" render-query=\"[template]\">\n\t\t\t\t\t\t<span template class=\"badge bg-primary-subtle text-primary me-1\">\n\t\t\t\t\t\t\t{{tags}}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</span>\n\t\t\t\t",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "job-tags"
          },
          {
            "name": "multiple",
            "value": true
          },
          {
            "name": "plugin",
            "value": "choices"
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
                "value": "remote"
              }
            ],
            "innerText": "Remote"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "full-time"
              }
            ],
            "innerText": "Full-time"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "part-time"
              }
            ],
            "innerText": "Part-time"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "internship"
              }
            ],
            "innerText": "Internship"
          }
        ]
      },
      {
        "label": "Status",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"status-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"status\">\n\t\t\t\t\t\t<option value=\"\">Select Status</option>\n\t\t\t\t\t\t<option value=\"open\">Open</option>\n\t\t\t\t\t\t<option value=\"closed\">Closed</option>\n\t\t\t\t\t\t<option value=\"paused\">Paused</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "{{object.status}}",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "job-status"
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
                "value": "open"
              }
            ],
            "innerText": "Open"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "closed"
              }
            ],
            "innerText": "Closed"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "paused"
              }
            ],
            "innerText": "Paused"
          }
        ]
      },
      {
        "label": "Stage",
        "tagName": "select",
        "filterTemplate": "\n\t\t\t\t\t<select id=\"stage-filter\" class=\"form-select\" filter-query=\"$document .list-view\" filter-query-key=\"stage\">\n\t\t\t\t\t\t<option value=\"\">Select Stage</option>\n\t\t\t\t\t\t<option value=\"posting\">Posting</option>\n\t\t\t\t\t\t<option value=\"interview\">Interview</option>\n\t\t\t\t\t\t<option value=\"offer\">Offer</option>\n\t\t\t\t\t\t<option value=\"hired\">Hired</option>\n\t\t\t\t\t</select>\n\t\t\t\t",
        "tableTemplate": "<span render=\"object.stage\" render-as=\"stage\" template class=\"badge bg-primary-subtle text-primary me-1\">\n      {{stage}}\n    </span>",
        "attributes": [
          {
            "name": "class",
            "value": "form-select"
          },
          {
            "name": "id",
            "value": "job-stage"
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
                "value": "posting"
              }
            ],
            "innerText": "Posting"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "interview"
              }
            ],
            "innerText": "Interview"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "offer"
              }
            ],
            "innerText": "Offer"
          },
          {
            "tagName": "option",
            "attributes": [
              {
                "name": "value",
                "value": "hired"
              }
            ],
            "innerText": "Hired"
          }
        ]
      }
    ]
  },
  "upsert": true
};
