/** Oracle Cloud Infrastructure (OCI) cloud catalog for servers_config. */
export default {
    "method": "object.update",
    "array": "servers_config",
    "upsert": true,
    "object": [
        {
            "_id": "2a98875dd2870fc7c4e6b1ea",
            "type": "clouds",
            "provider": "oci",
            "name": "Oracle Cloud Infrastructure (OCI)",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "oci": {
                    "instances": [
                        {
                            "name": "VM.Standard.E4.Flex-1v2g",
                            "vCPU": 1,
                            "memoryGb": 2,
                            "default": true
                        },
                        {
                            "name": "VM.Standard.E4.Flex-2v8g",
                            "vCPU": 2,
                            "memoryGb": 8
                        },
                        {
                            "name": "VM.Standard.E4.Flex-4v16g",
                            "vCPU": 4,
                            "memoryGb": 16
                        },
                        {
                            "name": "VM.Standard.E4.Flex-8v32g",
                            "vCPU": 8,
                            "memoryGb": 32
                        },
                        {
                            "name": "VM.Standard.E4.Flex-16v64g",
                            "vCPU": 16,
                            "memoryGb": 64
                        },
                        {
                            "name": "VM.Standard.E4.Flex-32v128g",
                            "vCPU": 32,
                            "memoryGb": 128
                        },
                        {
                            "name": "VM.Standard.E4.Flex-64v256g",
                            "vCPU": 64,
                            "memoryGb": 256
                        }
                    ],
                    "regions": [
                        {
                            "region": "us-ashburn-1",
                            "name": "Ashburn",
                            "country": "US",
                            "lat": 39.0438,
                            "lng": -77.4874
                        },
                        {
                            "region": "us-phoenix-1",
                            "name": "Phoenix",
                            "country": "US",
                            "lat": 33.4484,
                            "lng": -112.074
                        },
                        {
                            "region": "us-sanjose-1",
                            "name": "San Jose",
                            "country": "US",
                            "lat": 37.3382,
                            "lng": -121.8863
                        },
                        {
                            "region": "ca-toronto-1",
                            "name": "Toronto",
                            "country": "CA",
                            "lat": 43.6532,
                            "lng": -79.3832
                        },
                        {
                            "region": "sa-saopaulo-1",
                            "name": "São Paulo",
                            "country": "BR",
                            "lat": -23.5505,
                            "lng": -46.6333
                        },
                        {
                            "region": "eu-frankfurt-1",
                            "name": "Frankfurt",
                            "country": "DE",
                            "lat": 50.1109,
                            "lng": 8.6821
                        },
                        {
                            "region": "eu-zurich-1",
                            "name": "Zurich",
                            "country": "CH",
                            "lat": 47.3769,
                            "lng": 8.5417
                        },
                        {
                            "region": "eu-amsterdam-1",
                            "name": "Amsterdam",
                            "country": "NL",
                            "lat": 52.3676,
                            "lng": 4.9041
                        },
                        {
                            "region": "uk-london-1",
                            "name": "London",
                            "country": "GB",
                            "lat": 51.5074,
                            "lng": -0.1278
                        },
                        {
                            "region": "ap-tokyo-1",
                            "name": "Tokyo",
                            "country": "JP",
                            "lat": 35.6762,
                            "lng": 139.6503
                        },
                        {
                            "region": "ap-osaka-1",
                            "name": "Osaka",
                            "country": "JP",
                            "lat": 34.6937,
                            "lng": 135.5023
                        },
                        {
                            "region": "ap-seoul-1",
                            "name": "Seoul",
                            "country": "KR",
                            "lat": 37.5665,
                            "lng": 126.978
                        },
                        {
                            "region": "ap-sydney-1",
                            "name": "Sydney",
                            "country": "AU",
                            "lat": -33.8688,
                            "lng": 151.2093
                        },
                        {
                            "region": "ap-mumbai-1",
                            "name": "Mumbai",
                            "country": "IN",
                            "lat": 19.076,
                            "lng": 72.8777
                        },
                        {
                            "region": "me-jeddah-1",
                            "name": "Jeddah",
                            "country": "SA",
                            "lat": 21.5433,
                            "lng": 39.1728
                        }
                    ]
                }
            }
        }
    ]
};
