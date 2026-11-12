/** Microsoft Azure cloud catalog for servers_config. */
export default {
    "method": "object.update",
    "array": "servers_config",
    "upsert": true,
    "object": [
        {
            "_id": "ec08da3f16224b5999767f92",
            "type": "clouds",
            "provider": "azure",
            "name": "Microsoft Azure",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "azure": {
                    "instances": [
                        {
                            "name": "Standard_B1s",
                            "vCPU": 1,
                            "memoryGb": 2,
                            "default": true
                        },
                        {
                            "name": "Standard_B2s",
                            "vCPU": 2,
                            "memoryGb": 8
                        },
                        {
                            "name": "Standard_B4ms",
                            "vCPU": 4,
                            "memoryGb": 16
                        },
                        {
                            "name": "Standard_B8ms",
                            "vCPU": 8,
                            "memoryGb": 32
                        },
                        {
                            "name": "Standard_B16ms",
                            "vCPU": 16,
                            "memoryGb": 64
                        },
                        {
                            "name": "Standard_B32ms",
                            "vCPU": 32,
                            "memoryGb": 128
                        },
                        {
                            "name": "Standard_D64s_v5",
                            "vCPU": 64,
                            "memoryGb": 256
                        }
                    ],
                    "regions": [
                        {
                            "region": "eastus",
                            "name": "Virginia",
                            "country": "US",
                            "lat": 37.3719,
                            "lng": -79.8164
                        },
                        {
                            "region": "eastus2",
                            "name": "Virginia 2",
                            "country": "US",
                            "lat": 36.6681,
                            "lng": -78.3881
                        },
                        {
                            "region": "westus",
                            "name": "California",
                            "country": "US",
                            "lat": 37.7833,
                            "lng": -122.4167
                        },
                        {
                            "region": "westus2",
                            "name": "Washington",
                            "country": "US",
                            "lat": 47.233,
                            "lng": -119.852
                        },
                        {
                            "region": "centralus",
                            "name": "Iowa",
                            "country": "US",
                            "lat": 41.5908,
                            "lng": -93.6208
                        },
                        {
                            "region": "canadacentral",
                            "name": "Toronto",
                            "country": "CA",
                            "lat": 43.6532,
                            "lng": -79.3832
                        },
                        {
                            "region": "brazilsouth",
                            "name": "São Paulo",
                            "country": "BR",
                            "lat": -23.5505,
                            "lng": -46.6333
                        },
                        {
                            "region": "northeurope",
                            "name": "Ireland",
                            "country": "IE",
                            "lat": 53.3498,
                            "lng": -6.2603
                        },
                        {
                            "region": "westeurope",
                            "name": "Netherlands",
                            "country": "NL",
                            "lat": 52.3676,
                            "lng": 4.9041
                        },
                        {
                            "region": "ukwest",
                            "name": "Cardiff",
                            "country": "GB",
                            "lat": 51.4815,
                            "lng": -3.1791
                        },
                        {
                            "region": "ukeast",
                            "name": "London",
                            "country": "GB",
                            "lat": 51.5074,
                            "lng": -0.1278
                        },
                        {
                            "region": "francecentral",
                            "name": "Paris",
                            "country": "FR",
                            "lat": 48.8566,
                            "lng": 2.3522
                        },
                        {
                            "region": "germanywestcentral",
                            "name": "Frankfurt",
                            "country": "DE",
                            "lat": 50.1109,
                            "lng": 8.6821
                        },
                        {
                            "region": "japaneast",
                            "name": "Tokyo",
                            "country": "JP",
                            "lat": 35.6762,
                            "lng": 139.6503
                        },
                        {
                            "region": "japanwest",
                            "name": "Osaka",
                            "country": "JP",
                            "lat": 34.6937,
                            "lng": 135.5023
                        },
                        {
                            "region": "southeastasia",
                            "name": "Singapore",
                            "country": "SG",
                            "lat": 1.3521,
                            "lng": 103.8198
                        },
                        {
                            "region": "australiaeast",
                            "name": "New South Wales",
                            "country": "AU",
                            "lat": -33.8688,
                            "lng": 151.2093
                        },
                        {
                            "region": "centralindia",
                            "name": "Pune",
                            "country": "IN",
                            "lat": 18.5204,
                            "lng": 73.8567
                        }
                    ]
                }
            }
        }
    ]
};
