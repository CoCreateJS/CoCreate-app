import assert from 'node:assert/strict';
import test from 'node:test';
import { createPrivateKey } from 'node:crypto';
import { init } from '../../CoCreate-modules/workflows/src/server.js';
import onboarding from '../src/apps/workflows/config/onboarding.js';
import organization from '../src/apps/workflows/config/organization.js';
import storage from '../src/apps/workflows/config/storage.js';
import repository from '../src/apps/workflows/config/repository.js';
import cluster from '../src/apps/workflows/config/cluster.js';

async function setup(options = {}) {
    const definitions = structuredClone([...onboarding.object, ...organization.object, ...storage.object, ...repository.object, ...cluster.object]);
    definitions.find(d => d.name === 'createManagedMongoDB').enabled = !options.disabledStorage;
    const settings = { storageProvisioning: { cloudProvider: 'AWS', regionName: 'US_EAST_1', cidrBlock: '192.0.2.0/24' }, clusterProvisioning: { scaleIn: { minClusterSize: 0 } } };
    if (options.missingNetwork) delete settings.storageProvisioning.cidrBlock;
    const records = new Map([
        ['platform:servers_config', [{ _id: 'settings', type: 'organizations', enabled: true, config: settings }]],
        ['platform:keys', [{ _id: 'user-key', key: 'user', type: 'user', array: 'contacts', email: 'user@test', password: 'stored-hash' },
            { _id: 'default-key', type: 'key', default: true, methods: { object: { read: { contacts: { '_id.$eq': '$user_id' } } }, signIn: true } }]],
        ['platform:contacts', [{ _id: 'user', name: 'User', location: options.noLocation ? undefined : { latitude: 20, longitude: 30 } }]]
    ]);
    const requests = [], calls = [], sent = [];
    let id = 0;
    const server = {
        organization_id: 'platform', host: 'platform.test',
        send: payload => { sent.push(payload); return payload; },
        socket: { sockets: new Map([['socket', { organization_id: 'platform', user_id: 'user', clientInfo: options.noLocation || options.profileLocation ? undefined : { latitude: 0, longitude: 0 } }]]) },
        crud: { async send(request) {
            requests.push(structuredClone(request));
            if (request.array === 'workflows') return { object: definitions.filter(d => d.name === request.filter.query.name) };
            const key = `${request.organization_id}:${request.array}`;
            const list = records.get(key) || [];
            if (request.method === 'object.read') {
                const query = request.filter?.query || {};
                return { object: structuredClone(list.filter(record => Object.entries(query).every(([name,value]) =>
                    name === 'host.name' ? record.host?.some(h => h.name === value) : record[name] === value))) };
            }
            if (options.failTenantCluster && request.array === 'clusters' && request.organization_id !== 'platform') return { error: ['Tenant write failed'] };
            const entries = Array.isArray(request.object) ? request.object : [request.object];
            const result = [];
            for (const input of entries) {
                const value = structuredClone(input);
                value._id ||= (++id).toString(16).padStart(24, '0');
                const previous = list.find(item => item._id === value._id);
                if (previous) Object.assign(previous, value);
                else list.push(value);
                result.push(structuredClone(previous || value));
            }
            records.set(key, list);
            return { object: result };
        } },
        api: { async send(request, context) {
            calls.push(structuredClone(request));
            assert.equal(context.organization_id, 'platform');
            if (request.endpoint === options.failedEndpoint) return { error: ['Provider failed'] };
            switch (request.endpoint) {
                case 'create-organization': return { data: { organization: { id: 'atlas-org' } } };
                case 'create-project': return { data: { id: 'atlas-project' } };
                case 'create-cluster': return { data: { id: 'atlas-cluster' } };
                case 'get-cluster-connection': return { data: options.pendingDatabase ? {} : { connectionStrings: { standardSrv: 'mongodb+srv://cluster.test' } } };
                case 'create-repository-from-template': return { data: { full_name: `CoCreateJS/${request.data.name}`, default_branch: 'main', ssh_url: `git@github.com:CoCreateJS/${request.data.name}.git` } };
                case 'create-repository-deploy-key': return { data: { id: 123, read_only: false } };
                case 'get-github-ssh-host-keys': return { data: { ssh_keys: ['ssh-ed25519 AAAA'] } };
                default: return { data: {} };
            }
        } }
    };
    const service = await init(server);
    const input = { organization: { name: 'Tenant', host: [{ name: 'tenant.cocreatejs.com' }], owner: 'forged', cluster_id: 'forged', bootstrapStorage: { provider: 'forged' } }, manager: { apiKey: 'forged-key' }, clouds: ['forged'] };
    const response = await service.run({ method: 'workflow.onboardOrganization', organization_id: 'platform', host: 'platform.test',
        user_id: options.anonymous ? undefined : 'user', socketId: 'socket', clientId: 'client', uuid: 'request', onboardOrganization: options.objectInput ? input : [input] });
    return { response, records, requests, calls, sent };
}

