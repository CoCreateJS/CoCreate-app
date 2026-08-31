/**
 * Seeding Payload: webhooks collection
 *
 * Each webhook record is an executable AST configuration. The request stream
 * is consumed by the configuration itself, parsed into an event, processed,
 * and answered through the native response object.
 */
export default {
    "method": "object.update",
    "array": "webhooks",
    "upsert": true,
    "object": [
        {
            "_id": "65f8cb557b39a3c1a8904e20",
            "api_id": "65f8ca227b39a3c1a8904dfe", // Stripe API Provider Ref
            "path": "stripe/payments",
            "description": "Verifies Stripe webhook signatures and activates paid memberships after successful invoice payments.",
            "enabled": true,
            "chunks": [],
            "receive": {
                "$for": {
                    "$await": {
                        "$request": {
                            "chunk": {
                                "$chunks.push": "$chunk"
                            }
                        }
                    }
                }
            },
            "rawBody": {
                "$Buffer.concat": ["$chunks"]
            },
            "signatureParts": {
                "$header.stripe-signature.split": ","
            },
            "timestampParts": {
                "$signatureParts.0.split": "="
            },
            "expectedSignature": {
                "$security.createWebhookSignature": [
                    "$rawBody",
                    "$config.webhookSecret",
                    {
                        "timestamp": "$timestampParts.1",
                        "format": "stripe"
                    }
                ]
            },
            "authenticated": {
                "$security.timingSafeEqual": [
                    "$expectedSignature",
                    "$header.stripe-signature"
                ]
            },
            "process": {
                "$if": {
                    "$authenticated": {
                        "$eq": {
                            "true": {
                                "event": {
                                    "$JSON.parse": {
                                        "$rawBody.toString": []
                                    }
                                },
                                "action": {
                                    "$if": {
                                        "$event.type": {
                                            "$eq": {
                                                "invoice.payment_succeeded": {
                                                    "$crud.send": {
                                                        "method": "object.update",
                                                        "array": "users",
                                                        "object": [
                                                            {
                                                                "_id": "$event.data.object.metadata.user_id",
                                                                "status": "active_paid"
                                                            }
                                                        ]
                                                    }
                                                },
                                                "$else": null
                                            }
                                        }
                                    }
                                },
                                "status": {
                                    "$response.writeHead": [
                                        200,
                                        { "Content-Type": "application/json" }
                                    ]
                                },
                                "response": {
                                    "$response.end": "{\"received\":true}"
                                }
                            },
                            "$else": {
                                "status": {
                                    "$response.writeHead": [
                                        401,
                                        { "Content-Type": "application/json" }
                                    ]
                                },
                                "response": {
                                    "$response.end": "{\"error\":\"Invalid webhook signature\"}"
                                }
                            }
                        }
                    }
                }
            }
        },
        {
            "_id": "65f8cb557b39a3c1a8904e21",
            "api_id": "65f8ca227b39a3c1a8904dff", // Twilio API Provider Ref
            "path": "twilio/incoming-sms",
            "description": "Stores inbound Twilio SMS messages and responds with a TwiML acknowledgement.",
            "enabled": true,
            "chunks": [],
            "receive": {
                "$for": {
                    "$await": {
                        "$request": {
                            "chunk": {
                                "$chunks.push": "$chunk"
                            }
                        }
                    }
                }
            },
            "rawBody": {
                "$Buffer.concat": ["$chunks"]
            },
            "event": {
                "$searchParamsToObject": {
                    "$rawBody.toString": []
                }
            },
            "action": {
                "$crud.send": {
                    "method": "object.create",
                    "array": "chat_messages",
                    "object": [
                        {
                            "sender_phone": "$event.From",
                            "message_body": "$event.Body",
                            "received_at": {
                                "$Date.now": []
                            }
                        }
                    ]
                }
            },
            "status": {
                "$response.writeHead": [
                    200,
                    { "Content-Type": "application/xml; charset=utf-8" }
                ]
            },
            "response": {
                "$response.end": {
                    "$concat": [
                        "<Response>",
                        "<Message>",
                        "Hello! We successfully received your SMS. Support ticket is registered.",
                        "</Message>",
                        "</Response>"
                    ]
                }
            }
        }
    ]
};
