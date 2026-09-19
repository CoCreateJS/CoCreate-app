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

/** Seeding payload: routing API providers. */

export default {
    "method": "object.update",
    "array": "apis",
    "upsert": true,
    "object": [
        {
            "_id": "65f8ca227b39a3c1a8904e11",
            "name": "cloudflare",
            "provider": "cloudflare",
            "type": "routing",
            "url": "https://api.cloudflare.com/client/v4",
            "headers": {
                "Authorization": {
                    "$concat": ["Bearer ", "$key"]
                },
                "Content-Type": "application/json"
            },
            "description": "Cloudflare routing integration for managing load balancer monitors, origin pools, and cluster hostnames.",
            "enabled": true
        },
        {
            "_id": "d299d2835e77c00fd8399930",
            "name": "DNSimple",
            "provider": "dnsimple",
            "type": "routing",
            "description": "DNSimple DNS and domain management connection.",
            "enabled": false
        },
        {
            "_id": "b1056eecfdf173eba3fc12b9",
            "name": "bunny.net",
            "provider": "bunny",
            "type": "routing",
            "description": "bunny.net DNS and traffic routing connection.",
            "enabled": false
        },
        {
            "_id": "250f308b656da78054fa6187",
            "name": "DNS Made Easy",
            "provider": "dnsmadeeasy",
            "type": "routing",
            "description": "DNS Made Easy managed DNS connection.",
            "enabled": false
        },
        {
            "_id": "0b5b72b4c249e30db0512e87",
            "name": "easyDNS",
            "provider": "easydns",
            "type": "routing",
            "description": "easyDNS managed DNS connection.",
            "enabled": false
        },
        {
            "_id": "bdd5676c43b5a75f6e1c5b67",
            "name": "ClouDNS",
            "provider": "cloudns",
            "type": "routing",
            "description": "ClouDNS managed DNS connection.",
            "enabled": false
        }
    ]
};
