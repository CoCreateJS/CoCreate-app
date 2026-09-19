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

/** Seeding payload: cloud API providers. */

export default {
    "method": "object.update",
    "array": "apis",
    "upsert": true,
    "object": [
        {
            "_id": "65f8ca227b39a3c1a8904e02",
            "name": "aws",
            "type": "cloud",
            "provider": "aws",
            "url": {
                "$concat": [[
                    "https://ec2.",
                    "$payload.region",
                    ".amazonaws.com"
                ]]
            },
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=utf-8",
                "host": {
                    "$concat": [[
                        "ec2.",
                        "$payload.region",
                        ".amazonaws.com"
                    ]]
                },
                "x-amz-date": {
                    "$security.transform": [
                        "",
                        [{ "op": "timestamp", "format": "iso-basic" }]
                    ]
                },
                "Authorization": {
                    "$security.createAwsSigV4Token": [
                        {
                            "method": "$payload.method",
                            "uri": "$payload.endpoint",
                            "payload": {
                                "$objectToSearchParams": ["$payload.data", false]
                            },
                            "region": "$payload.region",
                            "service": "ec2",
                            "isoDate": "$x-amz-date",
                            "headers": {
                                "content-type": "application/x-www-form-urlencoded; charset=utf-8",
                                "host": {
                                    "$concat": [[
                                        "ec2.",
                                        "$payload.region",
                                        ".amazonaws.com"
                                    ]]
                                },
                                "x-amz-date": "$x-amz-date"
                            }
                        },
                        {
                            "accessKeyId": "$config.accessKeyId",
                            "secretAccessKey": "$config.secretAccessKey"
                        }
                    ]
                }
            },
            "description": "Amazon Web Services (AWS) infrastructure API configuration leveraging $security.signHmac and $concat primitives for request signature authorization.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e03",
            "name": "gcp",
            "type": "cloud",
            "provider": "gcp",
            "url": "https://compute.googleapis.com/compute/v1",
            "projectId": "",
            "clientEmail": "",
            "privateKey": "",
            "headers": {
                "Authorization": {
                    "$concat": [
                        "Bearer ",
                        {
                            "$security.generateJWT": [
                                {
                                    "header": { "alg": "RS256", "typ": "JWT" },
                                    "payload": {
                                        "iss": "$config.clientEmail",
                                        "sub": "$config.clientEmail",
                                        "aud": "https://oauth2.googleapis.com/token",
                                        "scope": "https://www.googleapis.com/auth/cloud-platform"
                                    }
                                },
                                "$config.privateKey",
                                "RS256"
                            ]
                        }
                    ]
                },
                "Content-Type": "application/json"
            },
            "description": "Google Cloud Platform (GCP) REST API integration using $security.generateJWT for OAuth 2.0 client assertion authorization.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e04",
            "name": "azure",
            "type": "cloud",
            "provider": "azure",
            "resourceGroup": "default-rg",
            "url": "https://management.azure.com",
            "subscriptionId": "",
            "accessToken": "",
            "headers": {
                "Authorization": {
                    "$concat": ["Bearer ", "$config.accessToken"]
                },
                "Content-Type": "application/json"
            },
            "description": "Microsoft Azure Resource Manager REST API utilizing standard Bearer token header resolution.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e05",
            "name": "digitalocean",
            "type": "cloud",
            "provider": "digitalocean",
            "url": "https://api.digitalocean.com/v2",
            "token": "",
            "headers": {
                "Authorization": {
                    "$concat": ["Bearer ", "$config.token"]
                },
                "Content-Type": "application/json"
            },
            "description": "DigitalOcean v2 REST API configuration for managing Droplets, Kubernetes, and cloud networking.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e06",
            "name": "oci",
            "type": "cloud",
            "provider": "oci",
            "url": "https://iaas.us-ashburn-1.oraclecloud.com/20160918",
            "tenancyId": "",
            "userId": "",
            "fingerprint": "",
            "privateKey": "",
            "compartmentId": "",
            "headers": {
                "Authorization": {
                    "$concat": [
                        "Signature algorithm=\"hmac-sha256\",headers=\"date (request-target) host\",signature=",
                        {
                            "$security.signHmac": [
                                {
                                    "$concat": [
                                        "$config.tenancyId",
                                        ":",
                                        "$config.userId",
                                        ":",
                                        "$config.fingerprint"
                                    ]
                                },
                                "$config.privateKey",
                                "sha256",
                                "base64"
                            ]
                        }
                    ]
                },
                "Content-Type": "application/json"
            },
            "description": "Oracle Cloud Infrastructure (OCI) Core Services API integration using $security.signHmac for signature header generation.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e07",
            "name": "hetzner",
            "type": "cloud",
            "provider": "hetzner",
            "url": "https://api.hetzner.cloud/v1",
            "token": "",
            "headers": {
                "Authorization": {
                    "$concat": ["Bearer ", "$config.token"]
                },
                "Content-Type": "application/json"
            },
            "description": "Hetzner Cloud v1 API pipeline for managing cloud server instances and network infrastructure.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e08",
            "name": "vultr",
            "type": "cloud",
            "provider": "vultr",
            "url": "https://api.vultr.com/v2",
            "apiKey": "",
            "headers": {
                "Authorization": {
                    "$concat": ["Bearer ", "$config.apiKey"]
                },
                "API-Key": "$config.apiKey",
                "Content-Type": "application/json"
            },
            "description": "Vultr Cloud Platform API v2. Utilizes both API-Key and standard Bearer token authorization headers.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e09",
            "name": "equinix",
            "type": "cloud",
            "provider": "equinix",
            "url": "https://api.equinix.com/metal/v1",
            "projectId": "",
            "token": "",
            "headers": {
                "X-Auth-Token": "$config.token",
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            "description": "Equinix Metal Bare Metal Cloud API v1 utilizing dedicated X-Auth-Token header authentication.",
            "enabled": true
        }
    ]
};
