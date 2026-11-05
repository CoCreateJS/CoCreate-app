/** Permission reference only: real cluster credentials are generated and scoped separately. */
export default {
    method: 'object.update', array: 'keys', upsert: true,
    object: [{
        _id: '6b0700000000000000000021',
        name: 'Managed Cluster API Access', type: 'key', status: 'reference',
        admin: false, default: false,
        methods: {
            post: { $endpoint: ['create-instance', 'delete-instance'] },
            delete: { $endpoint: ['delete-instance'] },
            object: {
                update: { $array: ['servers', 'clusters'] },
                delete: { $array: ['servers'] }
            }
        },
        description: 'Keyless reference for server manager access. Permits instance endpoints, server state updates and server inventory deletion; cluster/provider predicates remain deferred. Signup creates a UUID key in platform keys; initial server creation places it in manager.apiKey on both inventory copies.'
    }]
};
