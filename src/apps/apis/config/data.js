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

/** Seeding payload: payments, communications, and authentication API providers. */

export default {
    "method": "object.update",
    "array": "apis",
    "upsert": true,
    "object": [
        {
            "_id": "65f8ca227b39a3c1a8904dfe",
            "name": "stripe",
            "type": "payments",
            "provider": "stripe",
            "url": "https://api.stripe.com/v1",
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
            "type": "communications",
            "provider": "twilio",
            "url": "https://api.twilio.com/2010-04-01",
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
            "type": "communications",
            "provider": "postmark",
            "url": "https://api.postmarkapp.com",
            "headers": {
                "X-Postmark-Server-Token": "$key",
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            "description": "Postmark transactional email pipeline configuration. Built to handle secure email transmissions with zero hardcoded authentication dependencies.",
            "enabled": true
        },
        {
            "_id": "65f8ca227b39a3c1a8904e0a",
            "name": "google",
            "type": "authentication",
            "provider": "google",
            "url": "https://oauth2.googleapis.com",
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
            "type": "authentication",
            "provider": "microsoft",
            "url": "https://login.microsoftonline.com/common/oauth2/v2.0",
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
            "type": "authentication",
            "provider": "apple",
            "url": "https://appleid.apple.com/auth",
            "headers": {
                "Authorization": {
                    "$concat": [
                        "Bearer ",
                        {
                            "$security.generateJWT": {
                                "header": { "alg": "ES256", "typ": "JWT" },
                                "payload": {
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
            "type": "authentication",
            "provider": "facebook",
            "url": "https://graph.facebook.com/v19.0",
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
            "type": "authentication",
            "provider": "github",
            "url": "https://github.com/login/oauth",
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
