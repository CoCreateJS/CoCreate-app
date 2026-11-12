import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { init } from '../../CoCreate-modules/workflows/src/server.js';
import common from '../src/apps/workflows/config/server.js';
import aws from '../src/apps/workflows/config/aws.js';
import cloudSeed from '../src/apps/apis/config/cloud.js';
import endpoints from '../src/apps/endpoints/config/AWS/data.js';
import { init as initApi } from '../../CoCreate-modules/api/src/server.js';

async function fixture(options = {}) {
    const cluster = {
        _id: '111111111111111111111111', name: 'Production', managedOrganization: 'tenant',
        host: 'tenant.test', storage: 'storage', clouds: ['cloud-api'],
        startupScript: '#!/bin/bash\necho "saved $HOME $(date)"\n', ...options.cluster
    };
    const definitions = [common.object[0], aws.object[0], ...(options.definitions || [])];
    const requests = [], calls = [], records = new Map();
    const service = await init({
        organization_id: 'platform', send: payload => payload,
        crud: { async send(request) {
            requests.push(structuredClone(request));
            if (request.array === 'workflows') return { object: definitions.filter(d => d.name === request.filter.query.name) };
            if (request.array === 'clusters') return { object: options.missingCluster ? [] : [structuredClone(cluster)] };
            if (request.array === 'apis') return { object: [{ _id: 'cloud-api', name: options.cloudName || 'aws', provider: options.cloudName || 'aws' }] };
            const key = request.organization_id + ':' + request.object._id;
            const record = records.get(key) || {};
            Object.assign(record, structuredClone(request.object));
            records.set(key, record);
            return { object: [structuredClone(record)] };
        } },
        api: { async send(request, context) {
            calls.push(structuredClone(request));
            if (options.apiSend) return options.apiSend(request, context);
            const action = request.endpoint === 'create-instance' ? 'RunInstances' : request.data.Action;
            if (options.fail && options.fail === action) return { error: ['provider rejected request'] };
            if (request.endpoint === 'resolve-image') return { data: { Parameter: { Value: 'ami-test' } } };
            const responses = {
                DescribeVpcs: '<vpcId>vpc-test</vpcId>',
                DescribeSecurityGroups: options.newGroup ? '<groups/>' : '<groupId>sg-test</groupId>',
                CreateSecurityGroup: '<groupId>sg-new</groupId>',
                AuthorizeSecurityGroupIngress: '<return>true</return>',
                RunInstances: '<instanceId>i-test</instanceId><imageId>ami-test</imageId><instanceType>small</instanceType><instanceState><name>pending</name></instanceState><availabilityZone>us-east-1a</availabilityZone><privateIpAddress>10.0.0.1</privateIpAddress>'
            };
            return { data: options.emptyRun && action === 'RunInstances' ? '<instances/>' : responses[action] };
        } }
    });
    const input = { ...cluster, startupScript: 'spoofed script', deployment: {
        cloud: 'cloud-api', region: 'us-east-1', type: 'small', ...options.deployment
    } };
    const response = await service.run({ method: 'workflow.createOrganizationServer', organization_id: 'platform',
        host: 'platform.test', managedOrganization: options.tenant || 'tenant', createOrganizationServer: input });
    return { response, cluster, requests, calls, records };
}

