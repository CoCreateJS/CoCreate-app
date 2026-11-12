import assert from 'node:assert/strict';
import test from 'node:test';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { crudServer } from '../../CoCreate-modules/crud/src/server/index.js';
import Config from '@cocreate/config';
import authorize from '../../CoCreate-modules/authorize/src/index.js';
import apiKeySeed from '../src/apps/api-keys/config/data.json' with { type: 'json' };
import { init as initManager } from '../../CoCreate-modules/cluster/src/manager.js';
import { init as initApi } from '../../CoCreate-modules/api/src/server.js';
import { deleteServer } from '../../CoCreate-modules/autoscaler/src/cleanup.js';

const managementRole = apiKeySeed.object.find(item => item._id === '6b0700000000000000000021');

test('managed-cluster role grants instance endpoints, updates and server-only inventory deletion', () => {
    const key = managementRole;
    assert.match(key._id, /^[a-f0-9]{24}$/);
    assert.equal(key.type, 'role');
    assert.equal(key.admin, false);
    assert.deepEqual(key.methods.post.$endpoint, ['create-instance', 'delete-instance']);
    assert.deepEqual(key.methods.object.update.$array, ['servers', 'clusters']);
    assert.deepEqual(key.methods.object.delete.$array, ['servers']);
});

test('direct managed HTTPS request passes HTTP authorization and endpoint permissions', async t => {
    t.mock.method(Config, 'get', () => undefined);
    t.mock.method(Config, 'query', async () => undefined);
    const credential = 'test-only-managed-network-key', calls = [], stateCalls = [];
    const key = { _id: 'cluster-manager-key', type: 'key', key: credential, roles: [managementRole._id] };
    t.mock.method(crudServer, 'send', async query => {
        if (query.object?.some(item => item._id === managementRole._id)) return { object: [managementRole] };
        const suppliedKey = query.filter?.query?.$or?.find(item => item.key)?.key;
        return { object: suppliedKey === credential ? [key] : [] };
    });
    const parent = {
        crud: {
            getOrganization: async () => ({ _id: 'direct-test-parent' }),
            send: async request => { stateCalls.push(request); return { object: [request.object] }; }
        }, authorize,
        api: { send: async envelope => {
            calls.push(envelope);
            return { ...envelope, data: { id: 'test-instance' } };
        } }
    };
    parent.api = { ...await initApi(parent), ...parent.api };
    parent.manager = await initManager(parent);
    const listener = createServer((req, res) => parent.manager.http(req, res));
    t.after(() => new Promise(resolve => { listener.close(resolve); listener.closeAllConnections(); }));
    listener.listen(0, '127.0.0.1'); await once(listener, 'listening');
    const nativeFetch = globalThis.fetch;
    t.mock.method(globalThis, 'fetch', async (url, options) => {
        assert.equal(url, 'https://parent.test/manager');
        assert.equal(options.body.includes(credential), false);
        assert.equal(JSON.parse(options.body).request, undefined);
        return nativeFetch(`http://127.0.0.1:${listener.address().port}/manager`, options);
    });
    const manager = await initManager({ isPrimary: true });
    Object.assign(manager, { organization_id: 'parent', host: 'parent.test', apiKey: credential });
    const payload = { api: 'parent-cloud', endpoint: 'create-instance', method: 'post', organization_id: 'tenant', host: 'tenant.test', data: { cluster_id: 'cluster-test' } };
    const result = await manager.send(payload);
    assert.equal(result.data.id, 'test-instance');
    assert.equal(calls[0].organization_id, 'direct-test-parent');
    assert.equal(calls[0].apikey, undefined);
    await manager.send({ ...payload, endpoint: 'delete-instance' });
    await manager.send({ ...payload, endpoint: 'delete-instance', method: 'delete' });
    await assert.rejects(manager.send({ ...payload, endpoint: 'unrelated-operation' }), /403/);
    await assert.rejects(manager.send({ ...payload, endpoint: 'create-instance', method: 'delete' }), /403/);
    const wrongManager = await initManager({ isPrimary: true });
    Object.assign(wrongManager, { ...manager, apiKey: 'wrong-key' });
    await assert.rejects(wrongManager.send(payload), /403/);
    assert.equal(calls.length, 3);
    const patch = { _id: 'server-1', worker2: { status: 'stopped' } };
    const mirrored = await manager.send({ method: 'object.update', array: 'servers', object: patch, organization_id: 'tenant', host: 'tenant.test' });
    assert.deepEqual(mirrored.object[0], patch);
    assert.equal(stateCalls[0].organization_id, 'direct-test-parent');
    assert.equal(stateCalls[0].apikey, undefined);
    const clusterPatch = { _id: 'cluster-test', 'repositories.0.initialUpload.completed': true };
    assert.deepEqual((await manager.send({ method: 'object.update', array: 'clusters', object: clusterPatch })).object[0], clusterPatch);
    assert.equal(stateCalls[1].array, 'clusters');

    const tenantDeletes = [];
    await deleteServer({ organization_id: 'tenant', host: 'tenant.test', manager,
        crud: { send: async request => { tenantDeletes.push(request); return { object: [] }; } }
    }, 'server-1');
    assert.equal(tenantDeletes[0].organization_id, 'tenant');
    assert.equal(stateCalls[2].method, 'object.delete');
    assert.equal(stateCalls[2].organization_id, 'direct-test-parent');
    assert.deepEqual(stateCalls[2].object, [{ _id: 'server-1' }]);

});

test('missing managed credentials prevent outbound requests', async t => {
    t.mock.method(Config, 'get', () => undefined);
    t.mock.method(Config, 'query', async () => undefined);
    t.mock.method(globalThis, 'fetch', () => assert.fail('Missing credentials must not send'));
    for (const connection of [{}, { host: 'parent.test' }, { host: 'https://wrong/path', apiKey: 'test' }]) {
        const manager = await initManager({ isPrimary: true });
        Object.assign(manager, { organization_id: 'parent', ...connection });
        await assert.rejects(manager.send({ method: 'post' }), /host and API key/);
    }
});
