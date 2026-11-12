import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { init } from '../../CoCreate-modules/workflows/src/server.js';
import cluster from '../src/apps/workflows/config/cluster.js';

test('startup inserts the supplied manager object as quoted environment JSON', async () => {
    const manager = {
        organization_id: 'platform', host: 'platform.test',
        apiKey: 'test-only-"quotes"-\'-$value-`literal`-\\-\n-next-line'
    };
    const workflows = await init({ organization_id: 'platform', send: payload => payload,
        crud: { send: async () => ({ object: cluster.object }) } });
    const result = await workflows.run({
        method: 'workflow.createClusterConfig', organization_id: 'platform', host: 'platform.test',
        createClusterConfig: {
            name: 'Test', managedOrganization: 'tenant', host: 'tenant.test',
            environment: 'server_id=node\ncluster_id=cluster',
            bootstrapStorage: { name: 'primary', provider: 'mongodb' }, manager
        }
    });
    assert.equal(result.error, undefined, JSON.stringify(result.error));
    const script = result.data.startupScript;
    const line = script.split('\n').find(value => value.startsWith('manager='));
    assert.ok(line);
    // The outer JSON string quotes the EnvironmentFile value; the inner JSON is the manager object.
    assert.deepEqual(JSON.parse(JSON.parse(line.slice('manager='.length))), manager);
    assert.match(script, /cat << 'EOF' > \/etc\/cocreatews\/environment/);
    assert.match(script, /chmod 600 \/etc\/cocreatews\/environment/);
    assert.match(script, /organization_id=tenant/);
    assert.match(script, /host=tenant\.test/);
    execFileSync('bash', ['-n'], { input: script });
});
