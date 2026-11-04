import assert from 'node:assert/strict';
import test from 'node:test';
import { execFile } from 'node:child_process';
import { astAsync } from '@cocreate/utils';
import aws from '../src/apps/endpoints/config/AWS/data.js';
import providers from '../src/apps/endpoints/config/data.js';
import startup from '../src/apps/server-configs/config/autoscaler.js';

const script = startup.object[0].config.startupScript;
async function render(endpoint, apikey) {
    const storage = { _id: 'storage-id', name: 'primary', provider: 'custom', credentials: { value: 'test-only' } };
    const sandbox = { Buffer, JSON,
        $payload: { organization_id: 'platform', data: { storage: 'storage-id', host: 'tenant.example.com', environment: 'server_id=node\ncluster_id=cluster', binaryUrl: 'https://example.com/runtime.tar.gz', startupScript: script, ...(apikey !== undefined && { apikey }) } },
        $crud: { send: async () => ({ object: [storage] }) }
    };
    for (const [name, action] of Object.entries(endpoint.actions)) {
        Object.assign(sandbox, await astAsync({ executeAST: { [name]: action }, sandbox }));
        if (name === 'bootstrapScriptBase64') break;
    }
    return { sandbox, storage };
}

for (const endpoint of [aws.object.find(item => item.name === 'create-instance'), ...providers.object.filter(item => item.name === 'create-instance')]) {
    test(`provider ${endpoint.api_id} never includes the API key in startup user data`, async () => {
        const key = 'test-only-key-\'-$`\\\nwith punctuation';
        const { sandbox, storage } = await render(endpoint, key);
        const configuration = JSON.parse(Buffer.from(sandbox.bootstrapConfigBase64, 'base64').toString());
        assert.deepEqual(configuration, { organization_id: 'platform', host: 'tenant.example.com', storage });
        assert.equal(sandbox.bootstrapScript.includes(key), false);
        assert.ok(sandbox.bootstrapScript.includes(sandbox.bootstrapConfigBase64));
        assert.match(sandbox.bootstrapScript, /chmod 600 \/root\/CoCreate.config.js/);
        const child = execFile('bash', ['-n']);
        child.stdin.end(sandbox.bootstrapScript);
        await new Promise((resolve, reject) => { child.on('error', reject); child.on('exit', code => code === 0 ? resolve() : reject(new Error(`bash syntax check failed: ${code}`))); });
    });
}

test('a missing API key is omitted rather than written as an undefined credential', async () => {
    const { sandbox } = await render(aws.object.find(item => item.name === 'create-instance'));
    const configuration = JSON.parse(Buffer.from(sandbox.bootstrapConfigBase64, 'base64').toString());
    assert.equal(Object.hasOwn(configuration, 'apikey'), false);
});
