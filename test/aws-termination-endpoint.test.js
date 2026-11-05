import assert from 'node:assert/strict';
import test from 'node:test';
import { astAsync } from '@cocreate/utils';
import aws from '../src/apps/endpoints/config/AWS/data.js';

const endpoint = aws.object.find(record => record.name === 'delete-instance');
const response = (id = 'i-test', state = 'shutting-down') => `<TerminateInstancesResponse><instancesSet><item><instanceId>${id}</instanceId><currentState><code>32</code><name>${state}</name></currentState></item></instancesSet></TerminateInstancesResponse>`;

async function run(xml) {
    const calls = [];
    const sandbox = {
        $payload: { region: 'us-east-1', data: { vmId: 'i-test' } }, $config: { name: 'aws' },
        $api: { send: async request => { calls.push(request); return { data: xml }; } }
    };
    for (const [name, action] of Object.entries(endpoint.actions)) {
        Object.assign(sandbox, await astAsync({ executeAST: { [name]: action }, sandbox }));
    }
    return { calls, data: await astAsync({ executeAST: endpoint.data, sandbox }) };
}

for (const state of ['shutting-down', 'terminated']) {
    test(`AWS termination uses direct HTTP Query action and accepts ${state}`, async () => {
        const { calls, data } = await run(response('i-test', state));
        assert.equal(endpoint.method, 'post');
        assert.equal(endpoint.resolved, true);
        assert.deepEqual(calls, [{ api: 'aws', method: 'post', endpoint: '/', region: 'us-east-1', encoding: 'form', data: {
            Action: 'TerminateInstances', Version: '2016-11-15', 'InstanceId.1': 'i-test'
        } }]);
        assert.deepEqual(data, { instanceId: 'i-test', state });
    });
}

for (const xml of [response('i-other'), response('i-test', 'running'), '<ErrorResponse>Denied</ErrorResponse>']) {
    test(`AWS termination rejects an invalid acknowledgement: ${xml}`, async () => {
        await assert.rejects(run(xml));
    });
}
