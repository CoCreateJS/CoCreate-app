import assert from 'node:assert/strict';
import test from 'node:test';
import { astAsync } from '@cocreate/utils';
import github from '../src/apps/endpoints/config/GitHub/data.js';
import base from '../src/apps/endpoints/config/data.js';

async function resolve(name, data) {
    const endpoint = [...github.object, ...base.object].find(item => item.name === name);
    const sandbox = { Buffer, owner: 'managed-owner', $payload: { data }, $data: { data } };
    for (const [key, action] of Object.entries(endpoint.actions || {})) {
        Object.assign(sandbox, await astAsync({ executeAST: { [key]: action }, sandbox }));
    }
    return astAsync({ executeAST: {
        method: endpoint.method, endpoint: endpoint.endpoint,
        ...(endpoint.data && { data: endpoint.data }),
        ...(endpoint.searchParams && { searchParams: endpoint.searchParams })
    }, sandbox });
}

test('template endpoint copies only the default branch into a private managed repository', async () => {
    const result = await resolve('create-repository-from-template', { name: 'tenant-id', templateOwner: 'CoCreateJS', templateRepository: 'CoCreate-app-template' });
    assert.equal(result.endpoint, '/repos/CoCreateJS/CoCreate-app-template/generate');
    assert.deepEqual(result.data, { owner: 'managed-owner', name: 'tenant-id', private: true, include_all_branches: false });
    assert.equal(base.object.some(item => item.name === 'create-organization-repository'), false, 'Do not retain the empty-repository creation path');
});

test('config lookup reads main through the managed API owner', async () => {
    const result = await resolve('get-repository-file', { name: 'tenant-id', path: 'CoCreate.config.js', branch: 'main', owner: 'forged-owner' });
    assert.equal(result.endpoint, '/repos/managed-owner/tenant-id/contents/CoCreate.config.js');
    assert.deepEqual(result.searchParams, { ref: 'main' });
});

test('config update commits UTF-8 content against the known file SHA on main', async () => {
    const content = 'export default { name: "Tenant é", host: { $branch: {} } };\n';
    const result = await resolve('update-repository-file', { name: 'tenant-id', path: 'CoCreate.config.js', branch: 'main', sha: 'file-sha', content, message: 'Initialize config' });
    assert.equal(result.method, 'put');
    assert.deepEqual(result.data, { message: 'Initialize config', branch: 'main', sha: 'file-sha', content: Buffer.from(content).toString('base64') });
    await assert.rejects(resolve('update-repository-file', { name: 'tenant-id', path: 'CoCreate.config.js', branch: 'main', content }), /existing file SHA/);
});

test('dev and test branches start from the configured main commit', async () => {
    for (const branch of ['dev', 'test']) {
        const result = await resolve('create-repository-branch', { name: 'tenant-id', branch, sha: 'configured-commit' });
        assert.equal(result.endpoint, '/repos/managed-owner/tenant-id/git/refs');
        assert.deepEqual(result.data, { ref: `refs/heads/${branch}`, sha: 'configured-commit' });
    }
});

test('deploy key registration sends only a public key and grants write access to one repository', async () => {
    const result = await resolve('create-repository-deploy-key', { name: 'tenant-id', publicKey: 'ssh-rsa AAAA', privateKey: 'must-not-be-sent', owner: 'forged-owner' });
    assert.equal(result.method, 'post');
    assert.equal(result.endpoint, '/repos/managed-owner/tenant-id/keys');
    assert.deepEqual(result.data, { title: 'CoCreate repository tenant-id', key: 'ssh-rsa AAAA', read_only: false });
    await assert.rejects(resolve('create-repository-deploy-key', { name: 'tenant-id', publicKey: 'invalid' }), /SSH public key/);
});

test('SSH host keys are obtained from the GitHub metadata endpoint', async () => {
    const result = await resolve('get-github-ssh-host-keys', {});
    assert.equal(result.method, 'get');
    assert.equal(result.endpoint, '/meta');
});
