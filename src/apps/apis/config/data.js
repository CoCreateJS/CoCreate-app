/********************************************************************************
 * Copyright (C) 2023-2026 CoCreate and Contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 ********************************************************************************/

export const seedApisPayload = {
  "method": "object.update",
  "array": "apis",
  "upsert": true,
  "object": [
    {
      "_id": "65f8ca227b39a3c1a8904dfe",
      "name": "stripe",
      "url": "https://api.stripe.com/v1",
      "key": "stripe_api_key_placeholder",
      "headers": {
        "Authorization": { 
          "$concat": [ "Bearer ", "$key" ] 
        }
      },
      "description": "Stripe payment gateway API integration utilizing dynamic bearer authorization header resolution.",
      "status": "active",
      "created": {
        "on": "2025-09-03T07:39:23.058Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2025-10-04T01:28:37.166Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904dff",
      "name": "twilio",
      "url": "https://api.twilio.com/2010-04-01",
      "key": "twilio_account_sid_placeholder:twilio_auth_token_placeholder",
      "headers": {
        "Authorization": { 
          "$concat": [ "Basic ", { "$security.base64Encode": "$key" } ] 
        },
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "description": "Standard Twilio Communications API. Handles automated text-to-speech calls, real-time telephony, and transactional SMS messages. Leverages $security.base64Encode AST directive for Basic authentication.",
      "status": "active",
      "created": {
        "on": "2025-09-03T07:39:23.058Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2025-10-04T01:28:37.166Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e00",
      "name": "postmark",
      "url": "https://api.postmarkapp.com",
      "key": "postmark_server_token_placeholder",
      "headers": {
        "X-Postmark-Server-Token": "$key",
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      "description": "Postmark transactional email pipeline configuration. Built to handle secure email transmissions with zero hardcoded authentication dependencies.",
      "status": "active",
      "created": {
        "on": "2025-09-03T07:39:23.058Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2025-10-04T01:28:37.166Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e01",
      "name": "openai",
      "url": "https://api.openai.com/v1",
      "key": "openai_api_key_placeholder",
      "headers": {
        "Authorization": { 
          "$concat": [ "Bearer ", "$key" ] 
        }
      },
      "description": "OpenAI LLM Integration Pipeline. Powers intelligent content completion, conversational agents, vector searches, and structured JSON parsing engines directly within our multi-tenant microservices.",
      "status": "active",
      "created": {
        "on": "2025-09-03T07:39:23.058Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2025-10-04T01:28:37.166Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e02",
      "name": "aws",
      "url": "https://amazonaws.com",
      "key": "aws_access_key_id_placeholder:aws_secret_access_key_placeholder",
      "headers": {
        "Authorization": {
          "$security.createAwsSigV4Token": "$key"
        },
        "Content-Type": "application/x-amz-json-1.1"
      },
      "description": "Amazon Web Services (AWS) infrastructure API configuration leveraging dynamic SigV4 signature calculation for secure request authorization.",
      "status": "active",
      "created": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e03",
      "name": "gcp",
      "url": "https://compute.googleapis.com/compute/v1",
      "key": "gcp_service_account_token_placeholder",
      "headers": {
        "Authorization": {
          "$concat": [ "Bearer ", "$key" ]
        },
        "Content-Type": "application/json"
      },
      "description": "Google Cloud Platform (GCP) REST API integration using OAuth 2.0 Bearer authorization headers.",
      "status": "active",
      "created": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e04",
      "name": "azure",
      "url": "https://management.azure.com",
      "key": "azure_bearer_token_placeholder",
      "headers": {
        "Authorization": {
          "$concat": [ "Bearer ", "$key" ]
        },
        "Content-Type": "application/json"
      },
      "description": "Microsoft Azure Resource Manager REST API utilizing standard Bearer token header resolution.",
      "status": "active",
      "created": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e05",
      "name": "digitalocean",
      "url": "https://api.digitalocean.com/v2",
      "key": "digitalocean_personal_access_token_placeholder",
      "headers": {
        "Authorization": {
          "$concat": [ "Bearer ", "$key" ]
        },
        "Content-Type": "application/json"
      },
      "description": "DigitalOcean v2 REST API configuration for managing Droplets, Kubernetes, and cloud networking.",
      "status": "active",
      "created": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e06",
      "name": "oci",
      "url": "https://iaas.us-ashburn-1.oraclecloud.com/20160918",
      "key": "oci_api_key_placeholder",
      "headers": {
        "Authorization": {
          "$concat": [ "Bearer ", "$key" ]
        },
        "Content-Type": "application/json"
      },
      "description": "Oracle Cloud Infrastructure (OCI) Core Services API integration using dynamic Bearer authorization headers.",
      "status": "active",
      "created": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e07",
      "name": "hetzner",
      "url": "https://api.hetzner.cloud/v1",
      "key": "hetzner_api_token_placeholder",
      "headers": {
        "Authorization": {
          "$concat": [ "Bearer ", "$key" ]
        },
        "Content-Type": "application/json"
      },
      "description": "Hetzner Cloud v1 API pipeline for managing cloud server instances and network infrastructure.",
      "status": "active",
      "created": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e08",
      "name": "vultr",
      "url": "https://api.vultr.com/v2",
      "key": "vultr_api_key_placeholder",
      "headers": {
        "Authorization": {
          "$concat": [ "Bearer ", "$key" ]
        },
        "API-Key": "$key",
        "Content-Type": "application/json"
      },
      "description": "Vultr Cloud Platform API v2. Utilizes both API-Key and standard Bearer token authorization headers.",
      "status": "active",
      "created": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e09",
      "name": "equinix",
      "url": "https://api.equinix.com/metal/v1",
      "key": "equinix_user_api_token_placeholder",
      "headers": {
        "X-Auth-Token": "$key",
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      "description": "Equinix Metal Bare Metal Cloud API v1 utilizing dedicated X-Auth-Token header authentication.",
      "status": "active",
      "created": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e0a",
      "name": "google",
      "url": "https://oauth2.googleapis.com",
      "key": "google_client_id_placeholder:google_client_secret_placeholder",
      "headers": {
        "Authorization": {
          "$concat": [ "Bearer ", "$key" ]
        },
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "description": "Google Identity & OAuth 2.0 OpenID Connect authentication pipeline for client-facing SSO sign-in and ID token verification.",
      "status": "active",
      "created": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e0b",
      "name": "microsoft",
      "url": "https://login.microsoftonline.com/common/oauth2/v2.0",
      "key": "microsoft_client_id_placeholder:microsoft_client_secret_placeholder",
      "headers": {
        "Authorization": {
          "$concat": [ "Bearer ", "$key" ]
        },
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "description": "Microsoft Identity Platform & Entra ID OAuth 2.0 / OIDC authentication pipeline for client-facing SSO and profile access.",
      "status": "active",
      "created": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e0c",
      "name": "apple",
      "url": "https://appleid.apple.com/auth",
      "key": "apple_client_id_placeholder:apple_client_secret_placeholder",
      "headers": {
        "Authorization": {
          "$concat": [ "Bearer ", "$key" ]
        },
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "description": "Sign in with Apple OAuth 2.0 & OpenID Connect identity verification pipeline for client mobile and web authentication.",
      "status": "active",
      "created": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e0d",
      "name": "facebook",
      "url": "https://graph.facebook.com/v19.0",
      "key": "facebook_app_id_placeholder:facebook_app_secret_placeholder",
      "headers": {
        "Authorization": {
          "$concat": [ "Bearer ", "$key" ]
        },
        "Content-Type": "application/json"
      },
      "description": "Facebook Login OAuth 2.0 authentication service for user identity verification and profile metadata retrieval.",
      "status": "active",
      "created": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8ca227b39a3c1a8904e0e",
      "name": "github",
      "url": "https://github.com/login/oauth",
      "key": "github_client_id_placeholder:github_client_secret_placeholder",
      "headers": {
        "Authorization": {
          "$concat": [ "Bearer ", "$key" ]
        },
        "Accept": "application/json"
      },
      "description": "GitHub OAuth 2.0 web authentication pipeline for client sign-in and user profile resolution.",
      "status": "active",
      "created": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      },
      "modified": {
        "on": "2026-08-01T12:00:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    }
  ]
};

export default seedApisPayload;