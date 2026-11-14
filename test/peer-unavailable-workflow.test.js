import assert from 'node:assert/strict';
import test from 'node:test';
import Workflows from '../../CoCreate-modules/workflows/src/server.js';
import seed from '../src/apps/workflows/config/mesh.js';
import { createUpdate, queryData } from '@cocreate/utils';

async function setup(status = 'running') {
    const record = { _id: 'peer', master: { status } };
    const writes = [];
    const server = {
        organization_id: 'platform',
        crud: { async send(request) {
            if (request.array === 'workflows') return { object: [structuredClone(seed.object[0])] };
            writes.push(structuredClone(request));
            if (request.filter?.query && !queryData(record, request.filter.query)) return { object: [] };
            const patch = structuredClone(request.object);
            delete patch._id;
            assert.notEqual(createUpdate(record, patch), false);
            return { object: [structuredClone(record)] };
        } },
        send() {}
    };
    await Workflows.init(server);
    return { record, writes };
}
function envelope(observerId = 'observer', messages = [{ uuid: 'message-1', method: 'example', value: 42 }]) {
    return { method: 'workflow.peerUnavailable', organization_id: 'platform', host: 'platform.test', peerUnavailable: [{
        id: `failure-${observerId}`, serverId: 'peer', observerId, observedAt: '2026-11-12T00:00:00Z',
        reason: 'retries exhausted', retries: 10, closeCode: 1006, recoveryWaitMs: null, remoteAddress: '192.0.2.1', peerReachable: false, peerOrganizationId: null, queuedMessages: messages
    }] };
}

test('workflow preserves messages from multiple observers with addToSet and marks the peer failed', async () => {
    const { record, writes } = await setup();
    const first = await Workflows.run(envelope());
    assert.equal(first.error, undefined);
    assert.equal(record.master.status, 'failed');
    assert.equal(record.master.failure.source, 'mesh');
    assert.deepEqual(record.queuedMessages, envelope().peerUnavailable[0].queuedMessages);
    const second = await Workflows.run(envelope('other', [...record.queuedMessages, { uuid: 'message-2', method: 'another' }]));
    assert.equal(second.error, undefined);
    assert.equal(record.queuedMessages.length, 2);
    assert.equal(record.peerFailures.length, 2);
    assert.ok(writes[0].object.$addToSet.queuedMessages.$each);
});

for (const status of ['terminating', 'draining', 'stopped']) {
    test(`workflow preserves ${status} while appending diagnostic messages`, async () => {
        const { record } = await setup(status);
        assert.equal((await Workflows.run(envelope())).error, undefined);
        assert.equal(record.master.status, status);
        assert.equal(record.queuedMessages.length, 1);
    });
}

test('another live connection prevents node failure but retains missed messages', async () => {
    const { record } = await setup();
    const payload = envelope();
    payload.peerUnavailable[0].peerReachable = true;
    assert.equal((await Workflows.run(payload)).error, undefined);
    assert.equal(record.master.status, 'running');
    assert.equal(record.queuedMessages.length, 1);
});


test('the configured workflow persists failure evidence through the real CoCreateDB adapter', async t => {
    const { mkdtemp, rm } = await import('node:fs/promises');
    const { tmpdir } = await import('node:os');
    const { join } = await import('node:path');
    const { createDB } = await import('../../CoCreate-modules/db/src/index.js');
    const directory = await mkdtemp(join(tmpdir(), 'peer-failure-workflow-'));
    t.after(() => rm(directory, { recursive: true, force: true }));
    const db = createDB({ directory, memoryCache: false });
    const id = '6c0000000000000000000001';
    const organization_id = '000000000000000000000001';
    const send = data => db.send({ ...data, organization_id, storage: 'production', database: 'platform' });
    for (const [array, object] of [['workflows', seed.object], ['servers', [{ _id: id, master: { status: 'running' } }]]]) {
        const result = await send({ method: 'object.create', array, object: structuredClone(object) });
        assert.equal(result.success, true, result.error);
    }
    const { EventEmitter } = await import('node:events');
    const { ServerMesh } = await import('../../CoCreate-modules/cluster/src/mesh/index.js');
    const server = Object.assign(new EventEmitter(), {
        id: 'observer', organization_id, host: 'platform.test', isPrimary: true, crud: { send }, send() {}
    });
    server.workflow = await Workflows.init(server);
    const mesh = new ServerMesh();
    mesh.server = server;
    const peer = { serverId: id, readyState: 3, isControlSocket: true };
    mesh.addControlSocket(peer);
    const missed = envelope().peerUnavailable[0].queuedMessages[0];
    mesh.send({ ...missed, server: id });
    const emitted = [];
    server.on('peerUnavailable', report => emitted.push(report));
    assert.equal(await mesh.peerUnavailable(peer, { reason: 'retries exhausted', retries: 10, closeCode: 1006 }), true);
    assert.equal(emitted.length, 1);
    assert.equal(mesh.pendingPeerFailures.size, 0);
    const saved = await send({ method: 'object.read', array: 'servers', filter: { query: { _id: id } } });
    assert.equal(saved.object[0].master.status, 'failed');
    assert.equal(saved.object[0].master.failure.observerId, 'observer');
    assert.equal(saved.object[0].queuedMessages[0].uuid, 'message-1');
    assert.equal(saved.object[0].peerFailures[0].reason, 'retries exhausted');
});
