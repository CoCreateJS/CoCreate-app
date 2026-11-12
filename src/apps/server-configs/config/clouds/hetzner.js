/** Hetzner Cloud cloud catalog for servers_config. */
export default {
    "method": "object.update",
    "array": "servers_config",
    "upsert": true,
    "object": [
        {
            "_id": "56e09706a7e277f02e0dd6b6",
            "type": "clouds",
            "provider": "hetzner",
            "name": "Hetzner Cloud",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "hetzner": {
                    "instances": [
                        {
                            "name": "cx11",
                            "vCPU": 1,
                            "memoryGb": 2,
                            "default": true
                        },
                        {
                            "name": "cx22",
                            "vCPU": 2,
                            "memoryGb": 8
                        },
                        {
                            "name": "cx32",
                            "vCPU": 4,
                            "memoryGb": 16
                        },
                        {
                            "name": "cx42",
                            "vCPU": 8,
                            "memoryGb": 32
                        },
                        {
                            "name": "cx52",
                            "vCPU": 16,
                            "memoryGb": 64
                        },
                        {
                            "name": "ccx43",
                            "vCPU": 32,
                            "memoryGb": 128
                        },
                        {
                            "name": "ccx63",
                            "vCPU": 64,
                            "memoryGb": 256
                        }
                    ],
                    "regions": [
                        {
                            "region": "fsn1",
                            "name": "Falkenstein",
                            "country": "DE",
                            "lat": 50.4779,
                            "lng": 12.3713
                        },
                        {
                            "region": "nbg1",
                            "name": "Nuremberg",
                            "country": "DE",
                            "lat": 49.4521,
                            "lng": 11.0767
                        },
                        {
                            "region": "hel1",
                            "name": "Helsinki",
                            "country": "FI",
                            "lat": 60.1699,
                            "lng": 24.9384
                        },
                        {
                            "region": "ash",
                            "name": "Ashburn",
                            "country": "US",
                            "lat": 39.0438,
                            "lng": -77.4874
                        },
                        {
                            "region": "hil",
                            "name": "Hillsboro",
                            "country": "US",
                            "lat": 45.5229,
                            "lng": -122.9898
                        },
                        {
                            "region": "sin",
                            "name": "Singapore",
                            "country": "SG",
                            "lat": 1.3521,
                            "lng": 103.8198
                        }
                    ]
                }
            }
        }
    ]
};