test('common workflow checks the saved cluster, delegates AWS, and mirrors the result', async () => {
    const location = { latitude: 38.9, longitude: -77.4 };
    const { response, cluster, requests, calls, records } = await fixture({ deployment: { location } });
    assert.deepEqual(response.data.server.deployment.location, location);
    assert.equal(response.error, undefined, JSON.stringify(response.error));
    assert.equal(response.data.id, 'i-test');
    assert.match(response.data.server._id, /^[a-f0-9]{24}$/);
    assert.equal(response.data.server.name, `Production-${response.data.server._id}`);
    assert.equal(response.data.server.deployment.provider, 'aws');
    assert.equal(response.data.server.deployment.cloud, 'cloud-api');
    assert.equal(response.data.server.cloud, undefined);
    assert.equal(response.data.server.dns, undefined);
    assert.equal(response.data.server.deployment.type, 'small');
    assert.equal(response.data.server.deployment.vmType, undefined);
    const launch = calls.find(r => r.endpoint === 'create-instance');
    assert.equal(launch.api, 'cloud-api');
    assert.equal(launch.data.ClientToken, response.data.server._id);
    assert.equal(launch.data.InstanceType, 'small');
    assert.equal(launch.data.MinCount, 1);
    assert.equal(launch.data.MaxCount, 1);
    const script = Buffer.from(launch.data.UserData, 'base64').toString();
    assert.ok(script.endsWith(cluster.startupScript));
    assert.ok(script.includes(`server_id=${response.data.server._id}`));
    assert.ok(!script.includes('spoofed'));
    execFileSync('bash', ['-n'], { input: script });
    for (const scope of ['platform', 'tenant']) {
        const record = records.get(`${scope}:${response.data.server._id}`);
        assert.equal(record.status, 'starting');
        assert.equal(record.master.status, 'provisioning');
        assert.equal(record['deployment.id'], 'i-test');
    }
    assert.ok(requests.filter(r => r.array === 'servers' && r.organization_id === 'tenant').every(r => r.host === 'tenant.test'));
    assert.deepEqual(calls.map(r => r.endpoint === '/' ? r.data.Action : r.endpoint), ['resolve-image', 'DescribeVpcs', 'DescribeSecurityGroups', 'create-instance']);
    assert.ok(calls.filter(r => r.endpoint === '/').every(r => r.encoding === 'form' && r.data.Version === '2016-11-15'));
});

for (const singleObject of [false, true]) {
test(`dns is saved as an array on both server records (object input: ${singleObject})`, async () => {
    const pop = {
        provider: 'bunny', id: 1, name: 'London', latitude: 51.5073509,
        longitude: -0.1277583, countryCode: 'GB', continent: 'EU', distanceKm: 12
    };
    const dns = singleObject ? pop : [pop, { provider: 'cloudflare', id: 2, latitude: 51.5, longitude: -0.1, distanceKm: 15 }];
    const original = structuredClone(dns);
    const expected = singleObject ? [original] : original;
    const { response, cluster, requests, records } = await fixture({ deployment: { dns } });
    assert.equal(response.error, undefined, JSON.stringify(response.error));
    const reservations = requests.filter(request => request.array === 'servers' && request.method === 'object.create');
    assert.equal(reservations.length, 2);
    for (const reservation of reservations) {
        assert.deepEqual(reservation.object.deployment.dns, expected);
        assert.equal(reservation.object.master.status, 'provisioning');
    }
    for (const record of records.values()) assert.deepEqual(record.deployment.dns, expected);
    assert.deepEqual(response.data.server.deployment.dns, expected);
    assert.equal(cluster.dns, undefined);
    assert.equal(cluster.deployment, undefined);
    assert.deepEqual(dns, original);
    assert.ok(requests.filter(request => request.array === 'clusters').every(request => request.method === 'object.read'));
});
}

test('AWS creates and opens a security group only when none is present', async () => {
    const { response, calls } = await fixture({ newGroup: true });
    assert.equal(response.error, undefined, JSON.stringify(response.error));
    assert.deepEqual(calls.slice(2).map(r => r.endpoint === '/' ? r.data.Action : r.endpoint), ['DescribeSecurityGroups', 'CreateSecurityGroup', 'AuthorizeSecurityGroupIngress', 'create-instance']);
    assert.equal(calls.at(-1).data['SecurityGroupId.1'], 'sg-new');
});

for (const dns of [undefined, null, []]) {
test(`direct cloud placement stores an empty dns array (${JSON.stringify(dns)})`, async () => {
    const { response, records } = await fixture({ deployment: { dns } });
    assert.equal(response.error, undefined, JSON.stringify(response.error));
    assert.deepEqual(response.data.server.deployment.dns, []);
    for (const record of records.values()) assert.deepEqual(record.deployment.dns, []);
});
}

