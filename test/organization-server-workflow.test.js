import assert from 'node:assert/strict';
import test from 'node:test';
import { astAsync } from '@cocreate/utils';
import Config from '@cocreate/config';
import Workflows from '../../CoCreate-modules/workflows/src/server.js';
import { init as initManager } from '../../CoCreate-modules/cluster/src/manager.js';
import { ServerMesh } from '../../CoCreate-modules/cluster/src/mesh/index.js';
import serverSeed from '../src/apps/workflows/config/server.js';
import startupSeed from '../src/apps/server-configs/config/autoscaler.js';
import aws from '../src/apps/endpoints/config/AWS/data.js';
import providers from '../src/apps/endpoints/config/data.js';

const tenant = 'aaaaaaaaaaaaaaaaaaaaaaaa', clusterId = 'bbbbbbbbbbbbbbbbbbbbbbbb';

async function run(t, options = {}) {
    const platform = 'cccccccccccccccccccccccc';
    const records = new Map(), requests = [], apiCalls = [];
    const cluster = { _id: clusterId, name: 'Production', manager: { organization_id: platform, host: 'platform.test', for: tenant }, type: 'organization', host: 'tenant.test', initialDeployment: { cloud: 'cloud-api', region: 'us-east-1', vmType: 't3a.small' }, storage: 'storage-api' };
    const tenantStorage = { name: 'tenant-storage', provider: 'mongodb', connectionString: 'mongodb://tenant-only.test' };
    const endpoint = aws.object.find(item => item.name === 'create-instance');
    t.mock.method(Config, 'get', () => undefined);
    t.mock.method(Config, 'query', async query => query.type === 'organization-connection'
        ? { enabled: true }
        : Object.assign({}, ...startupSeed.object.filter(item => !item.provider || item.provider === 'aws').map(item => item.config)));
    const runtime = {
        isPrimary: true, organization_id: platform, host: 'platform.test',
        crud: { send: async request => {
            requests.push(structuredClone(request));
            const key = `${request.organization_id}:${request.array}`;
            const objects = records.get(key) || [];
            const query = request.filter?.query || {};
            if (request.method === 'object.read') {
                if (request.array === 'organizations') return { object: [{ _id: tenant, cluster_id: clusterId, bootstrapStorage: tenantStorage }] };
                if (request.array === 'clusters') return { object: Object.entries(query).every(([field, value]) =>
                    field.split('.').reduce((object, key) => object?.[key], cluster) === value) ? [cluster] : [] };
                if (request.array === 'keys') return { object: [{ key: 'test-only-management-key' }] };
                if (request.array === 'apis') return { object: [{ _id: 'cloud-api', type: 'cloud', enabled: true, name: 'platform-cloud', provider: 'aws', token: 'platform-token-must-not-leak' }] };
                if (request.array === 'workflows') return { object: serverSeed.object.filter(item => item.name === query.name) };
                return { object: structuredClone(objects.filter(item => Object.entries(query).every(([field, value]) => item[field] === value))) };
            }
            if (request.method === 'object.delete') { records.delete(key); return { object: [] }; }
            if (options.failPersistence && request.organization_id === platform && request.array === 'servers' && request.method === 'object.update') return { error: ['Persistence failure'] };
            const object = structuredClone(request.object);
            const record = objects.find(item => item._id === object._id) || {};
            for (const [field, value] of Object.entries(object)) {
                const parts = field.split('.'); let cursor = record;
                for (const part of parts.slice(0, -1)) cursor = cursor[part] ||= {};
                cursor[parts.at(-1)] = value;
            }
            if (!objects.includes(record)) objects.push(record);
            records.set(key, objects);
            return { object: [structuredClone(record)] };
        } },
        api: { send: async (request, context) => {
            apiCalls.push(structuredClone(request));
            assert.equal(context.organization_id, platform);
            assert.equal(request.api, 'platform-cloud');
            assert.equal(request.endpoint, 'create-instance');
            assert.equal(request.region, 'us-east-1');
            assert.equal(request.data.region, 'us-east-1');
            assert.equal(request.data.vmType, options.vmType || 't3a.small');
            assert.equal(typeof request.data.environment, 'string');
            // Run the real cloud endpoint's script preprocessing in platform context.
            const sandbox = {
                Buffer, $payload: { ...request, organization_id: platform },
                $crud: { send: async () => ({ object: [{ name: 'platform-storage', provider: 'mongodb', connectionString: 'PLATFORM-CONNECTION-MUST-NOT-LEAK' }] }) }
            };
            for (const [name, action] of Object.entries(endpoint.actions)) {
                Object.assign(sandbox, await astAsync({ executeAST: { [name]: action }, sandbox }));
                if (name === 'bootstrapScriptBase64') break;
            }
            const script = sandbox.bootstrapScript;
            const encoded = script.match(/printf '%s' '([^']+)' \| base64 --decode > \/root\/CoCreate.config.js/)[1];
            const nodeConfig = JSON.parse(Buffer.from(encoded, 'base64').toString());
            assert.equal(nodeConfig.organization_id, tenant);
            assert.equal(nodeConfig.cluster_id, clusterId);
            assert.deepEqual(nodeConfig.storage, tenantStorage);
            assert.ok(!script.includes('PLATFORM-CONNECTION-MUST-NOT-LEAK'));
            assert.ok(!script.includes('platform-token-must-not-leak'));
            assert.equal(Object.hasOwn(nodeConfig, 'apikey'), false);
            if (options.providerError) return { error: ['Provider failure'] };
            if (options.noInstanceId) return { data: {} };
            return { data: { instanceId: 'i-test', privateIpAddress: '10.0.0.2' } };
        } }
    };
    await Workflows.init(runtime);
    runtime.workflow = Workflows;
    const handler = await initManager(runtime);
    runtime.manager = handler;
    const mesh = new ServerMesh();
    mesh.server = runtime;
    return { handler, mesh, cluster, records, requests, apiCalls, platform };
}

