import assert from 'node:assert/strict';
import test from 'node:test';
import Workflows from '../../CoCreate-modules/workflows/src/server.js';
import { init as initOrganizations } from '../../CoCreate-modules/organizations/src/server/index.js';
import config from '../../CoCreate-modules/config/src/server.js';
import { getStorage } from '../../CoCreate-modules/crud-server/src/getStorage.js';
import seed from '../src/apps/workflows/config/data.js';
import organizationSeed from '../src/apps/workflows/config/organization.js';
import repositorySeed from '../src/apps/workflows/config/repository.js';
import clusterSeed from '../src/apps/workflows/config/cluster.js';
import managementKeySeed from '../src/apps/api-keys/config/managed-cluster.js';

const workflowName = 'create-organization-database';
async function run(t, options = {}) {
    t.mock.method(config, 'get', () => undefined);
    t.mock.method(config, 'query', async () => undefined);
    const definition = structuredClone(seed.object[0]);
    definition.enabled = true; // Enable only the in-memory fixture, never the source or live record.
    if (options.bootstrap) {
        definition.actions = {
            provision: { '$api.send': { api: 'custom-storage', endpoint: 'create-database', data: {} } },
            bootstrapStorage: '$actions.provision.data',
            persistBootstrap: { '$crud.send': {
                method: 'object.update', database: '$organization_id', array: 'organizations',
                object: { _id: '$payload.create-organization-database.0.organizationId', bootstrapStorage: '$actions.bootstrapStorage' }
            } },
            '$data.create-organization-database.0.bootstrapStorage': '$actions.bootstrapStorage'
        };
    }
    const records = new Map(), requests = [], apiCalls = [], creationCalls = [];
    let response;
    const sourceUser = { _id: 'user-1', name: 'Existing User', password: 'legacy-password' };
    const credential = { _id: 'credential-1', type: 'user', key: 'user-1', array: 'contacts', password: 'existing-hash' };
    const runtime = {
        organization_id: 'platform',
        manager: { async createServer(cluster) {
            creationCalls.push(structuredClone(cluster));
            assert.equal(response, undefined, 'organization response must wait for server creation');
            assert.deepEqual(cluster, records.get('platform:clusters')[0]);
            assert.deepEqual(cluster, records.get(`${cluster.manager.for}:clusters`)[0]);
            assert.ok(cluster.repositories.length > 0);
            assert.equal(records.get(`${cluster.manager.for}:apis`).find(item => item.authentication === 'ssh-deploy-key').enabled, true);
            if (options.onCreateServer) await options.onCreateServer(cluster);
            if (options.creationError) throw new Error('Server creation failed');
            return { status: 'created', server: { manager: { apiKey: 'not-for-client' } }, data: { instanceId: 'instance-1' } };
        } },
        wsManager: { on() {}, send(value) { response = value; return value; } },
        crud: { async send(request) {
            requests.push(structuredClone(request));
            const key = `${request.organization_id}:${request.array}`;
            const stored = records.get(key) || [];
            if (request.method === 'object.read') {
                const reference = [managementKeySeed]
                    .find(seed => seed.array === request.array && seed.object[0]._id === request.filter?.query?._id);
                if (reference && request.organization_id === 'platform') return { object: options.missingManagementReference ? [] : structuredClone(reference.object) };
                if (request.organization_id === 'source') return { object: (options.missingCredential && request.array === 'keys') || (options.missingProfile && request.array !== 'keys') ? [] : [request.array === 'keys' ? credential : sourceUser] };
                if (options.duplicateHost && request.array === 'organizations' && request.filter?.query?.['host.name']) return { object: [{ _id: 'taken' }] };
                if (request.array === 'workflows' && request.organization_id === 'platform') return { object: [definition, ...organizationSeed.object, ...clusterSeed.object, ...repositorySeed.object].filter(item => item.name === request.filter.query.name && !(options.missingRepositoryWorkflow && item.name === 'create-organization-repository') && !(options.missingClusterWorkflow && item.name === 'create-organization-cluster')) };
                if (request.array === 'workflows') return { object: structuredClone(stored.filter(item => item.name === request.filter.query.name)) };
                if (request.array === 'apis') return { object: [{ _id: 'github-api', owner: 'managed-org' }] };
                const id = request.object?.[0]?._id || request.filter?.query?._id;
                return { object: structuredClone(id ? stored.filter(item => item._id === id) : stored) };
            }
            if (options.credentialActivationError && request.array === 'apis' && request.object?.enabled === true &&
                stored.some(item => item._id === request.object._id && item.authentication === 'ssh-deploy-key')) return { success: false };
            if (options.failedManagementArray === request.array && request.method === 'object.create') return { success: false };
            if (options.failedClusterScope === request.organization_id && request.array === 'clusters') return { success: false };
            if ((options.failedRepositoryClusterScope === request.organization_id ||
                (options.failedRepositoryClusterScope === 'any-tenant' && request.organization_id !== 'platform')) &&
                request.array === 'clusters' && request.object?.repositories) return { success: false };
            if (options.failTenantCluster && request.array === 'clusters' && request.organization_id !== 'platform') return { success: false };
            if (options.failedTenantArray === request.array && request.organization_id !== 'platform') return { success: false };
            const objects = Array.isArray(request.object) ? request.object : [request.object];
            for (const object of objects) {
                if (object.bootstrapStorage && request.organization_id === 'platform') {
                    assert.equal(request.database, 'platform');
                    if (options.persistenceError) return { error: ['Write failed'] };
                    if (options.skipPersistence) return { object: [object] };
                }
                const index = stored.findIndex(item => item._id === object._id);
                const value = structuredClone(object);
                if (index < 0) stored.push(value);
                else stored[index] = { ...stored[index], ...value };
            }
            records.set(key, stored);
            return { object: structuredClone(objects) };
        } },
        api: { async send(request, context) {
            apiCalls.push(structuredClone(request));
            if (request.endpoint === options.failedEndpoint) return options.apiFailure || { error: ['Provider failed'] };
            assert.equal(context.organization_id, 'platform');
            if (options.bootstrap && request.api === 'custom-storage') return { data: structuredClone(options.bootstrap) };
            if (request.endpoint === 'create-repository-from-template') return { data: { default_branch: 'main', clone_url: `https://github.com/managed-org/${request.data.name}.git`, html_url: `https://github.com/managed-org/${request.data.name}` } };
            if (request.endpoint === 'create-repository-deploy-key') return { data: { id: 123, read_only: options.readOnlyDeployKey || false } };
            if (request.endpoint === 'get-github-ssh-host-keys') return { data: { ssh_keys: options.missingHostKeys ? [] : ['ssh-ed25519 AAAA'] } };
            if (request.endpoint === 'get-repository-file') return { data: { sha: 'original-config-sha' } };
            if (request.endpoint === 'update-repository-file') return { data: { commit: { sha: 'configured-commit' } } };
            if (request.endpoint === 'create-repository-branch') return { data: { ref: `refs/heads/${request.data.branch}`, object: { sha: request.data.sha } } };
            if (request.endpoint === 'create-organization') return { data: { organization: { id: 'atlas-org' } } };
            if (request.endpoint === 'create-project') return { data: { id: 'atlas-project' } };
            if (request.endpoint === 'create-database-user') assert.ok(request.data.password, 'Generated password must reach the endpoint');
            if (request.endpoint === 'get-cluster-connection') return { data: options.noConnection ? {} : {
                stateName: 'IDLE', connectionStrings: { standardSrv: 'mongodb+srv://cluster.test' }
            } };
            return { data: {} };
        } }
    };
    await Workflows.init(runtime);
    runtime.workflow = Workflows;
    await initOrganizations(runtime, { databaseProvisioning: {
        cloudProvider: 'AWS', regionName: 'US_EAST_1', cidrBlock: '192.0.2.0/24',
        organizationId: 'forged-id', ...options.settings
    }, ...(options.clusterProvisioning && { clusterProvisioning: options.clusterProvisioning }) });
    await runtime.organizations.create({
        socket: { organization_id: 'source', user_id: options.anonymous ? undefined : 'user-1', host: 'platform.test', ...(options.expired && { expires: 1 }) },
        organization_id: 'forged-platform', user: { _id: 'forged-user' }, key: [{ admin: true }],
        organization: options.organization || { name: 'Tenant', host: [{ name: 'tenant.test' }], bootstrapStorage: { provider: 'forged' }, cluster_id: 'forged-cluster', git: { repository: 'forged-repository' } }
    });
    return { response, records, requests, apiCalls, creationCalls };
}

