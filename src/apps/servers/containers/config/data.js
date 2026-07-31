/**
 * Seeding Payload: webhooks collection
 * 
 * Maps inbound webhook configurations targeted at Stripe and Twilio providers.
 * Outbound responses rely entirely on native Node stream execution (res.writableEnded),
 * completely bypassing proprietary "defer" parameters.
 */
export const seedWebhooksPayload = {
  "method": "object.update",
  "array": "webhooks",
  "upsert": true,
  "object": [
    {
      "_id": "65f8cb557b39a3c1a8904e20",
      "api_id": "65f8ca227b39a3c1a8904dfe", // Stripe API Provider Ref
      "path": "stripe/payments",
      "action": "$event.type",
      "authenticate": {
        "method": "webhooks.constructEvent",
        "parameters": [
          "$rawBody",
          "$header.stripe-signature",
          "whsec_StripeSigningSecretABC123"
        ]
      },
      "actions": {
        "invoice.payment_succeeded": [
          {
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
          }
        ]
      },
      "description": "Stripe Payments Webhook Receiver. Automatically verifies incoming webhook HMAC signatures and updates active membership plans.",
      "status": "active",
      "created": {
        "on": "2026-07-12T07:50:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8cb557b39a3c1a8904e21",
      "api_id": "65f8ca227b39a3c1a8904dff", // Twilio API Provider Ref
      "path": "twilio/incoming-sms",
      "action": "sms_received",
      "authenticate": null,
      "actions": {
        "sms_received": [
          {
            "$crud.send": {
              "method": "object.create",
              "array": "chat_messages",
              "object": [
                {
                  "sender_phone": "$event.From",
                  "message_body": "$event.Body",
                  "received_at": "$Date.now"
                }
              ]
            }
          },
          {
            "$response.writeHead": [
              200,
              { "Content-Type": "application/xml; charset=utf-8" }
            ]
          },
          {
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
        ]
      },
      "description": "Twilio Inbound SMS webhook interface. Captures incoming messages into local database queues and responds to Twilio using native TwiML XML blocks.",
      "status": "active",
      "created": {
        "on": "2026-07-12T07:55:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    }
  ]
};