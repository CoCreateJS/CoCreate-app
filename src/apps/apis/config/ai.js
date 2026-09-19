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

/** Seeding payload: ai API providers. */
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
            "_id": "a7af5e215d58d8fda0c6759e",
            "name": "Claude",
            "type": "ai",
            "provider": "anthropic",
            "url": "https://api.anthropic.com/v1",
            "headers": {
                "x-api-key": "$key",
                "anthropic-version": "2023-06-01",
                "Content-Type": "application/json"
            },
            "description": "Anthropic Claude API connection.",
            "enabled": false
        },
        {
            "_id": "65f8ca227b39a3c1a8904e01",
            "name": "openai",
            "type": "ai",
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
            "type": "ai",
            "provider": "gemini",
            "url": "https://generativelanguage.googleapis.com/v1beta/openai",
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
            "type": "ai",
            "provider": "copilot",
            "description": "GitHub Copilot SDK authentication. The key is supplied directly to CopilotClient as its GitHub token.",
            "pricing": createTokenPricing({
                "gpt-5-mini": {
                    "input": 0.25,
                    "cached": 0.025,
                    "output": 2
                }
            }),
            "enabled": true
        }
    ]
};