test('signup awaits creation with the complete saved cluster before returning the tenant sign-in redirect', async t => {
    let completeCreation, started;
    const pending = new Promise(resolve => { completeCreation = resolve; });
    const entered = new Promise(resolve => { started = resolve; });
    let finished = false;
    const operation = run(t, { onCreateServer: async () => { started(); await pending; } });
    operation.then(() => { finished = true; });
    await entered;
    assert.equal(finished, false);
    completeCreation();
    const { response, creationCalls } = await operation;
    assert.equal(response.success, true, response.message);
    assert.equal(creationCalls.length, 1);
    assert.equal(creationCalls[0]._id, response.organization.cluster_id);
    assert.equal(response.redirect, 'https://tenant.test/auth/');
    assert.equal(JSON.stringify(response).includes('not-for-client'), false);
    assert.equal(response.data, undefined);
});

test('server creation rejection aborts organization success and provides no redirect', async t => {
    const { response, records, creationCalls } = await run(t, { creationError: true });
    assert.equal(creationCalls.length, 1);
    assert.equal(response.success, false);
    assert.equal(response.error, 'Server creation failed');
    assert.equal(response.redirect, undefined);
    assert.equal(records.get('platform:organizations')[0].provisioning.status, 'failed');
    assert.equal(records.get('platform:organizations')[0].provisioning.repository.status, 'ready');
});

