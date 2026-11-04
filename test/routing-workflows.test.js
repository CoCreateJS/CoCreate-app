import assert from 'node:assert/strict';
import test from 'node:test';
import Workflows from '../../CoCreate-modules/workflows/src/server.js';
import seed from '../src/apps/workflows/config/routing.js';
import config from '../../CoCreate-modules/config/src/server.js';
import Routing from '../../CoCreate-modules/cluster/src/routing.js';

async function run(options = {}) {
    const requests = [];
    const calls = [];
    const server = { _id: 'server-1', cluster_id: 'cluster-1', ip: '203.0.113.1', host: 'platform.test',
        infrastructure: { provider: 'aws', region: 'us-east-1' },
        location: { latitude: 38.9, longitude: -77.4 }, ...options.server };
    const cluster = { _id: 'cluster-1', routing: 'routing-api-1', ...options.cluster };
    const provider = { _id: 'routing-api-1', name: options.apiName || 'arbitrary-routing-provider',
        type: 'routing', enabled: true, ...options.api };
    const runtime = {
        ...server, id: server._id, isPrimary: true, organization_id: 'platform', workflow: Workflows,
        crud: { send: async request => {
            requests.push(request);
            assert.equal(request.method, 'object.read');
            assert.equal(request.organization_id, 'platform');
            assert.equal(request.host, 'platform.test');
            assert.equal(request.database, undefined);
            const query = request.filter.query;
            if (request.array === 'workflows') return { object: seed.object.filter(item => item.name === query.name) };
            if (request.array === 'servers') {
                if (options.readError) return { error: ['Inventory unavailable'], object: [server] };
                return { object: query._id === server._id ? [server] : [] };
            }
            if (request.array === 'clusters') return { object: query._id === cluster._id ? [cluster] : [] };
            if (request.array === 'apis') {
                assert.deepEqual(request.filter.key, { _id: 1, name: 1 });
                return { object: provider._id === query._id && provider.type === query.type &&
                    provider.enabled === query.enabled ? [provider] : [] };
            }
            if (request.array === 'endpoints') {
                assert.equal(query.api_id, provider._id);
                assert.ok(['add-routing', 'remove-routing'].includes(query.name));
                assert.equal(query.enabled, true);
                return { object: options.noEndpoint === query.name ? [] : [{ _id: query.name }] };
            }
            assert.fail(`Unexpected array: ${request.array}`);
        } },
        api: { send: async (request, context) => {
            calls.push(request);
            assert.equal((context || request).organization_id, 'platform');
            assert.equal((context || request).host, 'platform.test');
            if (options.throwApi) throw new Error('Provider request failed');
            return options.response || { data: { zoneId: 123, recordId: 456 } };
        } }
    };
    await Workflows.init(runtime);
    const result = options.initializeOnly ? undefined : await Workflows.run({
        method: 'workflow.configure-cluster-routing', organization_id: 'platform', host: 'platform.test',
        'configure-cluster-routing': [{ server_id: 'server-1', cluster_id: 'forged-cluster', ip: '192.0.2.99',
            api: 'forged-api', ...options.input }]
    });
    return { result, calls, requests, server, runtime };
}

test('only the initialization workflow is seeded; there is no removeRouting workflow', () => {
    assert.equal(seed.method, 'object.update');
    assert.equal(seed.array, 'workflows');
    assert.deepEqual(seed.object.map(item => item.name), ['configure-cluster-routing']);
});

test('initialization uses the stored cluster provider and returns direct cleanup with registration IDs', async () => {
    const { result, calls, server } = await run();
    assert.equal(result.error, undefined);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].api, 'arbitrary-routing-provider');
    assert.equal(calls[0].endpoint, 'add-routing');
    assert.equal(calls[0].method, undefined);
    const data = { server_id: server._id, cluster_id: server.cluster_id, ip: server.ip,
        host: server.host, infrastructure: server.infrastructure, location: server.location };
    assert.deepEqual(calls[0].data, data);
    assert.deepEqual(result['configure-cluster-routing'][0].remove, {
        api: 'arbitrary-routing-provider', endpoint: 'remove-routing',
        data: { ...data, registration: { zoneId: 123, recordId: 456 } }
    });
});

test('another provider uses the same initialization and removal endpoint aliases', async () => {
    const { result, calls } = await run({ apiName: 'another-provider' });
    assert.equal(result.error, undefined);
    assert.equal(calls[0].api, 'another-provider');
    assert.equal(result['configure-cluster-routing'][0].remove.api, 'another-provider');
});

test('the real node lifecycle executes one workflow and performs no CRUD lookup during removal', async t => {
    t.mock.method(config, 'get', async () => undefined);
    t.mock.method(config, 'query', async () => undefined);
    const { runtime, requests, calls } = await run({ initializeOnly: true });
    const routing = await Routing.init(runtime);
    await routing.add();
    const initialReads = requests.length;
    runtime.ip = '192.0.2.99';
    await routing.remove('SIGTERM');
    assert.equal(requests.length, initialReads, 'Direct cleanup must not load another workflow or inventory');
    assert.equal(requests.filter(request => request.array === 'workflows').length, 1);
    assert.deepEqual(calls.map(request => request.endpoint), ['add-routing', 'remove-routing']);
    assert.equal(calls[1].data.ip, '203.0.113.1');
    assert.deepEqual(calls[1].data.registration, { zoneId: 123, recordId: 456 });
    assert.equal(calls[1].data.reason, 'SIGTERM');
});

for (const [name, options, message] of [
    ['missing server ID', { input: { server_id: '' } }, /requires a server ID/],
    ['missing server', { input: { server_id: 'absent' } }, /server record is unavailable/],
    ['failed inventory read', { readError: true }, /server record is unavailable/],
    ['missing cluster ID', { server: { cluster_id: '' } }, /requires a cluster ID/],
    ['missing cluster', { server: { cluster_id: 'absent' } }, /cluster record is unavailable/],
    ['missing routing selection', { cluster: { routing: '' } }, /requires a routing API record ID/],
    ['disabled routing API', { api: { enabled: false } }, /enabled routing API is unavailable/],
    ['wrong API type', { api: { type: 'cloud' } }, /enabled routing API is unavailable/],
    ['missing add alias', { noEndpoint: 'add-routing' }, /requires an enabled 'add-routing' endpoint/],
    ['missing remove alias', { noEndpoint: 'remove-routing' }, /requires an enabled 'remove-routing' endpoint/],
    ['missing address', { server: { ip: '' } }, /requires an IP address/]
]) {
    test(`${name} stops initialization before any API request`, async () => {
        const { result, calls } = await run(options);
        assert.match(result.error[0], message);
        assert.equal(calls.length, 0);
    });
}

test('a failed registration still returns identity-based cleanup prepared beforehand', async () => {
    const { result } = await run({ throwApi: true });
    assert.match(result.error[0], /Provider request failed/);
    assert.equal(result['configure-cluster-routing'][0].remove.endpoint, 'remove-routing');
    assert.equal(result['configure-cluster-routing'][0].remove.data.server_id, 'server-1');
    assert.equal(result['configure-cluster-routing'][0].remove.data.registration, null);
});

for (const response of [{ error: ['Provider rejected the request'] }, { success: false }]) {
    test(`provider failure ${JSON.stringify(response)} remains a workflow error`, async () => {
        const { result } = await run({ response });
        assert.match(result.error[0], /add-routing.*(failed|rejected)/);
        assert.equal(result['configure-cluster-routing'][0].result, undefined);
    });
}
