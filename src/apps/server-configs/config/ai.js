/********************************************************************************
 * Copyright (C) 2026 CoCreate and Contributors.
 *
 * Licensed under GNU AGPLv3.
 ********************************************************************************/

/**
 * Seeding Payload: servers_config collection
 * 
 * AI configuration entries for server-side copilots and provider definitions
 * stored in the 'servers_config' array.
 *
 * Each AI provider is a separate top-level `ai` object alongside system-level
 * defaults; provider config is namespaced under "providers.<name>" dot-keys
 * (matching the "clouds.<provider>" convention) since @cocreate/config merges
 * matching docs' config objects with a flat Object.assign — unnamespaced
 * keys shared across docs (for example api and models) would overwrite each other.
 *
 * Providers: copilot (via @github/copilot-sdk), openai, and gemini. There is
 * no separate "github" provider — it duplicated copilot's code path with no
 * distinct implementation. OpenAI exposes the supported general, pro, compact,
 * and coding variants newer than GPT-5 while retaining earlier models for
 * compatibility. Copilot stays single-tier (gpt-5-mini).
 */
export default {
    "method": "object.update",
    "array": "servers_config",
    "upsert": true,
    "object": [
        {
            "_id": "65f8cb447b39a3c1a8904e40",
            "type": "ai",
            "provider": "system",
            "name": "Server AI Defaults",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "enabled": true,
                "platformCredentialFallback": true,
                "defaultProvider": "copilot",
                "defaultStorageTarget": "local",
                "allowLocalFileSystem": true,
                "allowUnconfirmedLocalWrite": false,
                "allowPlatformCommands": true,
                "platformCommandTimeout": 600000,
                "platformCommandMaxOutputBytes": 1048576,
                "localFsRoot": "/home/ubuntu/Dev/CoCreate-server/organizations",
                "publicPath": "/public",
                "tools": {
                    "crud": {
                        "description": "The database-agnostic interface for CoCreate application and system data. Call get_ai_instructions with name=crud before using database-, array-, or object-level CRUD. Never generate SQL or ask for a database engine. User-facing resources may be apps mapped to differently named arrays: before reporting an unfamiliar or unsuccessful resource as missing, query apps by name or singularName and use its declared array and established discriminator; Leads may map to contacts. Only method is universally required. Omitted database defaults to the authenticated organization_id. storage, database, and array accept one name or an array of names for multi-target execution through the same unified envelope. The response payload key matches the method target: database.*, array.*, and object.* return database, array, and object respectively. Do not expect the current CRUD payload under data. Do not supply organization_id, socket, or request-context fields because authenticated scope is injected by the server. External API credentials must use request_api_credential, and endpoint or webhook writes must follow the executable structures in the applicable instructions.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "method": {
                                    "type": "string",
                                    "description": "Dot-notated target and action: database.read/delete; array.create/read/update/delete; or object.create/read/update/delete."
                                },
                                "database": {
                                    "description": "Optional database name or array of database names. Omitted database defaults to the authenticated organization_id."
                                },
                                "array": {
                                    "description": "Logical array name, array of names, or old-name to new-name mapping for array.update."
                                },
                                "object": {
                                    "type": "array",
                                    "items": {
                                        "type": "object"
                                    },
                                    "description": "Optional objects or object identifiers used by create, update, or delete operations; object.read does not require it."
                                },
                                "filter": {
                                    "type": "object",
                                    "description": "Native query controls. Use query for matching, key for field selection, limit for page size, index for offset, and sort as [{key, direction}]."
                                },
                                "storage": {
                                    "description": "Optional configured storage wrapper name or array of names. Multiple names run the unified request across those storage targets."
                                },
                                "upsert": {
                                    "type": "boolean",
                                    "description": "Create the object when an update does not find a match."
                                }
                            },
                            "required": [
                                "method"
                            ],
                            "additionalProperties": true
                        }
                    },
                    "search_conversation_history": {
                        "description": "Retrieves older messages from the current conversation when the automatically supplied recent context is insufficient. The server fixes organization_id and conversation_id internally; never ask the user for either value. Use query for a case-insensitive content search, or skip and limit to page backward through history. Results contain only role and content. Use this tool only when earlier context is genuinely needed.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "query": {
                                    "type": "string",
                                    "description": "Optional word or phrase to find in older message content."
                                },
                                "skip": {
                                    "type": "number",
                                    "description": "Number of newest matching messages to skip for pagination."
                                },
                                "limit": {
                                    "type": "number",
                                    "description": "Messages to return, from 1 through 20."
                                }
                            },
                            "additionalProperties": false
                        }
                    },
                    "request_api_credential": {
                        "description": "Shows a friendly, secure, CRUD-mapped API-key input card for an existing API configuration. Before calling it, briefly tell the user which integration is being connected and what the key enables; do not show or narrate the underlying CRUD payload. For a new integration, create its apis record with crud first, then call this tool using that exact name. Use it whenever a user needs to connect, configure, or replace a credential for Stripe, OpenAI, SendGrid, GitHub, or another API. Never ask the user to paste a credential into chat, never read a credential from apis or keys, and never include a credential in another tool payload. The card saves directly to apis.key and the AI never receives the value.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "api": {
                                    "type": "string",
                                    "description": "Exact name of the existing API configuration to receive a key."
                                }
                            },
                            "required": [
                                "api"
                            ],
                            "additionalProperties": false
                        }
                    },
                    "get_ai_instructions": {
                        "description": "Retrieves focused operating instructions and supporting context by name. Call name=apis before acting on any third-party integration feature, including payments, checkout, customers, subscriptions, invoices, refunds, email, messaging, or provider webhooks—even when the request sounds like a general coding task. Call name=ast before creating, updating, or validating executable AST; its sources include the deployed AST runtime when available. Default instructions are loaded by the server; all others are retrieved from the requesting organization's ai-instructions records.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "description": "Instruction name, such as crud, files, apis, crm, or an organization-specific workflow."
                                }
                            },
                            "required": ["name"],
                            "additionalProperties": false
                        }
                    },
                    "execute_server_api": {
                        "description": "Executes server.api.send(data) for configured third-party integrations and endpoint macros. api selects the saved API configuration, such as stripe, stripe-test, or sendgrid. method is the HTTP method, such as get or post. endpoint is either a stored endpoint name or a direct provider path; when a stored endpoint matches, its configuration overrides the request. Provider request content belongs in data. searchParams, headers, timeout, and url are top-level request directives. The authenticated organization_id and host are injected automatically. Inbound webhooks are handled by server.api.webhook through real HTTP routing and are not simulated by this tool.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "api": {
                                    "type": "string",
                                    "description": "Saved API configuration name, such as stripe or stripe-test."
                                },
                                "method": {
                                    "type": "string",
                                    "description": "HTTP method such as get, post, put, patch, or delete."
                                },
                                "endpoint": {
                                    "type": "string",
                                    "description": "Stored endpoint name such as create-customer, or direct provider path such as /v1/customers."
                                },
                                "data": {
                                    "description": "Request content sent to the provider."
                                },
                                "searchParams": {
                                    "type": "object",
                                    "description": "Query parameters appended to the resolved URL."
                                },
                                "url": {
                                    "type": "string",
                                    "description": "Optional absolute URL for a direct request."
                                },
                                "headers": {
                                    "type": "object",
                                    "description": "Additional request headers."
                                },
                                "timeout": {
                                    "type": "number",
                                    "description": "Request timeout in milliseconds; defaults to 15000."
                                }
                            },
                            "required": [
                                "method"
                            ],
                            "additionalProperties": true
                        }
                    },
                    "send_server_message": {
                        "description": "Dispatches a generic event through server.send(payload), the server-side IPC and mesh router. Use manage_server_cluster for cordon, shed, drain, restart, reboot, and shutdown. A browser normally begins this flow with CoCreate.socket.send(data); the socket server then passes the same top-level envelope to server.send(data). worker, server, and cluster each accept one ID or an array. broadcast is opt-in and omitted means false. organization_id is injected as routing scope and does not imply broadcast. Internal uuid, workerId, serverId, and status lifecycle metadata are managed automatically.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "method": {
                                    "type": "string",
                                    "description": "Event name emitted to the receiving server or worker handler."
                                },
                                "worker": {
                                    "description": "One worker ID or an array of worker IDs.",
                                    "oneOf": [
                                        {
                                            "type": ["string", "number"]
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": ["string", "number"]
                                            }
                                        }
                                    ]
                                },
                                "server": {
                                    "description": "One server ID or an array of server IDs.",
                                    "oneOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        }
                                    ]
                                },
                                "cluster": {
                                    "description": "One cluster ID or an array of cluster IDs.",
                                    "oneOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        }
                                    ]
                                },
                                "master": {
                                    "type": "boolean",
                                    "description": "Target the primary process when true. Omit for worker-only delivery."
                                },
                                "broadcast": {
                                    "type": "boolean",
                                    "description": "Opt in to delivery across all applicable targets. Omitted broadcast is false."
                                },
                                "broadcastSender": {
                                    "type": "boolean",
                                    "description": "Include the originating location in delivery and await its resulting envelope. Set false for fire-and-forget delivery that excludes the origin."
                                },
                                "data": {
                                    "description": "Optional event-specific JSON-serializable data."
                                }
                            },
                            "required": [
                                "method"
                            ],
                            "additionalProperties": true
                        }
                    },
                    "request_server_file": {
                        "description": "Resolves a server file through server.files using the authenticated host and organization.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "path": {
                                    "type": "string",
                                    "description": "File path, e.g. /index.html or /api/data"
                                }
                            },
                            "required": [
                                "path"
                            ]
                        }
                    },
                    "read_virtual_file": {
                        "description": "Reads a virtual file from the CRUD-backed file repository.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "filePath": {
                                    "type": "string",
                                    "description": "Virtual path, e.g. /src/App.js"
                                }
                            },
                            "required": [
                                "filePath"
                            ]
                        }
                    },
                    "write_virtual_file": {
                        "description": "Creates or updates a virtual client/application file in CRUD storage (array: files). Use for UI, assets, and explicit file changes. Do not use it to implement provider-facing server behavior for Stripe or another third-party integration: configure that behavior through apis, endpoints, and webhooks records after retrieving API guidance. Do not create Node, Express, SDK-wrapper, controller, route, or .env files for behavior supported by @cocreate/api.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "filePath": {
                                    "type": "string"
                                },
                                "content": {
                                    "type": "string"
                                },
                                "mimeType": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "filePath",
                                "content"
                            ]
                        }
                    },
                    "delete_virtual_file": {
                        "description": "Deletes a virtual file from CRUD storage by path.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "filePath": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "filePath"
                            ]
                        }
                    },
                    "list_virtual_files": {
                        "description": "Lists virtual files from CRUD storage by optional path prefix.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "prefix": {
                                    "type": "string",
                                    "description": "Optional path prefix, e.g. /src/"
                                },
                                "limit": {
                                    "type": "number",
                                    "description": "Maximum files to return"
                                }
                            }
                        }
                    },
                    "read_project_file": {
                        "description": "Reads from virtual or local file storage depending on target or context. With target=auto or omitted, the configured local organization workspace is preferred.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "filePath": {
                                    "type": "string"
                                },
                                "startLine": {
                                    "type": "integer",
                                    "minimum": 1
                                },
                                "endLine": {
                                    "type": "integer",
                                    "minimum": 1
                                },
                                "target": {
                                    "type": "string",
                                    "enum": [
                                        "virtual",
                                        "local",
                                        "auto"
                                    ]
                                }
                            },
                            "required": [
                                "filePath"
                            ]
                        }
                    },
                    "write_project_file": {
                        "description": "Writes to virtual or local storage depending on target or context. With target=auto or omitted, the configured local organization workspace is preferred; publishing the change to the live CRUD-backed file repository remains an explicit coc upload operation.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "filePath": {
                                    "type": "string"
                                },
                                "content": {
                                    "type": "string"
                                },
                                "mimeType": {
                                    "type": "string"
                                },
                                "target": {
                                    "type": "string",
                                    "enum": [
                                        "virtual",
                                        "local",
                                        "auto"
                                    ]
                                }
                            },
                            "required": [
                                "filePath",
                                "content"
                            ]
                        }
                    },
                    "read_local_file": {
                        "description": "Reads a line range from a local file within the authenticated organization's sites workspace. Large files must be read in successive ranges; use totalLines and hasMore to continue.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "filePath": {
                                    "type": "string"
                                },
                                "startLine": {
                                    "type": "integer",
                                    "minimum": 1,
                                    "description": "First line to return. Defaults to 1."
                                },
                                "endLine": {
                                    "type": "integer",
                                    "minimum": 1,
                                    "description": "Last line to return. Defaults to 400 lines after startLine."
                                }
                            },
                            "required": [
                                "filePath"
                            ]
                        }
                    },
                    "edit_local_file": {
                        "description": "Safely edits part of a local file by replacing one exact, unique block of text. Read the relevant line range first and include enough surrounding text for oldText to match exactly once. The operation refuses missing or ambiguous matches and preserves the rest of the file.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "filePath": {
                                    "type": "string"
                                },
                                "oldText": {
                                    "type": "string"
                                },
                                "newText": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "filePath",
                                "oldText",
                                "newText"
                            ]
                        }
                    },
                    "write_local_file": {
                        "description": "Writes a file within the authenticated organization's sites workspace. AI runtime metadata under .ai is outside this tool's path boundary. Only available when allowLocalFileSystem=true.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "filePath": {
                                    "type": "string"
                                },
                                "content": {
                                    "type": "string"
                                }
                            },
                            "required": [
                                "filePath",
                                "content"
                            ]
                        }
                    },
                    "coc": {
                        "description": "Downloads database-backed site files into the authenticated organization's isolated sites workspace or uploads selected site files through tenant-scoped CRUD. Site downloads process one file at a time and skip existing files unless overwrite=true. AI metadata under .ai is inaccessible to this tool. This tool cannot execute commands.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "action": {
                                    "type": "string",
                                    "enum": [
                                        "download",
                                        "upload"
                                    ]
                                },
                                "paths": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Virtual paths to download or local project paths to upload."
                                },
                                "site": {
                                    "type": "boolean",
                                    "description": "Download the complete website one file at a time."
                                },
                                "overwrite": {
                                    "type": "boolean",
                                    "description": "Replace existing workspace files during download. Defaults to false."
                                }
                            },
                            "required": [
                                "action"
                            ]
                        }
                    },
                    "git_project": {
                        "description": "Inspects and manages local Git history in the authenticated organization's isolated project workspace. Repository cloning, remotes, credentials, and network synchronization are server-owned and unavailable to this tool. Mutating actions require explicit local-write confirmation unless the server permits unconfirmed local writes.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "action": {
                                    "type": "string",
                                    "enum": [
                                        "status",
                                        "list_files",
                                        "diff",
                                        "log",
                                        "show",
                                        "commit",
                                        "create_branch",
                                        "switch_branch",
                                        "revert"
                                    ]
                                },
                                "paths": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Exact project-relative paths. Absolute paths and Git pathspec magic are rejected."
                                },
                                "message": {
                                    "type": "string",
                                    "description": "Commit message required by the commit action."
                                },
                                "revision": {
                                    "type": "string",
                                    "description": "Commit or revision required by revert and optional for show."
                                },
                                "branch": {
                                    "type": "string",
                                    "description": "Branch name required by create_branch and switch_branch."
                                },
                                "staged": {
                                    "type": "boolean",
                                    "description": "Show staged changes when action is diff."
                                },
                                "stat": {
                                    "type": "boolean",
                                    "description": "Show a diff summary instead of a patch when action is diff."
                                },
                                "limit": {
                                    "type": "integer",
                                    "minimum": 1,
                                    "maximum": 200,
                                    "description": "Maximum number of files or commits to return."
                                }
                            },
                            "required": [
                                "action"
                            ],
                            "additionalProperties": false
                        }
                    },
                    "execute_command": {
                        "description": "Executes an unrestricted shell command on the server as the CoCreate process account. Available only when the authenticated organization is the platform organization and platform command execution is enabled. Use the organization's sites workspace by default; an explicit relative or absolute working directory may be supplied. This is the platform escape hatch for Git, package managers, builds, tests, deployment, and system operations that do not have a structured tool.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "command": {
                                    "type": "string",
                                    "description": "Complete shell command to execute."
                                },
                                "cwd": {
                                    "type": "string",
                                    "description": "Optional working directory. Relative paths resolve from the platform organization's sites workspace; absolute paths are accepted in platform mode."
                                },
                                "timeout": {
                                    "type": "integer",
                                    "minimum": 1000,
                                    "maximum": 600000,
                                    "description": "Optional timeout in milliseconds."
                                },
                                "input": {
                                    "type": "string",
                                    "description": "Optional standard input supplied to the command."
                                }
                            },
                            "required": [
                                "command"
                            ],
                            "additionalProperties": false
                        }
                    },
                    "send_socket_message": {
                        "description": "Sends a WebSocket message to the current client by default, to another clientId when explicitly provided, or broadcasts when broadcast=true. Direct messages use the authenticated organization and current request context.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "data": {
                                    "type": "object",
                                    "description": "Message payload object to transmit"
                                },
                                "clientId": {
                                    "description": "One stable target client ID or an array of client IDs. Defaults to the client that initiated the AI request.",
                                    "oneOf": [
                                        {
                                            "type": "string"
                                        },
                                        {
                                            "type": "array",
                                            "items": {
                                                "type": "string"
                                            }
                                        }
                                    ]
                                },
                                "broadcast": {
                                    "type": "boolean",
                                    "description": "Send to all eligible clients. Defaults to false."
                                }
                            },
                            "required": [
                                "data"
                            ]
                        }
                    },
                    "manage_server_storage": {
                        "description": "Gets, sets, deletes, clears, or checks size of shared cluster state across worker nodes in server.storage. RESTRICTED: Platform-level action reserved exclusively for platform organization matching server.organization_id.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "action": {
                                    "type": "string",
                                    "enum": [
                                        "get",
                                        "set",
                                        "delete",
                                        "size",
                                        "clear"
                                    ],
                                    "description": "Storage operation to perform"
                                },
                                "key": {
                                    "type": "string",
                                    "description": "Key identifier in shared storage (required for get, set, delete)"
                                },
                                "value": {
                                    "description": "Value to store (required for set action, accepts string, number, object, array, boolean)"
                                }
                            },
                            "required": [
                                "action"
                            ]
                        }
                    },
                    "manage_server_cluster": {
                        "description": "Inspects and controls CoCreate servers. list/get read the servers collection; self returns the running process; control dispatches validated worker or master operations through server.send. Infrastructure uses provider-agnostic vmId and vmType fields. Worker controls are cordon, shed, and drain. restart may target a worker or, when worker is omitted, the master application. reboot and shutdown target the master host. Explain the effect and obtain clear user intent before state-changing operations. RESTRICTED: platform organization only.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "action": {
                                    "type": "string",
                                    "enum": [
                                        "list",
                                        "get",
                                        "self",
                                        "control"
                                    ],
                                    "description": "list, get, or self inspect topology; control performs an authorized server operation."
                                },
                                "serverId": {
                                    "type": "string",
                                    "description": "Target server _id, used with action=\"get\""
                                },
                                "host": {
                                    "type": "string",
                                    "description": "Target server host, used with action=\"get\""
                                },
                                "status": {
                                    "type": "string",
                                    "description": "Optional status filter for action=\"list\" (e.g. \"running\", \"stopped\", \"restarting\", \"rebooting\")"
                                },
                                "limit": {
                                    "type": "number",
                                    "description": "Optional max documents to return for action=\"list\" (default 50)"
                                },
                                "operation": {
                                    "type": "string",
                                    "enum": ["cordon", "shed", "drain", "restart", "reboot", "shutdown"],
                                    "description": "Operation for action=\"control\"."
                                },
                                "worker": {
                                    "description": "Worker ID or array of worker IDs. Required for cordon, shed, and drain; optional for restart.",
                                    "oneOf": [
                                        { "type": ["string", "number"] },
                                        { "type": "array", "items": { "type": ["string", "number"] } }
                                    ]
                                },
                                "value": {
                                    "type": "boolean",
                                    "description": "Enable or disable cordon/drain. Defaults to true when omitted."
                                },
                                "organizations": {
                                    "description": "Organization ID, array of IDs, or false to stop shedding. Required for shed.",
                                    "oneOf": [
                                        { "type": "string" },
                                        { "type": "array", "items": { "type": "string" } },
                                        { "type": "boolean", "enum": [false] }
                                    ]
                                }
                            },
                            "required": [
                                "action"
                            ]
                        }
                    },
                    "manage_server_routes": {
                        "description": "Lists, registers, or removes exceptional custom routes in server.routes. Use only when the user explicitly requests custom route handling; normal CoCreate behavior does not require routes or local files. RESTRICTED: Platform-level action reserved exclusively for the platform organization matching server.organization_id.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "action": {
                                    "type": "string",
                                    "enum": [
                                        "add",
                                        "remove",
                                        "list"
                                    ],
                                    "description": "Route operation action"
                                },
                                "routePath": {
                                    "type": "string",
                                    "description": "Path pattern, e.g. /custom-route or /api/*"
                                },
                                "responseContent": {
                                    "type": "string",
                                    "description": "Content or response payload returned when route is hit"
                                },
                                "contentType": {
                                    "type": "string",
                                    "description": "Content-Type header for route response"
                                }
                            },
                            "required": [
                                "action"
                            ]
                        }
                    },
                    "manage_server_autoscaler": {
                        "description": "Uses the actual server.autoscaler interface. Restricted to the platform organization.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "action": {
                                    "type": "string",
                                    "enum": [
                                        "getConfig",
                                        "determineScaleOutTarget",
                                        "scaleOut",
                                        "determineScaleInTarget",
                                        "scaleIn"
                                    ],
                                    "description": "Autoscaler action to perform"
                                },
                                "value": {
                                    "description": "Native argument passed to the selected server.autoscaler method."
                                }
                            },
                            "required": [
                                "action"
                            ]
                        }
                    }
                }
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e41",
            "type": "ai",
            "provider": "copilot",
            "name": "Copilot AI Provider",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "providers.copilot": {
                    "api": "copilot",
                    "type": "copilot",
                    "models": {
                        "default": "gpt-5-mini",
                        "allowed": [
                            "gpt-5-mini"
                        ]
                    }
                }
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e43",
            "type": "ai",
            "provider": "openai",
            "name": "OpenAI Provider",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "providers.openai": {
                    "api": "openai",
                    "type": "openai",
                    "wireApi": "responses",
                    "models": {
                        "default": "gpt-5.6-terra",
                        "allowed": [
                            "gpt-5.6-terra",
                            "gpt-5.6-sol",
                            "gpt-5.6-luna",
                            "gpt-5.5",
                            "gpt-5.5-pro",
                            "gpt-5.4",
                            "gpt-5.4-pro",
                            "gpt-5.4-mini",
                            "gpt-5.4-nano",
                            "gpt-5.3-codex",
                            "gpt-5.2",
                            "gpt-5.2-pro",
                            "gpt-5.1",
                            "gpt-5-pro",
                            "gpt-5",
                            "gpt-5-mini",
                            "gpt-4.1"
                        ]
                    }
                }
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e44",
            "type": "ai",
            "provider": "gemini",
            "name": "Gemini Provider",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "providers.gemini": {
                    "api": "gemini",
                    "type": "gemeni",
                    "models": {
                        "default": "gemini-1.5-flash",
                        "allowed": [
                            "gemini-1.5-flash",
                            "gemini-1.5-pro"
                        ]
                    }
                }
            }
        }
    ]
};
