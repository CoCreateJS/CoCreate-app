/** Platform workflow for creating an organization server from cluster config. */
export default {
    method: 'object.update', array: 'workflows', upsert: true,
    object: [{
        _id: '6b0600000000000000000002',
        name: 'createOrganizationServer',
        enabled: true,
        description: 'Creates an organization server using the cluster and selected deployment configuration.',
        actions: {
            cloudId: {
                '$if.$data.initialDeployment.cloud.$exists': {
                    '$true': '$data.initialDeployment.cloud',
                    '$else': { '$throw': 'The cluster initialDeployment requires a cloud.' }
                }
            },
            region: {
                '$if.$data.initialDeployment.region.$exists': {
                    '$true': '$data.initialDeployment.region',
                    '$else': { '$throw': 'The cluster initialDeployment requires a region.' }
                }
            },
            vmType: {
                '$if.$data.initialDeployment.vmType.$exists': {
                    '$true': '$data.initialDeployment.vmType',
                    '$else': { '$throw': 'The cluster initialDeployment requires a vmType.' }
                }
            },
            server: {
                read: {
                    '$crud.send': {
                        method: 'object.read',
                        array: 'servers',
                        filter: {
                            query: {
                                _id: '$payload.server._id',
                                cluster_id: '$data._id',
                                tenant_organization_id: '$data.managedOrganization'
                            },
                            limit: 1
                        }
                    }
                },
                '$if.$read.error.length.$gt': {
                    '0': { '$throw': '$read.error' },
                    '$else': {
                        '$if.$read.object.0.$exists': {
                            '$true': { '$server': '$read.object.0' },
                            '$else': { '$throw': 'The reserved organization server is unavailable.' }
                        }
                    }
                }
            },
            cloud: {
                read: {
                    '$crud.send': {
                        method: 'object.read',
                        array: 'apis',
                        filter: {
                            query: { _id: '$cloudId', type: 'cloud', enabled: true },
                            key: { _id: 1, name: 1 },
                            limit: 1
                        }
                    }
                },
                '$if.$read.error.length.$gt': {
                    '0': { '$throw': '$read.error' },
                    '$else': {
                        '$if.$read.object.0.$exists': {
                            '$true': { '$cloud': '$read.object.0' },
                            '$else': { '$throw': 'The selected enabled cloud API is unavailable.' }
                        }
                    }
                }
            },
            instance: {
                '$api.send': {
                    api: '$cloud.name',
                    endpoint: 'create-instance',
                    method: 'post',
                    region: '$region',
                    data: {
                        name: '$server.name',
                        server_id: '$server._id',
                        cluster_id: '$data._id',
                        region: '$region',
                        vmType: '$vmType',
                        storage: '$data.storage',
                        host: '$data.host',
                        vpcId: '$data.vpcId',
                        spot: '$data.spot',
                        os: '$data.os',
                        application: '$data.application',
                        startupScript: '$payload.startupScript',
                        binaryUrl: '$payload.binaryUrl',
                        environment: '$payload.environment'
                    }
                }
            },
            '$if.$instance.error.length.$gt': {
                '0': { '$throw': '$instance.error' }
            },
            instanceId: {
                '$if.$instance.data.instanceId.$exists': {
                    '$true': '$instance.data.instanceId',
                    '$else': { '$throw': 'Cloud provider did not return an instance ID.' }
                }
            },
            patch: {
                _id: '$server._id',
                status: 'starting',
                'infrastructure.instanceId': '$instanceId',
                'infrastructure.privateIpAddress': '$instance.data.privateIpAddress'
            },
            persist: {
                '$crud.send': {
                    method: 'object.update',
                    array: 'servers',
                    object: '$patch'
                }
            },
            '$if.$persist.error.length.$gt': {
                '0': { '$throw': '$persist.error' }
            },
            persistedServer: {
                '$if.$persist.object.0.$exists': {
                    '$true': '$persist.object.0',
                    '$else': { '$throw': 'The provider instance ID was not persisted in platform inventory.' }
                }
            },
            '$payload.data': {
                patch: '$patch',
                data: '$instance.data',
                server: '$persistedServer'
            }
        }
    }]
};
