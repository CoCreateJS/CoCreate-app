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
export const seedApisPayload = {
    "method": "object.update",
    "array": "apis",
    "upsert": true,
    "object": [
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
            "model": "gpt-4o",
            "url": "https://api.openai.com/v1",
            "key": "openai_api_key_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": ["Bearer ", "$key"]
                }
            },
            "description": "OpenAI LLM Integration Pipeline. Powers intelligent content completion, conversational agents, vector searches, and structured JSON parsing engines directly within our multi-tenant microservices.",
            "enabled": true
        },

        {
            "_id": "65f8ca227b39a3c1a8904e02",
            "name": "aws",
            "provider": "aws",
            "url": "https://amazonaws.com",
            "key": "aws_access_key_id_placeholder:aws_secret_access_key_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": [
                        "AWS4-HMAC-SHA256 Credential=",
                        "$key",
                        ", Signature=",
                        {
                            "$security.signHmac": {
                                "payload": "$key",
                                "secret": "$key",
                                "algorithm": "sha256",
                                "digest": "hex"
                            }
                        }
                    ]
                },
                "Content-Type": "application/x-amz-json-1.1"
            },
            "description": "Amazon Web Services (AWS) infrastructure API configuration leveraging $security.signHmac and $concat primitives for request signature authorization.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e03",
            "name": "gcp",
            "provider": "gcp",
            "project": "gcp_project_id_placeholder",
            "url": "https://compute.googleapis.com/compute/v1",
            "key": "gcp_service_account_private_key_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": [
                        "Bearer ",
                        {
                            "$security.generateJWT": {
                                "header": { "alg": "RS256", "typ": "JWT" },
                                "payload": {
                                    "iss": "gcp-service-account@project.iam.gserviceaccount.com",
                                    "sub": "gcp-service-account@project.iam.gserviceaccount.com",
                                    "aud": "https://oauth2.googleapis.com/token",
                                    "scope": "https://www.googleapis.com/auth/cloud-platform"
                                }
                            }
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
            "subscriptionId": "azure_subscription_id_placeholder",
            "resourceGroup": "default-rg",
            "url": "https://management.azure.com",
            "key": "azure_bearer_token_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": ["Bearer ", "$key"]
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
            "key": "digitalocean_personal_access_token_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": ["Bearer ", "$key"]
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
            "compartmentId": "oci_compartment_id_placeholder",
            "url": "https://iaas.us-ashburn-1.oraclecloud.com/20160918",
            "key": "oci_tenancy_ocid:oci_user_ocid:oci_key_fingerprint:oci_private_key",
            "headers": {
                "Authorization": {
                    "$concat": [
                        "Signature algorithm=\"hmac-sha256\",headers=\"date (request-target) host\",signature=",
                        {
                            "$security.signHmac": {
                                "payload": "$key",
                                "secret": "$key",
                                "algorithm": "sha256",
                                "digest": "base64"
                            }
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
            "key": "hetzner_api_token_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": ["Bearer ", "$key"]
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
            "key": "vultr_api_key_placeholder",
            "headers": {
                "Authorization": {
                    "$concat": ["Bearer ", "$key"]
                },
                "API-Key": "$key",
                "Content-Type": "application/json"
            },
            "description": "Vultr Cloud Platform API v2. Utilizes both API-Key and standard Bearer token authorization headers.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e09",
            "name": "equinix",
            "provider": "equinix",
            "projectId": "equinix_project_id_placeholder",
            "url": "https://api.equinix.com/metal/v1",
            "key": "equinix_user_api_token_placeholder",
            "headers": {
                "X-Auth-Token": "$key",
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

export default seedApisPayload;
