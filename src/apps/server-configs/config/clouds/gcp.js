/** Google Cloud Platform (GCP) cloud catalog for servers_config. */
export default {
    "method": "object.update",
    "array": "servers_config",
    "upsert": true,
    "object": [
        {
            "_id": "1aad4b678a7711fe5b75200c",
            "type": "clouds",
            "provider": "gcp",
            "name": "Google Cloud Platform (GCP)",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "gcp": {
                    "instances": [
                        {
                            "name": "e2-micro",
                            "vCPU": 1,
                            "memoryGb": 2,
                            "default": true
                        },
                        {
                            "name": "e2-standard-2",
                            "vCPU": 2,
                            "memoryGb": 8
                        },
                        {
                            "name": "e2-standard-4",
                            "vCPU": 4,
                            "memoryGb": 16
                        },
                        {
                            "name": "e2-standard-8",
                            "vCPU": 8,
                            "memoryGb": 32
                        },
                        {
                            "name": "e2-standard-16",
                            "vCPU": 16,
                            "memoryGb": 64
                        },
                        {
                            "name": "e2-standard-32",
                            "vCPU": 32,
                            "memoryGb": 128
                        },
                        {
                            "name": "n2-standard-64",
                            "vCPU": 64,
                            "memoryGb": 256
                        }
                    ],
                    "regions": [
                        {
                            "region": "us-central1",
                            "name": "Iowa",
                            "country": "US",
                            "lat": 41.2619,
                            "lng": -95.8608
                        },
                        {
                            "region": "us-east1",
                            "name": "South Carolina",
                            "country": "US",
                            "lat": 33.196,
                            "lng": -80.0131
                        },
                        {
                            "region": "us-east4",
                            "name": "N. Virginia",
                            "country": "US",
                            "lat": 38.9489,
                            "lng": -77.4499
                        },
                        {
                            "region": "us-west1",
                            "name": "Oregon",
                            "country": "US",
                            "lat": 45.6018,
                            "lng": -121.1842
                        },
                        {
                            "region": "us-west2",
                            "name": "Los Angeles",
                            "country": "US",
                            "lat": 34.0522,
                            "lng": -118.2437
                        },
                        {
                            "region": "northamerica-northeast1",
                            "name": "Montreal",
                            "country": "CA",
                            "lat": 45.5017,
                            "lng": -73.5673
                        },
                        {
                            "region": "southamerica-east1",
                            "name": "São Paulo",
                            "country": "BR",
                            "lat": -23.5505,
                            "lng": -46.6333
                        },
                        {
                            "region": "europe-west1",
                            "name": "Belgium",
                            "country": "BE",
                            "lat": 50.4541,
                            "lng": 3.8258
                        },
                        {
                            "region": "europe-west2",
                            "name": "London",
                            "country": "GB",
                            "lat": 51.5074,
                            "lng": -0.1278
                        },
                        {
                            "region": "europe-west3",
                            "name": "Frankfurt",
                            "country": "DE",
                            "lat": 50.1109,
                            "lng": 8.6821
                        },
                        {
                            "region": "europe-west4",
                            "name": "Eemshaven",
                            "country": "NL",
                            "lat": 53.4373,
                            "lng": 6.8335
                        },
                        {
                            "region": "asia-east1",
                            "name": "Taiwan",
                            "country": "TW",
                            "lat": 24.0518,
                            "lng": 120.5161
                        },
                        {
                            "region": "asia-east2",
                            "name": "Hong Kong",
                            "country": "HK",
                            "lat": 22.3193,
                            "lng": 114.1694
                        },
                        {
                            "region": "asia-northeast1",
                            "name": "Tokyo",
                            "country": "JP",
                            "lat": 35.6762,
                            "lng": 139.6503
                        },
                        {
                            "region": "asia-northeast2",
                            "name": "Osaka",
                            "country": "JP",
                            "lat": 34.6937,
                            "lng": 135.5023
                        },
                        {
                            "region": "asia-southeast1",
                            "name": "Singapore",
                            "country": "SG",
                            "lat": 1.3521,
                            "lng": 103.8198
                        },
                        {
                            "region": "asia-south1",
                            "name": "Mumbai",
                            "country": "IN",
                            "lat": 19.076,
                            "lng": 72.8777
                        },
                        {
                            "region": "australia-southeast1",
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