test('the upload seed retains the existing static ID and disabled state', () => {
    assert.equal(seed.array, 'workflows');
    assert.equal(seed.upsert, true);
    assert.equal(seed.object[0]._id, '6ae8f65df9ff5cc3e661eeb3');
    assert.equal(seed.object[0].enabled, false);
});

test('the real Atlas workflow stores and returns its bootstrap before tenant initialization', async t => {
    const { response, records, requests, apiCalls } = await run(t);
    assert.equal(response.success, true, response.error);
    const organization = records.get('platform:organizations')[0];
    assert.notEqual(organization._id, 'forged-id');
    const bootstrap = organization.bootstrapStorage;
    assert.equal(bootstrap.name, 'mongodb');
    assert.equal(bootstrap.provider, 'mongodb');
    assert.match(bootstrap.connectionString, /^mongodb\+srv:\/\/cocreate-.*:.*@cluster.test$/);
    assert.deepEqual(organization.atlas, { organizationId: 'atlas-org', projectId: 'atlas-project', clusterName: `cocreate-${organization._id}-production` });
    assert.deepEqual(records.get(`${organization._id}:organizations`)[0].bootstrapStorage, bootstrap);
    assert.equal(records.get(`${organization._id}:contacts`)[0].password, undefined);
    assert.equal(records.get(`${organization._id}:keys`).find(item => item.type === 'user').password, 'existing-hash');
    const writes = requests.filter(item => item.method === 'object.update' && item.organization_id === 'platform' && item.object.bootstrapStorage);
    assert.equal(writes.length, 1, 'Only the workflow persists bootstrap credentials');
    assert.ok(requests.indexOf(writes[0]) < requests.findIndex(item => item.organization_id === organization._id));
    assert.equal(apiCalls[0].data.organizationName, organization._id);
    assert.equal(organization.git.checkout_branch, 'main');
    const platformCluster = records.get('platform:clusters')[0];
    const tenantCluster = records.get(`${organization._id}:clusters`)[0];
    assert.deepEqual(platformCluster, tenantCluster);
    assert.equal(platformCluster.name, organization._id);
    assert.deepEqual(platformCluster.manager, { organization_id: 'platform', host: 'platform.test', for: organization._id });
    const initialClusterWrite = requests.find(request => request.array === 'clusters' && request.object?.manager);
    assert.deepEqual(initialClusterWrite.object.repositories, []);
    assert.equal(records.has('platform:servers'), false);
    assert.equal(platformCluster.type, 'organization');
    assert.equal(platformCluster.host, 'tenant.test');
    assert.equal(platformCluster.scaleIn.minClusterSize, 0);
    assert.deepEqual(platformCluster.initialDeployment, {
        cloud: '65f8ca227b39a3c1a8904e02', region: 'us-east-1', vmType: 't3a.small'
    });
    assert.equal(organization.cluster_id, platformCluster._id);
    assert.equal(records.get(`${organization._id}:organizations`)[0].cluster_id, platformCluster._id);
    assert.equal(response.organization.cluster_id, platformCluster._id);
    const managementKey = records.get('platform:keys').find(item => item.cluster_id === platformCluster._id);
    assert.match(managementKey.key, /^[a-f0-9-]{36}$/);
    assert.equal(managementKey.tenant_organization_id, organization._id);
    assert.equal(managementKey.admin, false);
    assert.equal(managementKey.default, false);
    assert.deepEqual(managementKey.methods, managementKeySeed.object[0].methods);
    assert.equal(records.get(`${organization._id}:apis`).some(item => item.provider === 'CoCreate'), false);
    assert.equal(records.has(`${organization._id}:endpoints`), false);
    assert.equal(JSON.stringify(response).includes(managementKey.key), false);
    assert.equal(JSON.stringify(apiCalls).includes(managementKey.key), false);
    const github = apiCalls.filter(item => item.api === 'github-organizations');
    assert.deepEqual(github.map(item => item.endpoint), ['create-repository-from-template', 'get-repository-file', 'update-repository-file', 'create-repository-branch', 'create-repository-branch', 'get-github-ssh-host-keys', 'create-repository-deploy-key']);
    const config = JSON.parse(github[2].data.content.slice('export default '.length).trim().replace(/;$/, ''));
    assert.equal(config.organization_id, organization._id);
    assert.deepEqual(config.host.$branch, { main: 'wss://tenant.test', dev: 'wss://dev.tenant.test', test: 'wss://test.tenant.test' });
    assert.equal(config.host.$branch[platformCluster.repositories[0].branch], `wss://${platformCluster.host}`);
    assert.equal(config.apikey, '');
    assert.equal(config.directories[0].object.src, '{{source}}');
    assert.equal(github[3].data.sha, github[4].data.sha);
    assert.equal(response.organization.bootstrapStorage, undefined);
    const repositoryCredential = records.get(`${organization._id}:apis`).find(item => item.authentication === 'ssh-deploy-key');
    assert.equal(repositoryCredential.authentication, 'ssh-deploy-key');
    assert.equal(repositoryCredential.enabled, true);
    assert.equal(repositoryCredential.deploy_key_id, 123);
    assert.equal(repositoryCredential._id, organization.git.api);
    assert.equal(repositoryCredential.repository_url, organization.git.clone_url);
    assert.deepEqual(platformCluster.repositories, [{
        url: organization.git.clone_url, api: repositoryCredential._id,
        branch: 'main', remote: 'origin', localFsRoot: '../', directory: organization.git.repository,
        onStartup: 'clone', onShutdown: 'commit-and-push', startupTimeoutMs: 60000, shutdownTimeoutMs: 10000,
        initialUpload: { enabled: true, completed: false }
    }]);
    assert.equal(repositoryCredential.expires_at, undefined);
    assert.match(repositoryCredential.privateKey, /BEGIN RSA PRIVATE KEY/);
    assert.equal(JSON.stringify(response).includes(repositoryCredential.privateKey), false);
    assert.equal(JSON.stringify(apiCalls).includes(repositoryCredential.privateKey), false);
    assert.equal(records.has('platform:apis'), false);
    assert.equal(JSON.stringify(response).includes(bootstrap.connectionString), false);
});

