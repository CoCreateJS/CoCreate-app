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

/**
 * Seeding Payload: apis collection
 *
 * Configures API keys, authentication methods, base URLs, headers, and default
 * provider metadata (project IDs, subscription IDs, account SIDs, image IDs) bound
 * to $config in AST execution contexts.
 */
const createTokenPricing = (models) => Object.entries(models).flatMap(
    ([model, rates]) => [
        ['input_tokens', rates.input],
        ['cache_read_tokens', rates.cached],
        ['cache_write_tokens', rates.cacheWrite],
        ['output_tokens', rates.output]
    ]
        .filter(([, amount]) => amount !== undefined)
        .map(([meter, amount]) => ({
            meter,
            model,
            unit: 1000000,
            amount: Math.round(amount * 1000000),
            currency: 'USD',
            precision: 6
        }))
);

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
            "_id": "65f8ca227b39a3c1a8904dfe",
            "name": "stripe",
            "provider": "stripe",
            "url": "https://api.stripe.com/v1",
            "key": "stripe_api_key_placeholder",
            "webhookSecret": "stripe_webhook_signing_secret_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": ["Bearer ", "$key"]
                }
            },
            "description": "Stripe payment gateway API integration utilizing dynamic bearer authorization header resolution.",
            "enabled": true
        },

        {
            "_id": "65f8ca227b39a3c1a8904dff",
            "name": "twilio",
            "provider": "twilio",
            "accountSid": "twilio_account_sid_placeholder",
            "url": "https://api.twilio.com/2010-04-01",
            "key": "twilio_account_sid_placeholder:twilio_auth_token_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": ["Basic ", { "$security.base64Encode": "$key" }]
                },
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "description": "Standard Twilio Communications API. Handles automated text-to-speech calls, real-time telephony, and transactional SMS messages. Leverages $security.base64Encode AST directive for Basic authentication.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e00",
            "name": "postmark",
            "provider": "postmark",
            "url": "https://api.postmarkapp.com",
            "key": "postmark_server_token_placeholder",
            "headers": {
                "X-Postmark-Server-Token": "$key",
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            "description": "Postmark transactional email pipeline configuration. Built to handle secure email transmissions with zero hardcoded authentication dependencies.",
            "enabled": true
        },

        {
            "_id": "65f8ca227b39a3c1a8904e01",
            "name": "openai",
            "provider": "openai",
            "url": "https://api.openai.com/v1",
            "headers": {
                "Authorization": {
                    "$concat": ["Bearer ", "$key"]
                },
                "Content-Type": "application/json"
            },
            "description": "OpenAI LLM Integration Pipeline. Powers intelligent content completion, conversational agents, vector searches, and structured JSON parsing engines directly within our multi-tenant microservices.",
            "pricing": createTokenPricing({
                "gpt-5.6-terra": { "input": 2, "cached": 0.2, "cacheWrite": 2.5, "output": 12 },
                "gpt-5.6-sol": { "input": 4, "cached": 0.4, "cacheWrite": 5, "output": 20 },
                "gpt-5.6-luna": { "input": 0.2, "cached": 0.02, "cacheWrite": 0.25, "output": 1.2 },
                "gpt-5.5": { "input": 5, "cached": 0.5, "output": 30 },
                "gpt-5.5-pro": { "input": 30, "output": 180 },
                "gpt-5.4": { "input": 2.5, "cached": 0.25, "output": 15 },
                "gpt-5.4-pro": { "input": 30, "output": 180 },
                "gpt-5.4-mini": { "input": 0.75, "cached": 0.075, "output": 4.5 },
                "gpt-5.4-nano": { "input": 0.2, "cached": 0.02, "output": 1.25 },
                "gpt-5.3-codex": { "input": 1.75, "cached": 0.175, "output": 14 },
                "gpt-5.2": { "input": 1.75, "cached": 0.175, "output": 14 },
                "gpt-5.2-pro": { "input": 21, "output": 168 },
                "gpt-5.1": { "input": 1.25, "cached": 0.125, "output": 10 },
                "gpt-5-pro": { "input": 15, "output": 120 },
                "gpt-5": { "input": 1.25, "cached": 0.125, "output": 10 },
                "gpt-5-mini": { "input": 0.25, "cached": 0.025, "output": 2 },
                "gpt-4.1": { "input": 2, "cached": 0.5, "output": 8 }
            }),
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e0f",
            "name": "gemini",
            "provider": "gemini",
            "url": "https://generativelanguage.googleapis.com/v1beta/openai",
            "key": "gemini_api_key_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": ["Bearer ", "$key"]
                },
                "Content-Type": "application/json"
            },
            "description": "Google Gemini integration through its OpenAI-compatible API endpoint.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e10",
            "name": "copilot",
            "provider": "copilot",
            "key": "github_copilot_token_placeholder",
            "description": "GitHub Copilot SDK authentication. The key is supplied directly to CopilotClient as its GitHub token.",
            "pricing": createTokenPricing({
                "gpt-5-mini": {
                    "input": 0.25,
                    "cached": 0.025,
                    "output": 2
                }
            }),
            "enabled": true
        },

        {
            "_id": "65f8ca227b39a3c1a8904e02",
            "name": "aws",
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
        },

        {
            "_id": "65f8ca227b39a3c1a8904e0a",
            "name": "google",
            "provider": "google",
            "url": "https://oauth2.googleapis.com",
            "key": "google_client_id_placeholder:google_client_secret_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": ["Basic ", { "$security.base64Encode": "$key" }]
                },
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "description": "Google Identity & OAuth 2.0 OpenID Connect authentication pipeline. Uses HTTP Basic Auth ($security.base64Encode) with client_id:client_secret for client authentication.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e0b",
            "name": "microsoft",
            "provider": "microsoft",
            "url": "https://login.microsoftonline.com/common/oauth2/v2.0",
            "key": "microsoft_client_id_placeholder:microsoft_client_secret_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": ["Basic ", { "$security.base64Encode": "$key" }]
                },
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "description": "Microsoft Identity Platform & Entra ID OAuth 2.0 / OIDC pipeline. Uses HTTP Basic Auth ($security.base64Encode) with client_id:client_secret for client authentication.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e0c",
            "name": "apple",
            "provider": "apple",
            "url": "https://appleid.apple.com/auth",
            "key": "apple_private_key_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": [
                        "Bearer ",
                        {
                            "$security.generateJWT": {
                                "header": { "alg": "ES256", "typ": "JWT" },
                                "payload": {
                                    "iss": "apple_team_id_placeholder",
                                    "sub": "apple_client_id_placeholder",
                                    "aud": "https://appleid.apple.com"
                                }
                            }
                        }
                    ]
                },
                "Content-Type": "application/x-www-form-urlencoded"
            },
            "description": "Sign in with Apple OAuth 2.0 & OpenID Connect identity verification pipeline. Utilizes $security.generateJWT to create client assertion tokens.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e0d",
            "name": "facebook",
            "provider": "facebook",
            "url": "https://graph.facebook.com/v19.0",
            "key": "facebook_app_id_placeholder:facebook_app_secret_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": ["Basic ", { "$security.base64Encode": "$key" }]
                },
                "Content-Type": "application/json"
            },
            "description": "Facebook Login OAuth 2.0 authentication service. Uses HTTP Basic Auth ($security.base64Encode) with app_id:app_secret for client authentication.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e0e",
            "name": "github",
            "provider": "github",
            "url": "https://github.com/login/oauth",
            "key": "github_client_id_placeholder:github_client_secret_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": ["Basic ", { "$security.base64Encode": "$key" }]
                },
                "Accept": "application/json"
            },
            "description": "GitHub OAuth 2.0 web authentication pipeline. Uses HTTP Basic Auth ($security.base64Encode) with client_id:client_secret for client authentication.",
            "enabled": true
        }
    ]
};
