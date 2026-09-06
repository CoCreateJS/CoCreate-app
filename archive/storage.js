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
export default {
    "method": "object.update",
    "array": "servers_config",
    "upsert": true,
    "object": [
        {
            "_id": "65f8cb447b39a3c1a8904e10",
            "type": "storage",
            "provider": "amazon-redshift",
            "name": "Amazon Redshift Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/postgresql.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e11",
            "type": "storage",
            "provider": "auroradb",
            "name": "AWS Aurora DB Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/postgresql.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e12",
            "type": "storage",
            "provider": "cockroachdb",
            "name": "CockroachDB Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/postgresql.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e13",
            "type": "storage",
            "provider": "cosmosdb",
            "name": "Azure Cosmos DB Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/mongodb.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e14",
            "type": "storage",
            "provider": "documentdb",
            "name": "Amazon DocumentDB Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/mongodb.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e15",
            "type": "storage",
            "provider": "dqlite",
            "name": "DQlite Distributed SQLite Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/sqlite.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e16",
            "type": "storage",
            "provider": "dynamodb",
            "name": "Amazon DynamoDB Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/dynamodb.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e17",
            "type": "storage",
            "provider": "ferretdb",
            "name": "FerretDB Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/mongodb.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e18",
            "type": "storage",
            "provider": "firestore",
            "name": "Google Cloud Firestore Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/firestore.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e19",
            "type": "storage",
            "provider": "mariadb",
            "name": "MariaDB Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/mysql.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e00",
            "type": "storage",
            "provider": "mongodb",
            "name": "MongoDB Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/mongodb.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e02",
            "type": "storage",
            "provider": "mysql",
            "name": "MySQL Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/mysql.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e1a",
            "type": "storage",
            "provider": "oracledb",
            "name": "Oracle Database Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/mongodb.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e1b",
            "type": "storage",
            "provider": "planetscale",
            "name": "PlanetScale Serverless Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/mysql.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e01",
            "type": "storage",
            "provider": "postgresql",
            "name": "PostgreSQL Relational Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/postgresql.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e1c",
            "type": "storage",
            "provider": "rqlite",
            "name": "rqlite Distributed SQLite Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/sqlite.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e1d",
            "type": "storage",
            "provider": "qdrant",
            "name": "Qdrant Vector Database Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/qdrant.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e03",
            "type": "storage",
            "provider": "sqlite",
            "name": "SQLite Embedded Storage Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/sqlite.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e1e",
            "type": "storage",
            "provider": "tidb",
            "name": "TiDB Distributed Database Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/mysql.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e1f",
            "type": "storage",
            "provider": "timescaledb",
            "name": "TimescaleDB Time-Series Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/postgresql.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e20",
            "type": "storage",
            "provider": "turso",
            "name": "Turso / libSQL Distributed Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/sqlite.js"
            }
        },
        {
            "_id": "65f8cb447b39a3c1a8904e21",
            "type": "storage",
            "provider": "yugabytedb",
            "name": "YugabyteDB Distributed SQL Driver",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "pathname": "drivers/postgresql.js"
            }
        }
    ]
};
