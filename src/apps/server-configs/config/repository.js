export default {
    method: 'object.update',
    array: 'servers_config',
    upsert: true,
    object: [{
        _id: '6b0500000000000000000001',
        type: 'repository',
        name: 'Node Repository',
        enabled: true,
        cluster: '*', server: '*',
        config: {
            enabled: true,
            // Empty uses the server organization's git.clone_url from signup.
            url: '',
            // Tenant apis record ID/name; empty resolves git.api with signup metadata.
            api: '',
            branch: 'dev',
            remote: 'origin',
            localFsRoot: '/home/ubuntu/Dev/CoCreate-server/organizations',
            onStartup: 'clone',
            onShutdown: 'commit-and-push',
            startupTimeoutMs: 60000,
            shutdownTimeoutMs: 10000
        }
    }]
};
