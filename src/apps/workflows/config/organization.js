export default {
    method: 'object.update', array: 'workflows', upsert: true,
    object: [{
    _id: '6b0000000000000000000001',
    name: 'create-organization',
    description: 'Creates the organization profile, first user, and access keys in the tenant database.',
    enabled: true,
    actions: {
        createOrganization: {
            '$crud.send': {
                method: 'object.update',
                array: 'organizations',
                upsert: true,
                object: '$payload.create-organization.0.organization'
            }
        },
        checkOrganization: {
            '$if.$actions.createOrganization.error.length.$gt': {
                '0': { '$throw': 'Unable to create the tenant organization record.' },
                '$else': {
                    '$if.$actions.createOrganization.success.$eq': {
                        '$false': { '$throw': 'Unable to create tenant organization record.' },
                        '$else': {
                            '$if.$actions.createOrganization.object.length.$gt': {
                                '0': null,
                                '$else': { '$throw': 'Tenant organization record were not written.' }
                            }
                        }
                    }
                }
            }
        },
        createUser: {
            '$crud.send': {
                method: 'object.update',
                array: '$payload.create-organization.0.userArray',
                upsert: true,
                object: '$payload.create-organization.0.user'
            }
        },
        checkUser: {
            '$if.$actions.createUser.error.length.$gt': {
                '0': { '$throw': 'Unable to create the tenant user record.' },
                '$else': {
                    '$if.$actions.createUser.success.$eq': {
                        '$false': { '$throw': 'Unable to create tenant user record.' },
                        '$else': {
                            '$if.$actions.createUser.object.length.$gt': {
                                '0': null,
                                '$else': { '$throw': 'Tenant user record were not written.' }
                            }
                        }
                    }
                }
            }
        },
        createKeys: {
            '$crud.send': {
                method: 'object.update',
                array: 'keys',
                upsert: true,
                object: '$payload.create-organization.0.keys'
            }
        },
        checkKeys: {
            '$if.$actions.createKeys.error.length.$gt': {
                '0': { '$throw': 'Unable to create tenant access keys.' },
                '$else': {
                    '$if.$actions.createKeys.success.$eq': {
                        '$false': { '$throw': 'Unable to create tenant access keys.' },
                        '$else': {
                            '$if.$actions.createKeys.object.length.$gt': {
                                '0': null,
                                '$else': { '$throw': 'Tenant access keys were not written.' }
                            }
                        }
                    }
                }
            }
        },
        '$data.create-organization.0.initialized': true,
        '$data.create-organization.0.organizationId': '$payload.create-organization.0.organization._id',
        '$data.create-organization.0.userId': '$payload.create-organization.0.user._id'
    }
    }]
};
