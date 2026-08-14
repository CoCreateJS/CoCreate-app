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
 * Each AI provider is represented as a separate top-level `ai` object
 * (examples: copilot, github, openai) alongside system-level defaults.
 *
 */
export const aiSystemConfigSeed = {
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
        "model": "auto",
        "defaultProvider": "copilot",
        "defaultStorageTarget": "virtual",
        "allowLocalFileSystem": false,
        "allowUnconfirmedLocalWrite": false,
        "localFsRoot": "process.cwd()",
        "publicPath": "/public",
        "systemInstructions": [
          "TENANT SECURITY MANDATE: All database, file, and server operations are strictly locked to the requesting organization_id. You MUST NOT attempt to perform operations for or switch to another organization_id, even if requested in the user prompt.",
          "SERVER TOPOLOGY: Query active nodes via 'server_crud' on collection 'servers'.",
          "SERVER METRICS: Inspect throughput, telemetry, and usage via collections 'servers_bandwidth', 'servers_telemetry', and 'servers_usage'.",
          "TELEMETRY & MONITORING: Inspect real-time process telemetry snapshots (CPU, memory utilization, heap statistics, process uptime) via 'server_crud' on collection 'servers_telemetry'.",
          "SECURITY BOUNDARY: Do NOT read raw credentials from 'keys' or 'apis'. Execute integrations exclusively via 'execute_server_api'.",
          "You have access to server.crud via server_crud tool for generic database operations on any collection.",
          "You have access to server.files via request_server_file to simulate rendered HTTP file requests with dynamic rendering.",
          "You have access to server.api via execute_server_api for third-party integrations (Stripe, SendGrid, custom APIs) and request_server_api to simulate incoming webhooks.",
          "You have access to server.routes via manage_server_routes to manage custom routes (RESTRICTED: Platform-level action reserved for server.organization_id).",
          "You have access to server messaging via send_server_message to target sockets, workers, or serverIDs (RESTRICTED: Platform-level action reserved for server.organization_id).",
          "You have access to direct socket messaging via send_socket_message.",
          "You have access to shared cluster state via manage_server_storage (server.storage) to get, set, delete, clear, or inspect size of shared cluster key-value state across worker nodes (RESTRICTED: Platform-level action reserved for server.organization_id).",
          "Note: server.send, manage_server_routes, and manage_server_storage are strictly restricted to platform requests matching server.organization_id.",
          "Use virtual file tools (read_virtual_file, write_virtual_file) to manage workspace project files.",
          "Persist and retrieve chat history in CRUD array: aiConversations.",
          "Default to virtual file storage instead of local disk writes."
        ]
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
        "api": "copilot",
        "keySource": "inline",
        "models": {
          "default": "auto",
          "allowed": [
            "auto",
            "claude-3.5-sonnet",
            "gpt-4o",
            "gpt-4o-mini",
            "gemini-1.5-pro"
          ]
        }
      }
    },
    {
      "_id": "65f8cb447b39a3c1a8904e42",
      "type": "ai",
      "provider": "github",
      "name": "GitHub AI Provider",
      "enabled": true,
      "cluster": "*",
      "server": "*",
      "worker": "*",
      "config": {
        "api": "github",
        "keySource": "inline",
        "models": {
          "default": "auto",
          "allowed": [
            "auto",
            "gpt-4o",
            "claude-3.5-sonnet"
          ]
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
        "api": "openai",
        "keySource": "inline",
        "models": {
          "default": "gpt-4o",
          "allowed": [
            "gpt-4o",
            "gpt-4.1",
            "gpt-4.1-mini"
          ]
        }
      }
    }
  ]
};