for (const scope of ['platform', 'tenant']) {
    test(`failed ${scope} cluster repository registration prevents signup readiness`, async t => {
        const { response } = await run(t, { failedRepositoryClusterScope: scope === 'platform' ? 'platform' : 'any-tenant' });
        assert.equal(response.success, false);
    });
}

for (const options of [{ missingManagementReference: true }, { failedManagementArray: 'keys' }]) {
    test(`management access failure cannot complete signup: ${JSON.stringify(options)}`, async t => {
        const { response, records, apiCalls } = await run(t, options);
        assert.equal(response.success, false);
        const organization = records.get('platform:organizations')[0];
        assert.equal(organization.provisioning.cluster.status, 'ready');
        assert.equal(organization.provisioning.management.status, 'failed');
        assert.equal(apiCalls.some(call => call.api === 'github-organizations'), false);
    });
}

for (const bootstrap of [
    { name: 'primary', provider: 'postgresql', connectionUri: 'postgres://test', ssl: { rejectUnauthorized: true }, custom: ['a', 3] },
    { name: 'remote', provider: 'sqlite', databaseUrl: 'libsql://test', authToken: 'test-only', options: { nested: { flag: true } } }
]) {
    test(`native creation and CRUD resolution preserve arbitrary ${bootstrap.provider} bootstrap fields`, async t => {
        const { response, records } = await run(t, { bootstrap });
        assert.equal(response.success, true, response.error);
        const organization = records.get('platform:organizations')[0];
        assert.deepEqual(organization.bootstrapStorage, bootstrap);
        assert.deepEqual(records.get(`${organization._id}:organizations`)[0].bootstrapStorage, bootstrap);
        assert.equal(organization.host[0].storage, bootstrap.name);
        assert.equal(await getStorage({ organization, organizationId: organization._id }), organization.bootstrapStorage);
        assert.equal(await getStorage({ organization, organizationId: organization._id, name: bootstrap.name }), organization.bootstrapStorage);
        assert.equal(response.organization.bootstrapStorage, undefined);
    });
}