test('signup onboarding passes real child outputs, seeds both scopes and returns only navigation data', async () => {
    const { response, records, calls, sent } = await setup();
    assert.equal(response.error, undefined, JSON.stringify(response.error));
    const result = response.onboardOrganization;
    assert.equal(result.status, 'configured');
    assert.equal(result.redirect, 'https://tenant.cocreatejs.com/auth/');
    const org = records.get('platform:organizations')[0];
    assert.equal(org.owner, 'user');
    assert.deepEqual(org.location, { latitude: 0, longitude: 0 });
    const saved = records.get('platform:clusters')[0];
    assert.equal(saved._id, result.clusterId);
    assert.equal(saved.managedOrganization, result.organizationId);
    assert.equal(saved.deployment, undefined);
    assert.deepEqual(saved.dns, []);
    assert.equal(saved.scaleIn.minClusterSize, 0);
    assert.equal(saved.scaleIn.drainWaitSeconds, 60);
    assert.equal(saved.repositories[0].branch, 'main');
    assert.equal(saved.repositories[0].initialUpload.completed, false);
    assert.deepEqual(records.get(`${org._id}:clusters`)[0], saved);
    assert.equal(records.get(`${org._id}:organizations`)[0].cluster_id, saved._id);
    const apis = records.get(`${org._id}:apis`);
    assert.equal(saved.storage, apis.find(api => api.type === 'storage')._id);
    const git = apis.find(api => api.authentication === 'ssh-deploy-key');
    assert.equal(saved.repositories[0].api, git._id);
    assert.equal(git.repository_url, saved.repositories[0].url);
    assert.equal(git.knownHosts, 'github.com ssh-ed25519 AAAA');
    assert.equal(createPrivateKey(git.privateKey).asymmetricKeyType, 'rsa');
    const tenantKeys = records.get(`${org._id}:keys`);
    assert.deepEqual(tenantKeys.find(key => key.type === 'user').roles, [tenantKeys.find(key => key.type === 'role')._id]);
    assert.equal(tenantKeys.find(key => key.type === 'user').password, 'stored-hash');
    assert.equal(tenantKeys.find(key => key.default).methods.object.read.contacts['_id.$eq'], '$user_id');
    const managed = records.get('platform:keys').find(key => key.managedOrganization === org._id);
    const encoded = saved.startupScript.match(/printf '%s' '([^']+)' \| base64 --decode > \/root\/CoCreate.config.js/);
    assert.ok(encoded);
    const boot = JSON.parse(Buffer.from(encoded[1], 'base64'));
    assert.deepEqual(boot.manager, { organization_id: 'platform', host: 'platform.test', apiKey: managed.key });
    assert.deepEqual(boot.storage, org.bootstrapStorage);
    assert.equal(JSON.stringify(response).includes(managed.key), false);
    assert.equal(JSON.stringify(response).includes('stored-hash'), false);
    assert.equal(JSON.stringify(response).includes('PRIVATE KEY'), false);
    assert.deepEqual(sent, [response], 'Child credentials remain internal; only the final result is sent');
    assert.equal(calls.find(call => call.endpoint === 'create-project').data.atlasOrganizationId, 'atlas-org');
});
for (const options of [{ objectInput: true }, { profileLocation: true }, { anonymous: true }, { missingNetwork: true }, { disabledStorage: true }, { noLocation: true },
    { failedEndpoint: 'create-repository-from-template' }, { pendingDatabase: true }, { failTenantCluster: true }]) {
    test(`onboarding reports incomplete prerequisites or failed stages: ${JSON.stringify(options)}`, async () => {
        const { response, calls, records } = await setup(options);
        if (options.objectInput || options.profileLocation) return assert.equal(response.error, undefined, JSON.stringify(response.error));
        assert.ok(response.error?.length, JSON.stringify(response));
        assert.equal(response.onboardOrganization?.status, undefined);
        if (options.anonymous || options.missingNetwork || options.disabledStorage || options.noLocation) {
            assert.equal(calls.length, 0);
            assert.equal(records.has('platform:organizations'), false);
        }
    });
}
