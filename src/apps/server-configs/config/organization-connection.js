/** Installed on the platform; tenant nodes have this optional handler disabled by default. */
export default {
    method: 'object.update', array: 'servers_config', upsert: true,
    object: [{
        _id: '6b0600000000000000000011', type: 'organization-connection',
        name: 'Platform Organization Connection', enabled: true,
        cluster: '*', server: '*', worker: '*',
        config: { enabled: true, workflow: 'create-organization-server' }
    }]
};
