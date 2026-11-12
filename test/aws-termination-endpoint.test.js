import assert from 'node:assert/strict';
import test from 'node:test';
import { init } from '../../CoCreate-modules/workflows/src/server.js';
import common from '../src/apps/workflows/config/server.js';
import aws from '../src/apps/workflows/config/aws.js';

const xml = (id = 'i-test', state = 'shutting-down') => `<TerminateInstancesResponse><instancesSet><item><instanceId>${id}</instanceId><currentState><name>${state}</name></currentState></item></instancesSet></TerminateInstancesResponse>`;
async function run({ response = xml(), tenant = 'tenant', serverId = 'node', missingServer = false, cloudAllowed = true, clouds = cloudAllowed ? ['cloud-api'] : ['other-cloud'] } = {}) {
    const calls = [], writes = [];
    const cluster = { _id: 'cluster', managedOrganization: 'tenant', clouds, host: 'tenant.test' };
    const server = { _id: 'node', cluster_id: 'cluster', tenant_organization_id: 'tenant',
        deployment: { cloud: 'cloud-api', dns: [], id: 'i-test', region: 'us-east-1', type: 'small' } };
    const definitions = [...common.object, ...aws.object];
    const service = await init({ organization_id: 'platform', send: payload => payload,
        crud: { async send(request) {
            if (request.method !== 'object.read') writes.push(request);
            if (request.array === 'workflows') return { object: definitions.filter(d => d.name === request.filter.query.name) };
            if (request.array === 'clusters') return { object: [cluster] };
            if (request.array === 'apis') return { object: [{ _id: 'cloud-api', name: 'aws', provider: 'aws' }] };
            assert.equal(request.array, 'servers');
            return { object: !missingServer && Object.entries(request.filter.query).every(([k,v]) => server[k] === v) ? [server] : [] };
        } },
        api: { async send(request) { calls.push(request); return { data: response }; } }
    });
    const result = await service.run({ method: 'workflow.deleteOrganizationServer', organization_id: 'platform', host: 'platform.test',
        managedOrganization: tenant, deleteOrganizationServer: { ...cluster,
            deployment: { server_id: serverId, id: 'spoofed-provider-id', region: 'spoofed-region', cloud: 'spoofed-cloud' } } });
    return { result, calls, writes };
}
for (const state of ['shutting-down', 'terminated']) {
    test(`deletion workflows use stored infrastructure and normalize ${state}`, async () => {
        const { result, calls, writes } = await run({ response: xml('i-test', state) });
        assert.equal(result.error, undefined, JSON.stringify(result.error));
        assert.equal(result.data.id, 'i-test');
        assert.equal(result.data.state, state);
        assert.equal(result.data.server._id, 'node');
        assert.deepEqual(calls, [{ api: 'cloud-api', endpoint: 'delete-instance', method: 'post', region: 'us-east-1', data: { 'InstanceId.1': 'i-test' } }]);
        assert.deepEqual(writes, [], 'Inventory deletion remains a separate cleanup operation');
    });
}
for (const response of [xml('i-other'), xml('i-test','running'), '<ErrorResponse>Denied</ErrorResponse>']) {
    test(`AWS deletion workflow rejects invalid acknowledgements: ${response}`, async () => {
        const { result } = await run({ response });
        assert.ok(result.error?.length);
    });
}
for (const options of [{ tenant: 'other' }, { serverId: 'other-node' }, { missingServer: true }, { cloudAllowed: false }]) {
    test(`common deletion rejects unauthorized inventory before provider dispatch: ${JSON.stringify(options)}`, async () => {
        const { result, calls } = await run(options);
        assert.ok(result.error?.length);
        assert.equal(calls.length, 0);
    });
}

for (const clouds of [null, '', []]) {
    test(`deletion accepts an unrestricted cluster cloud selection: ${JSON.stringify(clouds)}`, async () => {
        const { result, calls } = await run({ clouds });
        assert.equal(result.error, undefined, JSON.stringify(result.error));
        assert.equal(calls[0].api, 'cloud-api');
    });
}