test('activation renders tenant startup, dispatches the real VM workflow in platform scope, and mirrors provider data', async t => {
    const { mesh, records, requests, apiCalls, platform } = await run(t);
    const result = await mesh.checkOrganizationServers(tenant);
    assert.equal(result.status, 'created');
    assert.deepEqual(result.data, { instanceId: 'i-test', privateIpAddress: '10.0.0.2' });
    const workflowClusterRead = requests.find(request => request.array === 'clusters' && request.filter?.query?._id === clusterId);
    assert.deepEqual(workflowClusterRead.filter.query, { _id: clusterId, type: 'organization', 'manager.for': tenant });
    assert.equal(workflowClusterRead.organization_id, platform);
    const parent = records.get(`${platform}:servers`)[0];
    const child = records.get(`${tenant}:servers`)[0];
    assert.deepEqual(parent, child);
    assert.equal(child.manager.apiKey, 'test-only-management-key');
    assert.equal(JSON.stringify(apiCalls).includes('test-only-management-key'), false);
    assert.equal(child.infrastructure.instanceId, 'i-test');
    assert.equal(child.infrastructure.privateIpAddress, '10.0.0.2');
    const writes = requests.filter(item => item.array === 'servers' && item.method === 'object.update' && item.object['infrastructure.instanceId']);
    assert.deepEqual(writes[0].object, writes[1].object);
    assert.equal(writes[0].organization_id, platform);
    assert.equal(writes[1].organization_id, tenant);
    assert.equal(records.has(`${platform}:organization_server_reservations`), false);
});

test('later deployment uses the same real workflow with its selected placement and server ID', async t => {
    const { handler, cluster, records, apiCalls, platform } = await run(t, { vmType: 't3a.medium' });
    const serverId = 'dddddddddddddddddddddddd';
    const result = await handler.createServer(cluster, {
        ...cluster.initialDeployment, vmType: 't3a.medium', server_id: serverId, api: 'platform-cloud'
    });
    assert.deepEqual(result.data, { instanceId: 'i-test', privateIpAddress: '10.0.0.2' });
    assert.equal(apiCalls[0].data.server_id, serverId);
    assert.equal(cluster.initialDeployment.vmType, 't3a.small');
    const parent = records.get(`${platform}:servers`)[0];
    const child = records.get(`${tenant}:servers`)[0];
    assert.deepEqual(parent, child);
    assert.equal(parent._id, serverId);
    assert.equal(parent.infrastructure.vmType, 't3a.medium');
    assert.equal(parent.infrastructure.instanceId, 'i-test');
});

for (const option of ['providerError', 'noInstanceId', 'failPersistence']) {
    test(`VM failure ${option} retains inventory without a blocking creation reservation`, async t => {
        const { mesh, records, apiCalls, platform } = await run(t, { [option]: true });
        await assert.rejects(mesh.checkOrganizationServers(tenant));
        assert.ok(records.get(`${platform}:servers`)[0]._id);
        assert.equal(records.has(`${platform}:organization_server_reservations`), false);
        await assert.rejects(mesh.checkOrganizationServers(tenant));
        assert.equal(apiCalls.length, 2);
    });
}

test('all provider macros preserve an already prepared tenant startup script', async () => {
    const script = '#!/bin/bash\n# prepared tenant startup; no platform credentials\n';
    for (const endpoint of [aws.object.find(item => item.name === 'create-instance'), ...providers.object.filter(item => item.name === 'create-instance')]) {
        const sandbox = { Buffer, $payload: { organization_id: 'platform', data: { storage: 'storage-api', startupScript: JSON.stringify({ $concat: [[script]] }) } },
            $crud: { send: async () => ({ object: [{ name: 'platform-storage', provider: 'mongodb', connectionString: 'not-for-tenant' }] }) } };
        for (const [name, action] of Object.entries(endpoint.actions)) {
            Object.assign(sandbox, await astAsync({ executeAST: { [name]: action }, sandbox }));
            if (name === 'bootstrapScriptBase64') break;
        }
        assert.equal(sandbox.bootstrapScript, script);
    }
});
