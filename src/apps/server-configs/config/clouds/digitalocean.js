/** DigitalOcean Cloud cloud catalog for servers_config. */
export default {
    "method": "object.update",
    "array": "servers_config",
    "upsert": true,
    "object": [
        {
            "_id": "e7700ca98137839c0870ea00",
            "type": "clouds",
            "provider": "digitalocean",
            "name": "DigitalOcean Cloud",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "digitalocean": {
                    "instances": [
                        {
                            "name": "s-1vcpu-2gb",
                            "vCPU": 1,
                            "memoryGb": 2,
                            "default": true
                        },
                        {
                            "name": "s-2vcpu-8gb",
                            "vCPU": 2,
                            "memoryGb": 8
                        },
                        {
                            "name": "s-4vcpu-16gb",
                            "vCPU": 4,
                            "memoryGb": 16
                        },
                        {
                            "name": "s-8vcpu-32gb",
                            "vCPU": 8,
                            "memoryGb": 32
                        },
                        {
                            "name": "s-16vcpu-64gb",
                            "vCPU": 16,
                            "memoryGb": 64
                        },
                        {
                            "name": "s-32vcpu-128gb",
                            "vCPU": 32,
                            "memoryGb": 128
                        },
                        {
                            "name": "s-64vcpu-256gb",
                            "vCPU": 64,
                            "memoryGb": 256
                        }
                    ],
                    "regions": [
                        {
                            "region": "nyc1",
                            "name": "New York 1",
                            "country": "US",
                            "lat": 40.7128,
                            "lng": -74.006
                        },
                        {
                            "region": "nyc3",
                            "name": "New York 3",
                            "country": "US",
                            "lat": 40.7128,
                            "lng": -74.006
                        },
                        {
                            "region": "sfo3",
                            "name": "San Francisco",
                            "country": "US",
                            "lat": 37.7749,
                            "lng": -122.4194
                        },
                        {
                            "region": "ams3",
                            "name": "Amsterdam",
                            "country": "NL",
                            "lat": 52.3676,
                            "lng": 4.9041
                        },
                        {
                            "region": "sgp1",
                            "name": "Singapore",
                            "country": "SG",
                            "lat": 1.3521,
                            "lng": 103.8198
                        },
                        {
                            "region": "lon1",
                            "name": "London",
                            "country": "GB",
                            "lat": 51.5074,
                            "lng": -0.1278
                        },
                        {
                            "region": "fra1",
                            "name": "Frankfurt",
                            "country": "DE",
                            "lat": 50.1109,
                            "lng": 8.6821
                        },
                        {
                            "region": "tor1",
                            "name": "Toronto",
                            "country": "CA",
                            "lat": 43.6532,
                            "lng": -79.3832
                        },
                        {
                            "region": "blr1",
                            "name": "Bangalore",
                            "country": "IN",
                            "lat": 12.9716,
                            "lng": 77.5946
                        },
                        {
                            "region": "syd1",
                            "name": "Sydney",
                            "country": "AU",
                            "lat": -33.8688,
                            "lng": 151.2093
                        }
                    ]
                }
            }
        }
    ]
};
