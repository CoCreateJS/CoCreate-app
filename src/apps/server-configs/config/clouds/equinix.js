/** Equinix Metal cloud catalog for servers_config. */
export default {
    "method": "object.update",
    "array": "servers_config",
    "upsert": true,
    "object": [
        {
            "_id": "6edb1f6b700209d4baeef0cb",
            "type": "clouds",
            "provider": "equinix",
            "name": "Equinix Metal",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "equinix": {
                    "instances": [
                        {
                            "name": "c3.small.x86",
                            "vCPU": 1,
                            "memoryGb": 2,
                            "default": true
                        },
                        {
                            "name": "c3.medium.x86",
                            "vCPU": 2,
                            "memoryGb": 8
                        },
                        {
                            "name": "c3.large.x86",
                            "vCPU": 4,
                            "memoryGb": 16
                        },
                        {
                            "name": "c3.xlarge.x86",
                            "vCPU": 8,
                            "memoryGb": 32
                        },
                        {
                            "name": "m3.large.x86",
                            "vCPU": 16,
                            "memoryGb": 64
                        },
                        {
                            "name": "m3.xlarge.x86",
                            "vCPU": 32,
                            "memoryGb": 128
                        },
                        {
                            "name": "n3.xlarge.x86",
                            "vCPU": 64,
                            "memoryGb": 256
                        }
                    ],
                    "regions": [
                        {
                            "region": "da",
                            "name": "Dallas",
                            "country": "US",
                            "lat": 32.7767,
                            "lng": -96.797
                        },
                        {
                            "region": "ny",
                            "name": "New York",
                            "country": "US",
                            "lat": 40.7128,
                            "lng": -74.006
                        },
                        {
                            "region": "sv",
                            "name": "Silicon Valley",
                            "country": "US",
                            "lat": 37.3382,
                            "lng": -121.8863
                        },
                        {
                            "region": "ch",
                            "name": "Chicago",
                            "country": "US",
                            "lat": 41.8781,
                            "lng": -87.6298
                        },
                        {
                            "region": "la",
                            "name": "Los Angeles",
                            "country": "US",
                            "lat": 34.0522,
                            "lng": -118.2437
                        },
                        {
                            "region": "se",
                            "name": "Seattle",
                            "country": "US",
                            "lat": 47.6062,
                            "lng": -122.3321
                        },
                        {
                            "region": "at",
                            "name": "Atlanta",
                            "country": "US",
                            "lat": 33.749,
                            "lng": -84.388
                        },
                        {
                            "region": "tr",
                            "name": "Toronto",
                            "country": "CA",
                            "lat": 43.6532,
                            "lng": -79.3832
                        },
                        {
                            "region": "sp",
                            "name": "São Paulo",
                            "country": "BR",
                            "lat": -23.5505,
                            "lng": -46.6333
                        },
                        {
                            "region": "fr",
                            "name": "Frankfurt",
                            "country": "DE",
                            "lat": 50.1109,
                            "lng": 8.6821
                        },
                        {
                            "region": "am",
                            "name": "Amsterdam",
                            "country": "NL",
                            "lat": 52.3676,
                            "lng": 4.9041
                        },
                        {
                            "region": "ld",
                            "name": "London",
                            "country": "GB",
                            "lat": 51.5074,
                            "lng": -0.1278
                        },
                        {
                            "region": "pa",
                            "name": "Paris",
                            "country": "FR",
                            "lat": 48.8566,
                            "lng": 2.3522
                        },
                        {
                            "region": "ma",
                            "name": "Madrid",
                            "country": "ES",
                            "lat": 40.4168,
                            "lng": -3.7038
                        },
                        {
                            "region": "ty",
                            "name": "Tokyo",
                            "country": "JP",
                            "lat": 35.6762,
                            "lng": 139.6503
                        },
                        {
                            "region": "sg",
                            "name": "Singapore",
                            "country": "SG",
                            "lat": 1.3521,
                            "lng": 103.8198
                        },
                        {
                            "region": "hk",
                            "name": "Hong Kong",
                            "country": "HK",
                            "lat": 22.3193,
                            "lng": 114.1694
                        },
                        {
                            "region": "sy",
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
