/********************************************************************************
 * Copyright (C) 2026 CoCreate and Contributors.
 *
 * Licensed under GNU AGPLv3.
 ********************************************************************************/

/**
 * Seeding Payload: servers_config collection
 * 
 * Telemetry configuration entries for metric collection and write intervals,
 * retention policy, broadcast options, and cluster scale/safety thresholds
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
            "_id": "66c9fe7a3f81b4d912a58b91",
            "type": "telemetry",
            "name": "Cluster Autoscale Configuration",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
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