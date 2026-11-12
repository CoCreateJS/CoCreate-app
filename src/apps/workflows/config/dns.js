/** Platform workflows for host registration and host server dns. */
export default {
    method: 'object.update', array: 'workflows', upsert: true,
    object: [
        {
            _id: '6b0400000000000000000001',
            name: 'addHost',
            description: 'Registers an organization host in the configured Bunny DNS zone.',
            enabled: true,
            actions: {
                host: {
                    '$if.$data.host.$exists': {
                        '$true': '$data.host',
                        '$else': { '$throw': 'addHost requires a host.' }
                    }
                },
                zoneId: {
                    '$if.$data.zoneId.$exists': {
                        '$true': '$data.zoneId',
                        '$else': { '$throw': 'addHost requires a zoneId.' }
                    }
                },
                record: {
                    '$if.$data.record.$exists': {
                        '$true': '$data.record',
                        '$else': { '$throw': 'addHost requires a DNS record.' }
                    }
                },
                create: {
                    '$api.send': {
                        api: 'bunny.net',
                        endpoint: 'create-dns-record',
                        data: { zoneId: '$zoneId', record: '$record' }
                    }
                },
                '$if.$create.error.length.$gt': {
                    '0': { '$throw': '$create.error' }
                },
                '$payload.data': {
                    host: '$host',
                    registration: '$create.data'
                }
            }
        },
        {
            _id: '6b0400000000000000000002',
            name: 'removeHost',
            description: 'Removes an organization host record from the configured Bunny DNS zone.',
            enabled: true,
            actions: {
                host: {
                    '$if.$data.host.$exists': {
                        '$true': '$data.host',
                        '$else': { '$throw': 'removeHost requires a host.' }
                    }
                },
                zoneId: {
                    '$if.$data.zoneId.$exists': {
                        '$true': '$data.zoneId',
                        '$else': { '$throw': 'removeHost requires a zoneId.' }
                    }
                },
                recordId: {
                    '$if.$data.recordId.$exists': {
                        '$true': '$data.recordId',
                        '$else': { '$throw': 'removeHost requires a recordId.' }
                    }
                },
                remove: {
                    '$api.send': {
                        api: 'bunny.net',
                        endpoint: 'delete-dns-record',
                        data: { zoneId: '$zoneId', recordId: '$recordId' }
                    }
                },
                '$if.$remove.error.length.$gt': {
                    '0': { '$throw': '$remove.error' }
                },
                '$payload.data': {
                    host: '$host',
                    recordId: '$recordId',
                    result: '$remove.data'
                }
            }
        },
        {
            _id: '6b0400000000000000000003',
            name: 'addServer',
            description: 'Adds a server IP to a host DNS location with its weight and provider metadata.',
            enabled: true,
            actions: {
                host: {
                    '$if.$data.host.$exists': {
                        '$true': '$data.host',
                        '$else': { '$throw': 'addServer requires a host.' }
                    }
                },
                serverId: {
                    '$if.$data.serverId.$exists': {
                        '$true': '$data.serverId',
                        '$else': { '$throw': 'addServer requires a serverId.' }
                    }
                },
                ip: {
                    '$if.$data.ip.$exists': {
                        '$true': '$data.ip',
                        '$else': { '$throw': 'addServer requires an IP address.' }
                    }
                },
                location: {
                    '$if.$data.location.$exists': {
                        '$true': '$data.location',
                        '$else': { '$throw': 'addServer requires a DNS location.' }
                    }
                },
                dnsApiName: {
                    '$if.$data.api.$exists': {
                        '$true': '$data.api',
                        '$else': { '$throw': 'addServer requires a DNS API name.' }
                    }
                },
                addEndpointName: {
                    '$if.$data.endpoint.$exists': {
                        '$true': '$data.endpoint',
                        '$else': { '$throw': 'addServer requires a configured add endpoint.' }
                    }
                },
                removeEndpointName: {
                    '$if.$data.removeEndpoint.$exists': {
                        '$true': '$data.removeEndpoint',
                        '$else': { '$throw': 'addServer requires a configured remove endpoint.' }
                    }
                },
                request: {
                    host: '$host',
                    serverId: '$serverId',
                    ip: '$ip',
                    location: '$location',
                    weight: '$data.weight',
                    metadata: '$data.metadata'
                },
                add: {
                    '$api.send': {
                        api: '$dnsApiName',
                        endpoint: '$addEndpointName',
                        data: '$request'
                    }
                },
                '$if.$add.error.length.$gt': {
                    '0': { '$throw': '$add.error' }
                },
                '$payload.data': {
                    host: '$host',
                    serverId: '$serverId',
                    registration: '$add.data',
                    remove: {
                        api: '$dnsApiName',
                        endpoint: '$removeEndpointName',
                        registration: '$add.data'
                    }
                }
            }
        },
        {
            _id: '6b0400000000000000000004',
            name: 'removeServer',
            description: 'Removes a server from its host DNS location using its saved registration.',
            enabled: true,
            actions: {
                host: {
                    '$if.$data.host.$exists': {
                        '$true': '$data.host',
                        '$else': { '$throw': 'removeServer requires a host.' }
                    }
                },
                serverId: {
                    '$if.$data.serverId.$exists': {
                        '$true': '$data.serverId',
                        '$else': { '$throw': 'removeServer requires a serverId.' }
                    }
                },
                dnsApiName: {
                    '$if.$data.api.$exists': {
                        '$true': '$data.api',
                        '$else': { '$throw': 'removeServer requires a DNS API name.' }
                    }
                },
                removeEndpointName: {
                    '$if.$data.endpoint.$exists': {
                        '$true': '$data.endpoint',
                        '$else': { '$throw': 'removeServer requires a configured remove endpoint.' }
                    }
                },
                registration: {
                    '$if.$data.registration.$exists': {
                        '$true': '$data.registration',
                        '$else': { '$throw': 'removeServer requires the saved server registration.' }
                    }
                },
                remove: {
                    '$api.send': {
                        api: '$dnsApiName',
                        endpoint: '$removeEndpointName',
                        data: '$registration'
                    }
                },
                '$if.$remove.error.length.$gt': {
                    '0': { '$throw': '$remove.error' }
                },
                '$payload.data': {
                    host: '$host',
                    serverId: '$serverId',
                    result: '$remove.data'
                }
            }
        }
    ]
};