for (const [name, options, message] of [
    ['missing provider URI', { noConnection: true }, /usable connection string/],
    ['failed bootstrap write', { persistenceError: true }, /persist bootstrap/],
    ['workflow did not persist its output', { skipPersistence: true }, /did not persist/],
    ['malformed bootstrap envelope', { bootstrap: { name: 'test', endpoint: 'https://test' } }, /non-empty name and provider/],
    ['missing Atlas configuration', { settings: { cloudProvider: '' } }, /requires cloudProvider/]
]) {
    test(`${name} cannot complete signup or initialize tenant storage`, async t => {
        const { response, records, requests } = await run(t, options);
        assert.equal(response.success, false);
        assert.match(response.error, message);
        assert.equal(records.get('platform:organizations')[0].provisioning.status, 'failed');
        assert.equal(requests.some(item => item.organization_id !== 'platform' && item.organization_id !== 'source'), false);
    });
}

for (const endpoint of ['create-organization', 'create-project', 'create-cluster', 'add-project-ip-access-list-entry', 'create-database-user', 'get-cluster-connection']) {
    test(`a failed ${endpoint} request never attaches bootstrap storage`, async t => {
        const { response, records, apiCalls } = await run(t, { failedEndpoint: endpoint });
        assert.equal(response.success, false);
        assert.match(response.error, /Atlas .* failed/);
        assert.equal(records.get('platform:organizations')[0].bootstrapStorage, undefined);
        assert.equal(apiCalls.at(-1).endpoint, endpoint);
    });
}

test('an explicit provider rejection never attaches bootstrap storage', async t => {
    const { response, records } = await run(t, { failedEndpoint: 'create-database-user', apiFailure: { success: false } });
    assert.equal(response.success, false);
    assert.match(response.error, /rejected the request/);
    assert.equal(records.get('platform:organizations')[0].bootstrapStorage, undefined);
});

for (const option of ['anonymous', 'expired', 'missingCredential', 'missingProfile', 'duplicateHost', 'missingRepositoryWorkflow']) {
    test(`signup rejects ${option} before platform creation or provider calls`, async t => {
        const { response, requests, apiCalls } = await run(t, { [option]: true });
        assert.equal(response.success, false);
        assert.equal(requests.some(request => request.method !== 'object.read'), false);
        assert.equal(apiCalls.length, 0);
    });
}

for (const field of ['host[0].name', 'host.0.name']) {
    test(`signup accepts the declarative ${field} hostname shape`, async t => {
        const { response } = await run(t, { organization: { name: 'Tenant', [field]: 'tenant.test' } });
        assert.equal(response.success, true, response.error);
    });
}

for (const failedEndpoint of ['create-repository-from-template', 'get-repository-file', 'update-repository-file', 'create-repository-branch', 'create-repository-deploy-key', 'get-github-ssh-host-keys']) {
    test(`signup never reports ready after ${failedEndpoint} fails`, async t => {
        const { response, records } = await run(t, { failedEndpoint });
        assert.equal(response.success, false);
        const organization = records.get('platform:organizations')[0];
        assert.equal(organization.provisioning.status, 'failed');
        assert.equal(organization.provisioning.database.status, 'ready');
        assert.equal(organization.provisioning.tenant.status, 'ready');
        assert.equal(organization.provisioning.repository.status, 'failed');
        assert.equal(organization.git, undefined);
    });
}

for (const failedTenantArray of ['organizations', 'contacts', 'keys']) {
    test(`rejected tenant ${failedTenantArray} writes stop signup before repository creation`, async t => {
        const { response, apiCalls } = await run(t, { failedTenantArray });
        assert.equal(response.success, false);
        assert.equal(apiCalls.some(call => call.api === 'github-organizations'), false);
    });
}

