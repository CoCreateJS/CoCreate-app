/********************************************************************************
 * Copyright (C) 2026 CoCreate and Contributors.
 *
 * Licensed under GNU AGPLv3.
 ********************************************************************************/

const requiredText = (path, message) => ({
    [`$if.${path}.$type`]: {
        string: {
            [`$if.${path}.$regex`]: {
                '\\S': { [`${path}.trim`]: [] },
                $else: { $throw: message }
            }
        },
        $else: { $throw: message }
    }
});

const readOne = (action, message) => ({
    [`$if.$actions.${action}.error.length.$gt`]: {
        '0': { $throw: message },
        $else: {
            [`$if.$actions.${action}.object.0.$exists`]: {
                $true: `$actions.${action}.object.0`,
                $else: { $throw: message }
            }
        }
    }
});

const endpointLookup = name => ({
    '$crud.send': {
        method: 'object.read', array: 'endpoints',
        filter: {
            query: { api_id: '$actions.api._id', name, enabled: true },
            key: { _id: 1 }, limit: 1
        }
    }
});

const nodeData = {
    server_id: '$actions.server._id',
    cluster_id: '$actions.cluster._id',
    ip: '$actions.server.ip',
    host: '$actions.server.host',
    infrastructure: '$actions.server.infrastructure',
    location: '$actions.server.location'
};

/** Platform workflow seed: initialize routing and prepare direct node cleanup. */
export default {
    method: 'object.update', array: 'workflows', upsert: true,
    object: [{
        _id: '6b0400000000000000000001',
        name: 'configure-cluster-routing',
        description: 'Registers this server through its cluster routing API and returns the API request for direct shutdown cleanup.',
        enabled: true,
        actions: {
            serverId: requiredText('$payload.configure-cluster-routing.0.server_id', 'configure-cluster-routing requires a server ID.'),
            serverLookup: {
                '$crud.send': {
                    method: 'object.read', array: 'servers',
                    filter: {
                        query: { _id: '$actions.serverId' }, limit: 1,
                        key: { _id: 1, cluster_id: 1, ip: 1, host: 1, infrastructure: 1, location: 1 }
                    }
                }
            },
            server: readOne('serverLookup', 'The managed server record is unavailable.'),
            clusterId: requiredText('$actions.server.cluster_id', 'The managed server requires a cluster ID.'),
            clusterLookup: {
                '$crud.send': {
                    method: 'object.read', array: 'clusters',
                    filter: { query: { _id: '$actions.clusterId' }, key: { _id: 1, routing: 1 }, limit: 1 }
                }
            },
            cluster: readOne('clusterLookup', 'The managed cluster record is unavailable.'),
            routingId: requiredText('$actions.cluster.routing', 'The cluster requires a routing API record ID.'),
            apiLookup: {
                '$crud.send': {
                    method: 'object.read', array: 'apis',
                    filter: {
                        query: { _id: '$actions.routingId', type: 'routing', enabled: true },
                        key: { _id: 1, name: 1 }, limit: 1
                    }
                }
            },
            api: readOne('apiLookup', 'The selected enabled routing API is unavailable.'),
            apiName: requiredText('$actions.api.name', 'The selected routing API requires a name.'),
            addEndpointLookup: endpointLookup('add-routing'),
            addEndpoint: readOne('addEndpointLookup', "The selected routing API requires an enabled 'add-routing' endpoint."),
            removeEndpointLookup: endpointLookup('remove-routing'),
            removeEndpoint: readOne('removeEndpointLookup', "The selected routing API requires an enabled 'remove-routing' endpoint."),
            ip: requiredText('$actions.server.ip', 'The managed server requires an IP address before routing registration.'),
            // Prepare identity-based cleanup before registration, so an API error
            // can still leave enough context for the node's shutdown handler.
            '$data.configure-cluster-routing.0.remove': {
                api: '$actions.apiName', endpoint: 'remove-routing',
                data: { ...nodeData, registration: null }
            },
            response: {
                '$api.send': { api: '$actions.apiName', endpoint: 'add-routing', data: { ...nodeData } }
            },
            checkResponse: {
                '$if.$actions.response.error.length.$gt': {
                    '0': { $throw: "The 'add-routing' endpoint failed." },
                    $else: {
                        '$if.$actions.response.success.$eq': {
                            $false: { $throw: "The 'add-routing' endpoint rejected the request." },
                            $else: null
                        }
                    }
                }
            },
            '$data.configure-cluster-routing.0.result': '$actions.response.data',
            '$data.configure-cluster-routing.0.remove.data.registration': '$actions.response.data'
        }
    }]
};
