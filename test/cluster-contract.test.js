import assert from 'node:assert/strict';
import test from 'node:test';
import { init as initWorkflows } from '../../CoCreate-modules/workflows/src/server.js';
import seed from '../src/apps/workflows/config/cluster.js';

async function persist(cluster) {
    const writes = [];
    const service = await initWorkflows({ crud: { send: async request => {
        if (request.method === 'object.read') return { object: seed.object };
        writes.push(request);
        return { object: [structuredClone(request.object)] };
    } } });
    const result = await service.run({
        method: 'workflow.create-organization-cluster', organization_id: 'platform', host: 'platform.test',
        'create-organization-cluster': [{ organizationId: 'tenant', cluster }]
    });
    return { result, writes };
}

const definition = () => ({
    _id: 'cluster-1', type: 'organization', name: 'Production', host: 'tenant.test',
    manager: { organization_id: 'platform', host: 'platform.test', for: 'tenant' },
    deployment: { cloud: 'cloud-api', region: 'us-east-1', type: 't3a.small' },
    repositories: [{ url: 'git@example.test:tenant/app.git', branch: 'main' }]
});

test('cluster persistence accepts a display name distinct from its managed organization', async () => {
    const cluster = definition();
    const { result, writes } = await persist(cluster);
    assert.equal(result['create-organization-cluster']?.[0]?.initialized, true, JSON.stringify(result.error));
    assert.deepEqual(writes[0].object, cluster);
    assert.deepEqual(writes[1].object, { _id: 'tenant', cluster_id: cluster._id });
    assert.equal(writes[0].object.name, 'Production');
    assert.equal(writes[0].object.manager.for, 'tenant');
    assert.equal(writes[0].object.deployment.type, 't3a.small');
    assert.deepEqual(writes[0].object.repositories, cluster.repositories);
});

for (const field of ['organization_id', 'host', 'for']) {
    test(`managed cluster requires manager.${field} before writing`, async () => {
        const cluster = definition();
        delete cluster.manager[field];
        const { result, writes } = await persist(cluster);
        assert.ok(result.error?.length || result.success === false);
        assert.deepEqual(writes, []);
    });
}

test('manager.for must identify the organization being initialized', async () => {
    const cluster = definition();
    cluster.manager.for = 'another-tenant';
    const { result, writes } = await persist(cluster);
    assert.ok(result.error?.length || result.success === false);
    assert.deepEqual(writes, []);
});

test('deployment stays a required cluster property', async () => {
    const cluster = definition();
    cluster.manager.deployment = cluster.deployment;
    delete cluster.deployment;
    const { result, writes } = await persist(cluster);
    assert.ok(result.error?.length || result.success === false);
    assert.deepEqual(writes, []);
});
