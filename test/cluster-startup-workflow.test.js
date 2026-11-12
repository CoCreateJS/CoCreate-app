import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { init as initWorkflows } from '../../CoCreate-modules/workflows/src/server.js';
import clusterSeed from '../src/apps/workflows/config/cluster.js';

for (const environment of [undefined, 'server_id=node-1\ncluster_id=cluster-1']) {
    test(`cluster workflow owns and returns its rendered startup script with resolved inputs (environment: ${environment !== undefined})`, async () => {
        const input = {
            name: 'Production', managedOrganization: 'tenant-1', host: 'tenant.test',
            bootstrapStorage: { name: 'primary', provider: 'mongodb', uri: 'mongodb://example.test/tenant' },
            manager: { organization_id: 'platform', host: 'platform.test', apiKey: 'test-only-"quotes"-\'-$value-`literal`-\\-\n' },
            ...(environment !== undefined && { environment })
        };
        const definition = structuredClone(clusterSeed.object[0]);
        const original = structuredClone(definition);
        const requests = [];
        const service = await initWorkflows({
            organization_id: 'platform',
            send: payload => payload,
            crud: { async send(request) {
                requests.push(request);
                return { object: [definition] };
            } }
        });
        const response = await service.run({
            method: 'workflow.createClusterConfig', organization_id: 'platform', host: 'platform.test', data: input
        });
        assert.equal(response.error, undefined, JSON.stringify(response.error));
        const cluster = response.data;
        assert.equal(cluster.managedOrganization, 'tenant-1');
        assert.equal(cluster.host, 'tenant.test');
        assert.equal('deployment' in cluster, false);
        assert.deepEqual(cluster.dns, []);
        assert.equal('routing' in cluster, false);
        assert.equal('initialDeployment' in cluster, false);
        assert.equal(typeof cluster.startupScript, 'string');
        assert.ok(!cluster.startupScript.includes('{{'));
        assert.ok(!cluster.startupScript.includes('undefined'));
        const encoded = cluster.startupScript.match(/printf '%s' '([^']+)' \| base64 --decode > \/root\/CoCreate.config.js/);
        assert.ok(encoded, 'Cluster startup contains its prepared bootstrap configuration');
        assert.deepEqual(JSON.parse(Buffer.from(encoded[1], 'base64').toString()), {
            organization_id: input.managedOrganization, host: input.host,
            storage: input.bootstrapStorage, manager: input.manager
        });
        assert.ok(cluster.startupScript.includes('organization_id=tenant-1'));
        assert.ok(cluster.startupScript.includes('trap \'status=$?;'));
        assert.ok(cluster.startupScript.includes('"$unit"'));
        execFileSync('bash', ['-n'], { input: cluster.startupScript });
        assert.deepEqual(definition, original);
        assert.ok(requests.every(request => request.method === 'object.read'));
    });
}
