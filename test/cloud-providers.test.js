import test from 'node:test';
import assert from 'node:assert/strict';
import { cloudKeys, cloudValue, cloudIsConfigured, cloudProviderLabels, cloudQuery } from '../src/apps/cloud-providers/shared.js';
import { storageIsEnabled } from '../src/apps/storage-providers/shared.js';

test('cloud providers use their provisioning credential requirements', () => {
    assert.equal(Object.keys(cloudProviderLabels).length, 8);
    assert.deepEqual(cloudKeys({ provider: 'aws' }), ['accessKeyId', 'secretAccessKey']);
    assert.equal(cloudIsConfigured({ provider: 'aws', credentials: { accessKeyId: 'id', secretAccessKey: 'secret' } }), true);
    assert.equal(cloudIsConfigured({ provider: 'aws', accessKeyId: 'id' }), false);
    assert.equal(cloudIsConfigured({ provider: 'hetzner', key: 'existing-token' }), true);
    assert.equal(cloudValue({ provider: 'vultr', key: 'old', apiKey: 'new' }, 'apiKey'), 'new');
});

test('disabled and unconfigured are independent, and queries only include cloud records', () => {
    assert.equal(storageIsEnabled({ provider: 'aws', enabled: false }), false);
    assert.equal(storageIsEnabled({ provider: 'aws', enabled: true }), true);
    assert.equal(cloudIsConfigured({ provider: 'aws', enabled: true }), false);
    assert.deepEqual(cloudQuery, { type: 'cloud' });
});
