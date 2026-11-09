export default {
    method: 'object.update', array: 'workflows', upsert: true,
    object: [{
        _id: '6b0600000000000000000001',
        name: 'createClusterConfig', enabled: true,
        description: 'Returns the default organization cluster configuration with its name and managed organization.',
        actions: {
            cluster: {
                name: '$data.name',
                type: 'organization',
                managedOrganization: '$data.managedOrganization',
                clouds: ['65f8ca227b39a3c1a8904e02'],
                storage: '65f8ca227b39a3c1a8904dfd',
                routing: '',
                binaryUrl: 'https://github.com/CoCreateJS/CoCreate-server/releases/download/dev-latest/cocreate-server-node-linux-x86_64.tar.gz',
                autoscaling: { enabled: 'on' },
                spot: { fallbackToOnDemand: true, enabled: 'on' },
                initialDeployment: {
                    cloud: '65f8ca227b39a3c1a8904e02', region: 'us-east-1', vmType: 't3a.small'
                },
                scaleOut: {
                    cpuThreshold: 85, memoryThreshold: 85, consecutiveFlushes: 3, maxClusterSize: 0
                },
                scaleIn: {
                    cpuThreshold: 10, memoryThreshold: 45, consecutiveFlushes: 10,
                    minClusterSize: 2, drainWaitSeconds: 60, preservation: 'continent',
                    decommissionStrategy: 'oldest'
                },
                geoScale: { enabled: 'on', sheddingThreshold: 20, densityBy: 'continent' },
                vertical: {
                    enabled: 'on', maxNodesPerTier: 2,
                    min: { vCPU: 1, memoryGb: 2 },
                    max: { vCPU: 64, memoryGb: 256 }
                },
                repositories: []
            },
            '$payload.data': '$cluster'
        }
    }]
};
