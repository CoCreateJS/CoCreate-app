/**
 * Seeding Payload: apis collection
 * 
 * This payload is structured as an 'object.update' operation targeted at the 
 * CoCreate database router 'crud-server.js'. It inserts or updates connection profiles
 * for Stripe, Twilio, Postmark, and OpenAI.
 * 
 * Authentication headers are constructed dynamically using the JSON AST Engine 
 * ($concat, $btoa) referencing the secured "$key" value, completely bypassing 
 * hardcoded API format rules.
 */
export const seedApisPayload = {
  "method": "object.update",
  "array": "apis",
  "upsert": true,
  "object": [
    {
      "_id": "65f8ca227b39a3c1a8904dfe",
      "name": "stripe",
      "url": "https://api.stripe.com/v1",
<<<<<<< HEAD
      "key": "STRIPE_KEY_PLACEHOLDER",
=======
      "key": "",
>>>>>>> 8b674b9a (fix: clear API key placeholders in seedApisPayload)
      "headers": {
        "Authorization": { 
          "$concat": [ "Bearer ", "$key" ] 
        }
      },
      "description": "I've spent nearly two decades in the startup trenches, wearing every hat—from software engineering to sales and operations. That hands-on experience taught me the true cost of friction and complexity in the launch process. Now, I dedicate myself to distilling that knowledge into solutions. My mission is simple: to drastically reduce the time and effort required for aspiring entrepreneurs to create and successfully launch their startups.",
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
      "key": "",
      "headers": {
        "Authorization": { 
          "$concat": [ "Basic ", { "$btoa": "$key" } ] 
        },
        "Content-Type": "application/x-www-form-urlencoded"
      },
      "description": "Standard Twilio Communications API. Handles automated text-to-speech calls, real-time telephony, and transactional SMS messages. Uses AST URL encoding operators natively for zero-overhead form submittals.",
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
      "key": "",
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
      "key": "",
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
    }
  ]
};
