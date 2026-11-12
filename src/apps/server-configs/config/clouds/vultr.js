/** Vultr Cloud Platform cloud catalog for servers_config. */
export default {
    "method": "object.update",
    "array": "servers_config",
    "upsert": true,
    "object": [
        {
            "_id": "61abf7aa5def8b83b303e707",
            "type": "clouds",
            "provider": "vultr",
            "name": "Vultr Cloud Platform",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "vultr": {
                    "instances": [
                        {
                            "name": "vc2-1c-2gb",
                            "vCPU": 1,
                            "memoryGb": 2,
                            "default": true
                        },
                        {
                            "name": "vc2-2c-8gb",
                            "vCPU": 2,
                            "memoryGb": 8
                        },
                        {
                            "name": "vc2-4c-16gb",
                            "vCPU": 4,
                            "memoryGb": 16
                        },
                        {
                            "name": "vc2-8c-32gb",
                            "vCPU": 8,
                            "memoryGb": 32
                        },
                        {
                            "name": "vc2-16c-64gb",
                            "vCPU": 16,
                            "memoryGb": 64
                        },
                        {
                            "name": "vc2-32c-128gb",
                            "vCPU": 32,
                            "memoryGb": 128
                        },
                        {
                            "name": "vc2-64c-256gb",
                            "vCPU": 64,
                            "memoryGb": 256
                        }
                    ],
                    "regions": [
                        {
                            "region": "ewr",
                            "name": "New Jersey",
                            "country": "US",
                            "lat": 40.7128,
                            "lng": -74.006
                        },
                        {
                            "region": "ord",
                            "name": "Chicago",
                            "country": "US",
                            "lat": 41.8781,
                            "lng": -87.6298
                        },
                        {
                            "region": "dfw",
                            "name": "Dallas",
                            "country": "US",
                            "lat": 32.7767,
                            "lng": -96.797
                        },
                        {
                            "region": "sea",
                            "name": "Seattle",
                            "country": "US",
                            "lat": 47.6062,
                            "lng": -122.3321
                        },
                        {
                            "region": "lax",
                            "name": "Los Angeles",
                            "country": "US",
                            "lat": 34.0522,
                            "lng": -118.2437
                        },
                        {
                            "region": "atl",
                            "name": "Atlanta",
                            "country": "US",
                            "lat": 33.749,
                            "lng": -84.388
                        },
                        {
                            "region": "mia",
                            "name": "Miami",
                            "country": "US",
                            "lat": 25.7617,
                            "lng": -80.1918
                        },
                        {
                            "region": "sjc",
                            "name": "Silicon Valley",
                            "country": "US",
                            "lat": 37.3382,
                            "lng": -121.8863
                        },
                        {
                            "region": "yto",
                            "name": "Toronto",
                            "country": "CA",
                            "lat": 43.6532,
                            "lng": -79.3832
                        },
                        {
                            "region": "sao",
                            "name": "São Paulo",
                            "country": "BR",
                            "lat": -23.5505,
                            "lng": -46.6333
                        },
                        {
                            "region": "ams",
                            "name": "Amsterdam",
                            "country": "NL",
                            "lat": 52.3676,
                            "lng": 4.9041
                        },
                        {
                            "region": "fra",
                            "name": "Frankfurt",
                            "country": "DE",
                            "lat": 50.1109,
                            "lng": 8.6821
                        },
                        {
                            "region": "lhr",
                            "name": "London",
                            "country": "GB",
                            "lat": 51.5074,
                            "lng": -0.1278
                        },
                        {
                            "region": "par",
                            "name": "Paris",
                            "country": "FR",
                            "lat": 48.8566,
                            "lng": 2.3522
                        },
                        {
                            "region": "sgp",
                            "name": "Singapore",
                            "country": "SG",
                            "lat": 1.3521,
                            "lng": 103.8198
                        },
                        {
                            "region": "nrt",
                            "name": "Tokyo",
                            "country": "JP",
                            "lat": 35.6762,
                            "lng": 139.6503
                        },
                        {
                            "region": "icn",
                            "name": "Seoul",
                            "country": "KR",
                            "lat": 37.5665,
                            "lng": 126.978
                        },
                        {
                            "region": "syd",
                            "name": "Sydney",
                            "country": "AU",
                            "lat": -33.8688,
                            "lng": 151.2093
                        },
                        {
                            "region": "mel",
                            "name": "Melbourne",
                            "country": "AU",
                            "lat": -37.8136,
                            "lng": 144.9631
                        },
                        {
                            "region": "blr",
                            "name": "Bangalore",
                            "country": "IN",
                            "lat": 12.9716,
                            "lng": 77.5946
                        },
                        {
                            "region": "jnb",
                            "name": "Johannesburg",
                            "country": "ZA",
                            "lat": -26.2041,
                            "lng": 28.0473
                        }
                    ]
                }
            }
        }
    ]
};
