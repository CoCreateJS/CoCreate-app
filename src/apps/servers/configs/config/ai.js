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
                "defaultProvider": "copilot",
                "defaultStorageTarget": "virtual",
                "allowLocalFileSystem": false,
                "allowUnconfirmedLocalWrite": false,
                "publicPath": "/public",
                "tools": {
                    "server_crud": {
                        "description": "The standard and only database interface for CoCreate application and system data. Use this tool immediately when a user asks about records in our database or system, records we have, registered records, lists, or counts. Never generate SQL or ask for a database type, table, ORM, or driver. Infer array from the named resource, such as organizations -> array=\"organizations\", and use the unified CRUD payload. The method prefix defines the response payload key: object.read, object.create, object.update, and object.delete return response.object; if that method-derived key is unavailable, use response.data. Use method=\"object.create\" with object as an array. Use method=\"object.read\" with filter.query, filter.limit, filter.sort, and filter.key. filter.key is the native field-selection object, for example {\"name\":1,\"_id\":0}; do not use filter.projection. Request only the fields needed instead of asking for confirmation because unrelated fields may be sensitive. Use method=\"object.update\" with object as an array. Use method=\"object.delete\" with object identifiers or a query. Do not use array=\"secrets\" for external API credentials and never write apis.key with this tool: create the non-secret apis record, then use request_api_credential. Writes to endpoints and webhooks must use the exact executable AST record structures from API guidance; never substitute handler/code/source/route/events pseudocode. Do not supply socket or request-context fields; the authenticated organization_id is injected by the server.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "method": {
                                    "type": "string",
                                    "description": "Dot-notated CRUD operation, such as object.create, object.read, object.update, or object.delete."
                                },
                                "array": {
                                    "type": "string",
                                    "description": "Logical collection or array name."
                                },
                                "object": {
                                    "type": "array",
                                    "items": {
                                        "type": "object"
                                    },
                                    "description": "Documents or document identifiers used by create, update, or delete operations."
                                },
                                "filter": {
                                    "type": "object",
                                    "description": "Native query controls. Use query for matching, key for field selection, limit for page size, index for offset, and sort as [{key, direction}]."
                                },
                                "storage": {
                                    "description": "Optional storage adapter name or array of adapter names."
                                },
                                "upsert": {
                                    "type": "boolean",
                                    "description": "Create the document when an update does not find a match."
                                }
                            },
                            "required": [
                                "method",
                                "array"
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
                        "description": "Shows a friendly, secure, CRUD-mapped API-key input card for an existing API configuration. Before calling it, briefly tell the user which integration is being connected and what the key enables; do not show or narrate the underlying CRUD payload. For a new integration, create its apis record with server_crud first, then call this tool using that exact name. Use it whenever a user needs to connect, configure, or replace a credential for Stripe, OpenAI, SendGrid, GitHub, or another API. Never ask the user to paste a credential into chat, never read a credential from apis or keys, and never include a credential in another tool payload. The card saves directly to apis.key and the AI never receives the value.",
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
                    "get_ai_guidance": {
                        "description": "Retrieves focused operating guidance for a specialized task. Call topic=apis before acting on any third-party integration feature, including payments, checkout, customers, subscriptions, invoices, refunds, email, messaging, or provider webhooks—even when the request sounds like a general coding task. Core and default topics are loaded by the server; all other topics are retrieved from the requesting organization's ai-guidance records.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "topic": {
                                    "type": "string",
                                    "description": "Guidance topic, such as crud, files, apis, crm, or an organization-specific workflow."
                                }
                            },
                            "required": ["topic"],
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
                        "description": "Dispatches an event through server.send(payload), CoCreateServer's unified process and server routing entry point. The method field names the event. On a worker, server.send forwards the payload to the master. On the master, worker may be one worker ID or an array of worker IDs; without worker, local workers are targeted by default. Set master=false to prevent local execution on the master. The server and cluster routing fields may each contain one ID or an array of IDs for upstream inter-server routing. Set broadcast=true for all applicable workers, servers, or clusters. The authenticated platform organization is injected automatically.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "method": {
                                    "type": "string",
                                    "description": "Event name emitted to the receiving server or worker handler."
                                },
                                "worker": {
                                    "description": "One worker ID or an array of worker IDs."
                                },
                                "server": {
                                    "description": "One server ID or an array of server IDs."
                                },
                                "cluster": {
                                    "description": "One cluster ID or an array of cluster IDs."
                                },
                                "master": {
                                    "type": "boolean",
                                    "description": "Whether the master should also handle the event. Use false to target workers only."
                                },
                                "broadcast": {
                                    "type": "boolean",
                                    "description": "Broadcast across all applicable targets."
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
                        "description": "Reads from virtual or local file storage depending on target or context.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "filePath": {
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
                                "filePath"
                            ]
                        }
                    },
                    "write_project_file": {
                        "description": "Writes to virtual or local storage depending on target or context.",
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
                        "description": "Reads a local server file. Only available when allowLocalFileSystem=true.",
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
                    "write_local_file": {
                        "description": "Writes a local server file. Only available when allowLocalFileSystem=true.",
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
                                    "type": "string",
                                    "description": "Stable target client ID. Defaults to the client that initiated the AI request."
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
                        "description": "Inspects cluster topology by reading the 'servers' collection: lists all servers, fetches a single server document (by _id or host), or returns this running server's own identity/location/infrastructure/worker states. RESTRICTED: Platform-level action reserved exclusively for platform organization matching server.organization_id.",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "action": {
                                    "type": "string",
                                    "enum": [
                                        "list",
                                        "get",
                                        "self"
                                    ],
                                    "description": "list: query multiple server documents. get: fetch one server by id or host. self: return this process's own server document."
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
                                }
                            },
                            "required": [
                                "action"
                            ]
                        }
                    },
                    "manage_server_routes": {
                        "description": "Registers, lists, or removes custom server routes in server.routes Map. RESTRICTED: Platform-level action reserved exclusively for platform organization matching server.organization_id.",
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
