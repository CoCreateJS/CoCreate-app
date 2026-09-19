/********************************************************************************
 * Copyright (C) 2023-2026 CoCreate and Contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 ********************************************************************************/

/** Seeding payload: storage API providers. */

export default {
    "method": "object.update",
    "array": "apis",
    "upsert": true,
    "object": [
        {
            "_id": "65f8ca227b39a3c1a8904dfd",
            "name": "mongodb",
            "type": "storage",
            "provider": "mongodb",
            "description": "Default CoCreate platform MongoDB storage connection.",
            "enabled": true
        },
        {
            "_id": "b9ac0fbeb30b0e0ebafd01a2",
            "name": "MySQL",
            "type": "storage",
            "provider": "mysql",
            "description": "MySQL storage connection.",
            "enabled": false
        },
        {
            "_id": "fa90ae1fabc189a016007c87",
            "name": "PostgreSQL",
            "type": "storage",
            "provider": "postgresql",
            "description": "PostgreSQL storage connection.",
            "enabled": false
        },
        {
            "_id": "b75b7ab325549ef6d77c68f7",
            "name": "SQLite / libSQL",
            "type": "storage",
            "provider": "sqlite",
            "description": "SQLite / libSQL storage connection.",
            "enabled": false
        },
        {
            "_id": "fa739ff8116f3996c3c6cd3b",
            "name": "Firestore",
            "type": "storage",
            "provider": "firestore",
            "description": "Firestore storage connection.",
            "enabled": false
        },
        {
            "_id": "3166d370930e26f236e2dfc0",
            "name": "DynamoDB",
            "type": "storage",
            "provider": "dynamodb",
            "description": "DynamoDB storage connection.",
            "enabled": false
        }
    ]
};
