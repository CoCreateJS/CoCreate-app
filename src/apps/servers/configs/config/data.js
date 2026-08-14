/********************************************************************************
 * Copyright (C) 2026 CoCreate and Contributors.
 *
 * Licensed under GNU AGPLv3.
 ********************************************************************************/

/**
 * Seeding Payload: servers_config collection
 * 
 * Maps modular micro-configuration documents for dynamic storage database drivers,
 * cloud providers, and runtime cluster scopes into the 'servers_config' array.
 * 
 * Note: Storage drivers that act as wire-protocol wrappers or API compatibility layers
 * reference their primary core driver pathname directly (e.g. SQLite, MongoDB, MySQL, PostgreSQL).
 */
export const seedSystemConfigsPayload = {
  "method": "object.update",
  "array": "servers_config",
  "upsert": true,
  "object": [
  ]
};