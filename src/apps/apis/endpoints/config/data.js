/**
 * Seeding Payload: endpoints collection
 * 
 * Maps structural configurations for outbound integrations targeted at the
 * Stripe, Twilio, Postmark, and OpenAI providers seeded in 'apis_payload.js'.
 */
export const seedEndpointsPayload = {
  "method": "object.update",
  "array": "endpoints",
  "upsert": true,
  "object": [
    {
      "_id": "65f8cb447b39a3c1a8904e10",
      "api_id": "65f8ca227b39a3c1a8904dfe", // Stripe API Provider Ref
      "endpoint": "POST /customers",
      "path": "/customers",
      "description": "Registers a customer account inside Stripe's CRM and billing ecosystem.",
      "status": "active",
      "created": {
        "on": "2026-07-12T07:40:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8cb447b39a3c1a8904e11",
      "api_id": "65f8ca227b39a3c1a8904dff", // Twilio API Provider Ref
      "endpoint": "POST /Accounts/ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/Messages.json",
      "path": "/Accounts/ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/Messages.json",
      "description": "Dispatches real-time transactional SMS notifications via the Twilio communications grid.",
      "status": "active",
      "created": {
        "on": "2026-07-12T07:41:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8cb447b39a3c1a8904e12",
      "api_id": "65f8ca227b39a3c1a8904e00", // Postmark API Provider Ref
      "endpoint": "POST /email",
      "path": "/email",
      "description": "Transmits high-delivery transactional user receipts and onboarding loops via Postmark SMTP.",
      "status": "active",
      "created": {
        "on": "2026-07-12T07:42:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    },
    {
      "_id": "65f8cb447b39a3c1a8904e13",
      "api_id": "65f8ca227b39a3c1a8904e01", // OpenAI API Provider Ref
      "endpoint": "POST /chat/completions",
      "path": "/chat/completions",
      "description": "Queries OpenAI conversational AI algorithms to perform content generation or AST evaluations.",
      "status": "active",
      "created": {
        "on": "2026-07-12T07:43:00.000Z",
        "by": "5ff747727005da1c272740ac"
      }
    }
  ]
};