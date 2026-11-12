/** Amazon Web Services (AWS) cloud catalog for servers_config. */
export default {
    "method": "object.update",
    "array": "servers_config",
    "upsert": true,
    "object": [
        {
            "_id": "913b361a8bd91d2227126186",
            "type": "clouds",
            "provider": "aws",
            "name": "Amazon Web Services (AWS)",
            "enabled": true,
            "cluster": "*",
            "server": "*",
            "worker": "*",
            "config": {
                "aws": {
                    "endpoint": {
                        "delete": "delete-instance"
                    },
                    "method": {
                        "delete": "post"
                    },
                    "instances": [
                        {
                            "name": "t3a.nano",
                            "vCPU": 2,
                            "memoryGb": 0.5
                        },
                        {
                            "name": "t3a.small",
                            "vCPU": 2,
                            "memoryGb": 2,
                            "default": true
                        },
                        {
                            "name": "t3a.medium",
                            "vCPU": 2,
                            "memoryGb": 4
                        },
                        {
                            "name": "t3a.large",
                            "vCPU": 2,
                            "memoryGb": 8
                        },
                        {
                            "name": "t3a.xlarge",
                            "vCPU": 4,
                            "memoryGb": 16
                        },
                        {
                            "name": "t3a.2xlarge",
                            "vCPU": 8,
                            "memoryGb": 32
                        },
                        {
                            "name": "c5a.4xlarge",
                            "vCPU": 16,
                            "memoryGb": 32
                        }
                    ],
                    "regions": [
                        {
                            "region": "us-east-1",
                            "name": "N. Virginia",
                            "country": "US",
                            "lat": 38.9489,
                            "lng": -77.4499
                        },
                        {
                            "region": "us-east-2",
                            "name": "Ohio",
                            "country": "US",
                            "lat": 40.1089,
                            "lng": -82.9545
                        },
                        {
                            "region": "us-west-1",
                            "name": "N. California",
                            "country": "US",
                            "lat": 37.3541,
                            "lng": -121.9552
                        },
                        {
                            "region": "us-west-2",
                            "name": "Oregon",
                            "country": "US",
                            "lat": 45.8399,
                            "lng": -119.7006
                        },
                        {
                            "region": "ca-central-1",
                            "name": "Montreal",
                            "country": "CA",
                            "lat": 45.5017,
                            "lng": -73.5673
                        },
                        {
                            "region": "eu-central-1",
                            "name": "Frankfurt",
                            "country": "DE",
                            "lat": 50.1109,
                            "lng": 8.6821
                        },
                        {
                            "region": "eu-west-1",
                            "name": "Ireland",
                            "country": "IE",
                            "lat": 53.3498,
                            "lng": -6.2603
                        },
                        {
                            "region": "eu-west-2",
                            "name": "London",
                            "country": "GB",
                            "lat": 51.5074,
                            "lng": -0.1278
                        },
                        {
                            "region": "eu-west-3",
                            "name": "Paris",
                            "country": "FR",
                            "lat": 48.8566,
                            "lng": 2.3522
                        },
                        {
                            "region": "eu-north-1",
                            "name": "Stockholm",
                            "country": "SE",
                            "lat": 59.3293,
                            "lng": 18.0686
                        },
                        {
                            "region": "eu-south-1",
                            "name": "Milan",
                            "country": "IT",
                            "lat": 45.4642,
                            "lng": 9.19
                        },
                        {
                            "region": "ap-northeast-1",
                            "name": "Tokyo",
                            "country": "JP",
                            "lat": 35.6762,
                            "lng": 139.6503
                        },
                        {
                            "region": "ap-northeast-2",
                            "name": "Seoul",
                            "country": "KR",
                            "lat": 37.5665,
                            "lng": 126.978
                        },
                        {
                            "region": "ap-northeast-3",
                            "name": "Osaka",
                            "country": "JP",
                            "lat": 34.6937,
                            "lng": 135.5023
                        },
                        {
                            "region": "ap-southeast-1",
                            "name": "Singapore",
                            "country": "SG",
                            "lat": 1.3521,
                            "lng": 103.8198
                        },
                        {
                            "region": "ap-southeast-2",
                            "name": "Sydney",
                            "country": "AU",
                            "lat": -33.8688,
                            "lng": 151.2093
                        },
                        {
                            "region": "ap-south-1",
                            "name": "Mumbai",
                            "country": "IN",
                            "lat": 19.076,
                            "lng": 72.8777
                        },
                        {
                            "region": "sa-east-1",
                            "name": "São Paulo",
                            "country": "BR",
                            "lat": -23.5505,
                            "lng": -46.6333
                        },
                        {
                            "region": "af-south-1",
                            "name": "Cape Town",
                            "country": "ZA",
                            "lat": -33.9249,
                            "lng": 18.4241
                        },
                        {
                            "region": "me-south-1",
                            "name": "Bahrain",
                            "country": "BH",
                            "lat": 26.0667,
                            "lng": 50.5577
                        }
                    ]
                }
            }
        }
    ]
};
