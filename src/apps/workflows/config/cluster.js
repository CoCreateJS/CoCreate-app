/** Persist the same server-prepared organization cluster in the caller's trusted scope. */
const requiredText = (path, message) => ({
    [`$if.${path}.$type`]: {
        string: { [`$if.${path}.$regex`]: { '\\S': { [`${path}.trim`]: [] }, $else: { $throw: message } } },
        $else: { $throw: message }
    }
});
const checkWrite = (action, message) => ({
    [`$if.$actions.${action}.error.length.$gt`]: {
        '0': { $throw: message },
        $else: { [`$if.$actions.${action}.success.$eq`]: {
            $false: { $throw: message },
            $else: { [`$if.$actions.${action}.object.length.$gt`]: { '0': true, $else: { $throw: message } } }
        } }
    }
});

export default {
    method: 'object.update', array: 'workflows', upsert: true,
    object: [{
        _id: '6b0600000000000000000001',
        name: 'create-organization-cluster', enabled: true,
        description: 'Stores a managed organization cluster and links its organization. Signup invokes the trusted definition in platform and tenant scope using the same cluster ID and data.',
        actions: {
            organizationId: requiredText('$payload.create-organization-cluster.0.organizationId', 'Organization cluster requires an organization ID.'),
            clusterId: requiredText('$payload.create-organization-cluster.0.cluster._id', 'Organization cluster requires a cluster ID.'),
            clusterName: requiredText('$payload.create-organization-cluster.0.cluster.name', 'Organization cluster requires a name.'),
            checkName: { '$if.$actions.clusterName.$eq': { '$actions.organizationId': true, $else: { $throw: 'Organization cluster name must equal its organization ID.' } } },
            checkType: { '$if.$payload.create-organization-cluster.0.cluster.type.$eq': { organization: true, $else: { $throw: 'An organization cluster is required.' } } },
            cluster: {
                '$crud.send': {
                    method: 'object.update', array: 'clusters', upsert: true,
                    object: '$payload.create-organization-cluster.0.cluster'
                }
            },
            checkCluster: checkWrite('cluster', 'Organization cluster was not stored.'),
            link: {
                '$crud.send': {
                    method: 'object.update', array: 'organizations',
                    object: { _id: '$actions.organizationId', cluster_id: '$actions.clusterId' }
                }
            },
            checkLink: checkWrite('link', 'Organization cluster reference was not stored.'),
            '$data.create-organization-cluster.0.cluster': '$actions.cluster.object.0',
            '$data.create-organization-cluster.0.initialized': true
        }
    }]
};
