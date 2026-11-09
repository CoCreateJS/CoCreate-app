/** Creates a managed GitHub repository and its deploy credential. */
export default {
    method: 'object.update',
    array: 'workflows',
    upsert: true,
    object: [
        {
            _id: '6b0400000000000000000002',
            name: 'createRepository',
            description: 'Creates a private repository for an organization and registers its deploy key.',
            enabled: true,
            actions: {
                organizationId: {
                    '$if.$data.organizationId.$exists': {
                        '$true': '$data.organizationId',
                        '$else': { '$throw': 'createRepository requires an organizationId.' }
                    }
                },
                key: {
                    create: { '$security.generateSshKeyPair': [] },
                    '$key': '$create'
                },
                repository: {
                    create: {
                        '$api.send': {
                            api: 'github-organizations',
                            endpoint: 'create-repository-from-template',
                            data: {
                                name: '$organizationId',
                                templateOwner: 'CoCreateJS',
                                templateRepository: 'CoCreate-app-template'
                            }
                        }
                    },
                    '$if.$create.error.length.$gt': {
                        '0': { '$throw': '$create.error' },
                        '$else': { '$repository': '$create.data' }
                    }
                },
                access: {
                    create: {
                        '$api.send': {
                            api: 'github-organizations',
                            endpoint: 'create-repository-deploy-key',
                            data: {
                                name: '$organizationId',
                                publicKey: '$key.publicKey'
                            }
                        }
                    },
                    '$if.$create.error.length.$gt': {
                        '0': { '$throw': '$create.error' },
                        '$else': { '$access': '$create.data' }
                    }
                },
                credential: {
                    create: {
                        '$crud.send': {
                            method: 'object.create',
                            array: 'secrets',
                            object: {
                                _id: '$object_id',
                                organization_id: '$organizationId',
                                name: 'github-repository',
                                provider: 'github',
                                authentication: 'ssh-deploy-key',
                                repository: '$repository.full_name',
                                deploy_key_id: '$access.id',
                                publicKey: '$key.publicKey',
                                privateKey: '$key.privateKey',
                                enabled: true,
                                status: 'active'
                            }
                        }
                    },
                    '$if.$create.error.length.$gt': {
                        '0': { '$throw': '$create.error' },
                        '$else': { '$credential': '$create.object.0' }
                    }
                },
                '$data.createRepository': {
                    organizationId: '$organizationId',
                    repository: '$repository',
                    credentialId: '$credential._id'
                }
            }
        }
    ]
};
