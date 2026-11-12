import assert from 'node:assert/strict';
import test from 'node:test';
import { security } from '@cocreate/utils';
import { init } from '../../CoCreate-modules/api/src/server.js';
import cloudSeed from '../src/apps/apis/config/cloud.js';
import endpointSeed from '../src/apps/endpoints/config/AWS/data.js';

for (const [name, action] of [['create-instance', 'RunInstances'], ['delete-instance', 'TerminateInstances']]) {
const endpoint = endpointSeed.object.find(record => record.name === name);
test(`${name} sends one correctly signed ${action} request using prepared native parameters`, async t => {
    const cloud = { ...cloudSeed.object[0], accessKeyId: 'TEST_ACCESS_KEY', secretAccessKey: 'test-secret' };
    const reads = [], requests = [];
    const api = await init({ organization_id: 'platform', send: payload => payload,
        crud: { async send(request) {
            reads.push(structuredClone(request));
            assert.equal(request.organization_id, 'platform');
            if (request.array === 'apis') return { object: [cloud] };
            assert.equal(request.array, 'endpoints', 'No storage or provisioning reads belong in this endpoint');
            assert.equal(request.filter.query.name, name);
            return { object: [endpoint] };
        } }
    });
    const parameters = name === 'delete-instance' ? { 'InstanceId.1': 'i-test' } : {
        ImageId: 'ami-test', InstanceType: 't3a.small', MinCount: 1, MaxCount: 1,
        'SecurityGroupId.1': 'sg-prepared', UserData: Buffer.from('#!/bin/bash\necho prepared\n').toString('base64'),
        ClientToken: 'prepared-token', 'TagSpecification.1.Tag.1.Value': 'name with + / & symbols',
        Action: 'TerminateInstances', Version: 'invalid'
    };
    const original = structuredClone(parameters);
    const xml = '<RunInstancesResponse><instanceId>i-test</instanceId></RunInstancesResponse>';
    t.mock.method(globalThis, 'fetch', async (url, options) => {
        requests.push({ url, options });
        assert.equal(url, 'https://ec2.us-east-1.amazonaws.com/');
        assert.equal(options.method, 'POST');
        assert.deepEqual(Object.fromEntries(new URLSearchParams(options.body)), Object.fromEntries(
            Object.entries({ ...parameters, Action: action, Version: '2016-11-15' }).map(([key, value]) => [key, String(value)])
        ));
        const headers = Object.fromEntries(['content-type', 'host', 'x-amz-date'].map(key => [key, options.headers[key]]));
        const expected = await security.createAwsSigV4Token({
            method: 'POST', uri: '/', payload: options.body, region: 'us-east-1', service: 'ec2',
            isoDate: headers['x-amz-date'], headers
        }, { accessKeyId: cloud.accessKeyId, secretAccessKey: cloud.secretAccessKey });
        assert.equal(options.headers.Authorization, expected);
        return new Response(xml, { headers: { 'content-type': 'text/xml' } });
    });
    const result = await api.send({ api: cloud._id, endpoint: name, method: 'post',
        region: 'us-east-1', organization_id: 'platform', host: 'platform.test', data: parameters });
    assert.equal(result.error, undefined, JSON.stringify(result.error));
    assert.equal(result.data, xml);
    assert.equal(requests.length, 1);
    assert.equal(reads.length, 2);
    assert.deepEqual(parameters, original);
});
}
