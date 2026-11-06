/** Platform-only VM dispatch for an inventory record already reserved by Cluster. */
const readOne = (action, message) => ({
    [`$if.$actions.${action}.error.length.$gt`]: { '0': { $throw: message }, $else: {
        [`$if.$actions.${action}.success.$eq`]: { $false: { $throw: message }, $else: {
            [`$if.$actions.${action}.object.0.$exists`]: { $true: `$actions.${action}.object.0`, $else: { $throw: message } }
        } }
    } }
});
export default {
    method: 'object.update', array: 'workflows', upsert: true,
    object: [{
        _id: '6b0600000000000000000002', name: 'create-organization-server', enabled: true,
        description: 'Creates an organization VM through platform cloud credentials and persists its provider identity. Cluster mirrors the same inventory and provider patch into the tenant scope.',
        actions: {
            serverLookup: { '$crud.send': {
                method: 'object.read', array: 'servers', filter: {
                    query: { _id: '$payload.create-organization-server.0.server._id', cluster_id: '$payload.create-organization-server.0.server.cluster_id' }, limit: 1
                }
            } },
            server: readOne('serverLookup', 'The reserved platform server is unavailable.'),
            clusterLookup: { '$crud.send': {
                method: 'object.read', array: 'clusters', filter: {
                    query: { _id: '$actions.server.cluster_id', type: 'organization', 'manager.for': '$actions.server.tenant_organization_id' }, limit: 1
                }
            } },
            cluster: readOne('clusterLookup', 'The managed organization cluster is unavailable.'),
            cloudLookup: { '$crud.send': {
                method: 'object.read', array: 'apis', filter: {
                    query: { _id: '$actions.server.cloud', type: 'cloud', enabled: true }, key: { _id: 1, name: 1 }, limit: 1
                }
            } },
            cloud: readOne('cloudLookup', 'The selected platform cloud API is unavailable.'),
            instance: { '$api.send': {
                api: '$actions.cloud.name', endpoint: 'create-instance', method: 'post',
                region: '$actions.server.infrastructure.region',
                data: {
                    name: '$actions.server.name', server_id: '$actions.server._id', cluster_id: '$actions.server.cluster_id',
                    region: '$actions.server.infrastructure.region', vmType: '$actions.server.infrastructure.vmType',
                    storage: '$actions.server.storage', host: '$actions.server.host',
                    vpcId: '$actions.cluster.vpcId', spot: '$actions.cluster.spot',
                    os: '$actions.cluster.os', application: '$actions.cluster.application',
                    startupScript: '$payload.create-organization-server.0.startupScript',
                    binaryUrl: '$payload.create-organization-server.0.binaryUrl',
                    environment: '$payload.create-organization-server.0.environment'
                }
            } },
            checkInstance: {
                '$if.$actions.instance.error.length.$gt': { '0': { $throw: 'Organization cloud instance creation failed.' }, $else: {
                    '$if.$actions.instance.success.$eq': { $false: { $throw: 'Organization cloud instance creation failed.' }, $else: {
                        '$if.$actions.instance.data.instanceId.$type': { string: {
                            '$if.$actions.instance.data.instanceId.$regex': { '\\S': true, $else: { $throw: 'Cloud provider did not return an instance ID.' } }
                        }, $else: { $throw: 'Cloud provider did not return an instance ID.' } }
                    } }
                } }
            },
            patch: {
                _id: '$actions.server._id', status: 'starting',
                'infrastructure.instanceId': '$actions.instance.data.instanceId',
                'infrastructure.privateIpAddress': '$actions.instance.data.privateIpAddress'
            },
            persist: { '$crud.send': { method: 'object.update', array: 'servers', object: '$actions.patch' } },
            persisted: readOne('persist', 'The provider instance ID was not persisted in platform inventory.'),
            '$data.create-organization-server.0.patch': '$actions.patch',
            '$data.create-organization-server.0.data': '$actions.instance.data',
            '$data.create-organization-server.0.server': '$actions.persisted'
        }
    }]
};
