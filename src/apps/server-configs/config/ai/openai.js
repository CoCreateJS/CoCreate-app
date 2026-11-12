/** OpenAI Provider seed for servers_config. */
export default {
    "method": "object.update",
    "array": "servers_config",
    "upsert": true,
    "object": [
        {
            "_id": "65f8cb447b39a3c1a8904e43",
            "type": "ai",
            "provider": "openai",
            "name": "OpenAI Provider",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "providers.openai": {
                    "api": "openai",
                    "type": "openai",
                    "wireApi": "responses",
                    "models": {
                        "default": "gpt-5.6-terra",
                        "allowed": [
                            "gpt-5.6-terra",
                            "gpt-5.6-sol",
                            "gpt-5.6-luna",
                            "gpt-5.5",
                            "gpt-5.5-pro",
                            "gpt-5.4",
                            "gpt-5.4-pro",
                            "gpt-5.4-mini",
                            "gpt-5.4-nano",
                            "gpt-5.3-codex",
                            "gpt-5.2",
                            "gpt-5.2-pro",
                            "gpt-5.1",
                            "gpt-5-pro",
                            "gpt-5",
                            "gpt-5-mini",
                            "gpt-4.1"
                        ]
                    }
                }
            }
        }
    ]
};
