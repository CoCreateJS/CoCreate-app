/********************************************************************************
 * Copyright (C) 2026 CoCreate and Contributors.
 *
 * Licensed under GNU AGPLv3.
 ********************************************************************************/

/**
 * Seeding Payload: servers_config collection
 * 
 * Telemetry configuration entries for server monitoring, collection and
 * write intervals, retention policy, broadcast options, and safety thresholds
 * stored in the 'servers_config' array.
 * 
 * Note: Telemetry-related settings are represented as individual objects
 * within the 'servers_config' array.
 */
export const seedTelemetryConfigs = {
  "method": "object.update",
  "array": "servers_config",
  "upsert": true,
  "object": [
    {
      "telemetry": {
        "enabled": true,
        "collectionInterval": 1000,
        "writeInterval": 240000,
        "retentionDays": 30,
        "broadcast": false,
        "scaleUpMemoryThreshold": 85,
        "safetyLimits": {
            "cordonMemoryThreshold": 90,
            "cordonCpuThreshold": 90
        }
      }
    }
  ]
};
