/** Seed data for the shared cluster configuration. */
export default {
    "method": "object.update",
    "array": "clusters",
    "upsert": true,
    "object": [
        {
            "_id": "6ad6f78a0e127c561ac4063b",
            "name": "c1",
            "clouds": [
                "65f8ca227b39a3c1a8904e02"
            ],
            "storage": "65f8ca227b39a3c1a8904dfd",
            "routing": "",
            "host": "dev.cocreatejs.com",
            "binaryUrl": "https://github.com/cocreate-js/CoCreateWS/releases/download/dev-latest/cocreatews-node-linux-x64.tar.gz",
            "autoscaling": {
                "enabled": "on"
            },
            "spot": {
                "fallbackToOnDemand": true,
                "enabled": "on"
            },
            "scaleOut": {
                "cpuThreshold": 85,
                "memoryThreshold": 85,
                "consecutiveFlushes": 3,
                "maxClusterSize": 0
            },
            "scaleIn": {
                "cpuThreshold": 10,
                "memoryThreshold": 45,
                "consecutiveFlushes": 10,
                "minClusterSize": 2,
                "drainWaitSeconds": 60,
                "preservation": "continent",
                "decommissionStrategy": "oldest"
            },
            "geoScale": {
                "enabled": "on",
                "sheddingThreshold": 20,
                "densityBy": "continent"
            },
            "vertical": {
                "enabled": "on",
                "maxNodesPerTier": 2,
                "min": {
                    "vCPU": 1,
                    "memoryGb": 2
                },
                "max": {
                    "vCPU": 64,
                    "memoryGb": 256
                }
            }
        }
    ]
};