for (const [name, options, message] of [
    ['missing cluster', { missingCluster: true }, /not available/],
    ['wrong tenant', { tenant: 'other' }, /does not belong/],
    ['unapproved cloud', { deployment: { cloud: 'other' } }, /not allowed/],
    ['missing region', { deployment: { region: undefined } }, /region is required/],
    ['invalid dns', { deployment: { dns: 'invalid' } }, /DNS must be/],
    ['missing saved script', { cluster: { startupScript: '' } }, /startup script is required/]
]) test(`rejects ${name} before provider requests or inventory changes`, async () => {
    const { response, calls, requests } = await fixture(options);
    assert.match(String(response.error), message);
    assert.equal(calls.length, 0);
    assert.ok(requests.every(r => r.method === 'object.read'));
});

for (const options of [{ fail: 'RunInstances' }, { emptyRun: true }]) {
    test(`provider failure marks both inventories failed: ${JSON.stringify(options)}`, async () => {
        const { response, records } = await fixture(options);
        assert.ok(response.error?.length);
        assert.equal(records.size, 2);
        for (const record of records.values()) assert.equal(record['master.status'], 'failed');
    });
}

test('dispatch uses the cloud name and accepts another provider workflow', async () => {
    const { response, calls } = await fixture({ cloudName: 'gcp', definitions: [{ name: 'createGcpInstance', enabled: true,
        actions: { '$payload.data': { id: 'gcp-test' } } }] });
    assert.equal(response.error, undefined, JSON.stringify(response.error));
    assert.equal(response.data.id, 'gcp-test');
    assert.equal(calls.length, 0);
});

test('AWS workflow passes through the real API signing and form transport with mocked fetch', async t => {
    const cloud = { ...cloudSeed.object[0], _id: 'cloud-api', accessKeyId: 'TEST_ACCESS_KEY', secretAccessKey: 'test-secret' };
    const api = await initApi({ organization_id: 'platform', send: payload => payload,
        crud: { async send(request) {
            assert.equal(request.organization_id, 'platform');
            if (request.array === 'apis') return { object: [cloud] };
            return { object: endpoints.object.filter(e => e.name === request.filter.query.name) };
        } }
    });
    const network = [];
    t.mock.method(globalThis, 'fetch', async (url, options) => {
        network.push({ url, options });
        assert.match(options.headers.Authorization, /^AWS4-HMAC-SHA256 Credential=TEST_ACCESS_KEY\//);
        if (url.includes('ssm.')) {
            assert.equal(JSON.parse(options.body).Name, '/aws/service/canonical/ubuntu/server/noble/stable/current/amd64/hvm/ebs-gp3/ami-id');
            return Response.json({ Parameter: { Value: 'ami-test' } });
        }
        const parameters = new URLSearchParams(options.body);
        assert.equal(parameters.get('Version'), '2016-11-15');
        const xml = { DescribeVpcs: '<vpcId>vpc-test</vpcId>', DescribeSecurityGroups: '<groupId>sg-test</groupId>',
            RunInstances: '<instanceId>i-signed</instanceId>' }[parameters.get('Action')];
        assert.ok(xml);
        return new Response(xml, { headers: { 'content-type': 'text/xml' } });
    });
    const { response } = await fixture({ apiSend: api.send });
    assert.equal(response.error, undefined, JSON.stringify(response.error));
    assert.equal(response.data.id, 'i-signed');
    assert.equal(network.length, 4);
});

for (const clouds of [undefined, '', []]) {
    test(`creation accepts an unrestricted cluster cloud selection: ${JSON.stringify(clouds)}`, async () => {
        const { response } = await fixture({ cluster: { clouds } });
        assert.equal(response.error, undefined, JSON.stringify(response.error));
        assert.equal(response.data.server.deployment.cloud, 'cloud-api');
    });
}