for (const option of ['readOnlyDeployKey', 'missingHostKeys', 'credentialActivationError']) {
    test(`signup cannot finish with ${option}`, async t => {
        const { response, records } = await run(t, { [option]: true });
        assert.equal(response.success, false);
        const credentials = [...records.entries()].filter(([key]) => key.endsWith(':apis')).flatMap(([, value]) => value).filter(item => item.authentication === 'ssh-deploy-key');
        assert.equal(credentials.length, 1);
        assert.equal(credentials[0].enabled, false);
        assert.equal(credentials[0].status, 'pending');
        assert.equal(JSON.stringify(response).includes(credentials[0].privateKey), false);
    });
}

for (const options of [{ missingClusterWorkflow: true }, { failedClusterScope: 'platform' }, { failTenantCluster: true }]) {
    test(`cluster failure cannot complete signup: ${JSON.stringify(options)}`, async t => {
        const { response, apiCalls } = await run(t, options);
        assert.equal(response.success, false);
        assert.equal(apiCalls.some(call => call.api === 'github-organizations'), false);
    });
}

test('cluster deployment settings come from platform configuration, with identity fixed by signup', async t => {
    const { response, records } = await run(t, { clusterProvisioning: {
        _id: 'forged-cluster', name: 'forged-name', type: 'forged-type', host: 'forged.test',
        organization_id: 'forged-owner', manager: { organization_id: 'forged-manager', host: 'forged.test', for: 'forged-tenant' }, clouds: ['cloud-api'], storage: 'storage-api', routing: 'routing-api',
        initialDeployment: { cloud: 'custom-cloud', region: 'custom-region', vmType: 'custom-vm' },
        scaleIn: { minClusterSize: 1 }
    } });
    assert.equal(response.success, true, response.message);
    const cluster = records.get('platform:clusters')[0];
    assert.notEqual(cluster._id, 'forged-cluster');
    assert.equal(cluster.name, response.organization._id);
    assert.equal(cluster.type, 'organization');
    assert.equal(cluster.host, 'tenant.test');
    assert.equal(cluster.organization_id, undefined);
    assert.deepEqual(cluster.manager, { organization_id: 'platform', host: 'platform.test', for: response.organization._id });
    assert.deepEqual(cluster.clouds, ['cloud-api']);
    assert.equal(cluster.storage, 'storage-api');
    assert.equal(cluster.routing, 'routing-api');
    assert.equal(cluster.scaleIn.minClusterSize, 1);
    assert.deepEqual(cluster.initialDeployment, { cloud: 'custom-cloud', region: 'custom-region', vmType: 'custom-vm' });
    const tenantCluster = records.get(`${cluster.manager.for}:clusters`)[0];
    assert.deepEqual(tenantCluster.initialDeployment, cluster.initialDeployment);
    assert.deepEqual(tenantCluster.manager, cluster.manager);
    assert.equal(Object.hasOwn(cluster.manager, 'initialDeployment'), false);
    assert.equal(Object.hasOwn(cluster.manager, 'repositories'), false);
    assert.ok(cluster.repositories.length > 0);
    assert.equal(records.has('platform:servers'), false);
    assert.equal(records.has(`${cluster.manager.for}:servers`), false);
});

for (const minimum of [-1, '0', 0.5]) {
    test(`invalid initial cluster minimum ${JSON.stringify(minimum)} is rejected before provisioning`, async t => {
        const { response, records, apiCalls } = await run(t, { clusterProvisioning: { scaleIn: { minClusterSize: minimum } } });
        assert.equal(response.success, false);
        assert.match(response.message, /minimum cluster size/);
        assert.equal(records.size, 0);
        assert.equal(apiCalls.length, 0);
    });
}

for (const initialDeployment of [null, '', { cloud: '' }, { region: '' }, { vmType: '' }]) {
    test(`invalid initial deployment is rejected before signup provisioning: ${JSON.stringify(initialDeployment)}`, async t => {
        const { response, records, apiCalls } = await run(t, { clusterProvisioning: { scaleIn: { minClusterSize: 0 }, initialDeployment } });
        assert.equal(response.success, false);
        assert.match(response.message, /initialDeployment/);
        assert.equal(records.size, 0);
        assert.equal(apiCalls.length, 0);
    });
}
