export default {
    method: 'object.update', array: 'workflows', upsert: true,
    object: [
        {
            _id: '6b0000000000000000000002',
            name: 'createOrganization',
            description: 'Creates an organization and its managed platform key.',
            enabled: true,
            actions: {
                '$data.organization.owner': '$payload.user_id',
                create: {
                    '$crud.send': {
                        method: 'object.create',
                        array: 'organizations',
                        object: '$data.organization'
                    }
                },
                '$if.$create.error.length.$gt': {
                    '0': { '$throw': '$create.error' }
                },
                managedKey: {
                    '$crud.send': {
                        method: 'object.create',
                        array: 'keys',
                        object: {
                            _id: '$object_id',
                            name: '`Managed organization $create.object.0._id`',
                            type: 'key',
                            status: 'active',
                            key: { '$uuid': [] },
                            admin: false,
                            default: false,
                            roles: ['6b0700000000000000000021'],
                            managedOrganization: '$create.object.0._id'
                        }
                    }
                },
                '$if.$managedKey.error.length.$gt': {
                    '0': { '$throw': '$managedKey.error' }
                },
                '$data.createOrganization': '$create.object.0',
                '$data.createOrganization.managedKey': '$managedKey.object.0.key'
            }
        },
        {
            _id: '6b0000000000000000000003',
            name: 'seedOrganization',
            description: 'Seeds an organization database with its organization, owner, roles, and keys.',
            enabled: true,
            actions: {
                organizationId: {
                    '$if.$data.organizationId.$exists': {
                        '$true': '$data.organizationId',
                        '$else': { '$throw': 'seedOrganization requires an organizationId.' }
                    }
                },
                userId: {
                    '$if.$payload.user_id.$exists': {
                        '$true': '$payload.user_id',
                        '$else': { '$throw': 'seedOrganization requires an authenticated user.' }
                    }
                },
                organization: {
                    read: {
                        '$crud.send': {
                            method: 'object.read',
                            array: 'organizations',
                            object: [{ _id: '$organizationId' }],
                            filter: { query: { owner: '$userId' }, limit: 1 }
                        }
                    },
                    '$if.$read.error.length.$gt': {
                        '0': { '$throw': '$read.error' },
                        '$else': {
                            '$if.$read.object.0.$exists': {
                                '$true': {
                                    '$read.object.0.organization_id': '$organizationId',
                                    '$organization': '$read.object.0'
                                },
                                '$else': { '$throw': 'The organization was not found for this user.' }
                            }
                        }
                    },
                    create: {
                        '$crud.send': {
                            method: 'object.create',
                            organization_id: '$organizationId',
                            array: 'organizations',
                            object: '$organization'
                        }
                    },
                    '$if.$create.error.length.$gt': {
                        '0': { '$throw': '$create.error' }
                    }
                },
                userKey: {
                    read: {
                        '$crud.send': {
                            method: 'object.read',
                            array: 'keys',
                            object: [],
                            filter: { query: { type: 'user', key: '$userId' }, limit: 1 }
                        }
                    },
                    '$if.$read.error.length.$gt': {
                        '0': { '$throw': '$read.error' },
                        '$else': {
                            '$if.$read.object.0.$exists': {
                                '$true': {
                                    '$read.object.0.organization_id': '$organizationId',
                                    '$userKey': '$read.object.0'
                                },
                                '$else': { '$throw': 'The signed-in user key was not found.' }
                            }
                        }
                    },
                    create: {
                        '$crud.send': {
                            method: 'object.create',
                            organization_id: '$organizationId',
                            array: 'keys',
                            object: {
                                _id: '$object_id',
                                type: 'user',
                                key: '$userId',
                                name: '$user.name',
                                array: '$userKey.array',
                                email: '$userKey.email',
                                username: '$userKey.username',
                                password: '$userKey.password',
                                roles: ['$adminRole._id'],
                                status: 'active'
                            }
                        }
                    },
                    '$if.$create.error.length.$gt': {
                        '0': { '$throw': '$create.error' }
                    }
                },
                user: {
                    read: {
                        '$crud.send': {
                            method: 'object.read',
                            array: '$userKey.array',
                            object: [{ _id: '$userId' }],
                            filter: { limit: 1, projection: { password: 0 } }
                        }
                    },
                    '$if.$read.error.length.$gt': {
                        '0': { '$throw': '$read.error' },
                        '$else': {
                            '$if.$read.object.0.$exists': {
                                '$true': {
                                    '$read.object.0.organization_id': '$organizationId',
                                    '$user': '$read.object.0'
                                },
                                '$else': { '$throw': 'The signed-in user profile was not found.' }
                            }
                        }
                    },
                    create: {
                        '$crud.send': {
                            method: 'object.create',
                            organization_id: '$organizationId',
                            array: '$userKey.array',
                            object: '$user'
                        }
                    },
                    '$if.$create.error.length.$gt': {
                        '0': { '$throw': '$create.error' }
                    }
                },
                adminRole: {
                    create: {
                        '$crud.send': {
                            method: 'object.create',
                            organization_id: '$organizationId',
                            array: 'keys',
                            object: {
                                _id: '$object_id',
                                description: 'Administrator role granting full organization access to assigned users.',
                                admin: true,
                                name: 'admin',
                                type: 'role',
                                status: 'active'
                            }
                        }
                    },
                    '$if.$create.error.length.$gt': {
                        '0': { '$throw': '$create.error' },
                        '$else': { '$adminRole': '$create.object.0' }
                    }
                },
                adminKey: {
                    create: {
                        '$crud.send': {
                            method: 'object.create',
                            organization_id: '$organizationId',
                            array: 'keys',
                            object: {
                                _id: '$object_id',
                                description: 'Administrative API key with full organization access.',
                                admin: true,
                                name: 'admin',
                                key: { '$uuid': [] },
                                type: 'key',
                                status: 'active'
                            }
                        }
                    },
                    '$if.$create.error.length.$gt': {
                        '0': { '$throw': '$create.error' },
                        '$else': { '$adminKey': '$create.object.0' }
                    }
                },
                defaultKey: {
                    create: {
                        '$crud.send': {
                            method: 'object.create',
                            organization_id: '$organizationId',
                            array: 'keys',
                            object: {
                                _id: '$object_id',
                                description: 'Default API key for authentication, account access, and permitted content reads.',
                                methods: {
                                    object: {
                                        '*': {
                                            contacts: { '_id.$eq': '$user_id' },
                                            organizations: { 'owner.$eq': '$user_id' }
                                        },
                                        read: { '$array': ['ai', 'blog-posts'] }
                                    },
                                    checkSession: 'true',
                                    signIn: 'true',
                                    signUp: 'true',
                                    acceptInvite: 'true',
                                    forgotPassword: 'true',
                                    resetPassword: 'true',
                                    updateUserStatus: 'true',
                                    isUnique: 'true',
                                    inviteUser: 'true'
                                },
                                default: true,
                                name: 'default',
                                key: { '$uuid': [] },
                                type: 'key',
                                status: 'active'
                            }
                        }
                    },
                    '$if.$create.error.length.$gt': {
                        '0': { '$throw': '$create.error' },
                        '$else': { '$defaultKey': '$create.object.0' }
                    }
                },
                '$data.seedOrganization': {
                    initialized: true,
                    organizationId: '$organizationId',
                    userId: '$userId'
                }
            }
        }]
};
