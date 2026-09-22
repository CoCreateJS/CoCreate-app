import test from 'node:test';
import assert from 'node:assert/strict';
import {
    formatCredentialLabel,
    storageIsConfigured,
    storageIsEnabled,
    storageProviderFields,
    storageValue
} from '../src/apps/apis/providers/storage.js';

test('configuration supports existing top-level and nested credentials', () => {
    assert.equal(storageIsConfigured({ provider: 'mongodb', url: 'mongodb://saved' }), true);
    assert.equal(storageIsConfigured({ provider: 'mongodb', credentials: { url: 'mongodb://saved' } }), true);
    assert.equal(storageIsConfigured({ provider: 'mongodb', url: 'placeholder' }), false);
    assert.equal(storageIsConfigured({ provider: 'firestore', projectId: 'project', clientEmail: 'service@example.com' }), false);
    assert.equal(storageIsConfigured({ provider: 'firestore', url: { projectId: 'project', clientEmail: 'service@example.com', privateKey: 'saved-key' } }), true);
    assert.equal(storageValue({ credentials: { url: 'saved' } }, 'url'), 'saved');
});

test('provider credential names and labels match their provider terminology', () => {
    assert.deepEqual(storageProviderFields.mysql, ['connectionUri']);
    assert.deepEqual(storageProviderFields.postgresql, ['connectionUri']);
    assert.deepEqual(storageProviderFields.sqlite, ['databaseUrl', 'authToken']);
    assert.equal(formatCredentialLabel('connectionUri'), 'Connection URI');
    assert.equal(formatCredentialLabel('databaseUrl'), 'Database URL');
    assert.equal(formatCredentialLabel('authToken'), 'Auth token');
    assert.equal(formatCredentialLabel('accessKeyId'), 'AWS Access Key ID');
});

test('wizard eligibility is independent of configuration status', () => {
    const connections = [
        { provider: 'mongodb', enabled: false, url: 'mongodb://saved' },
        { provider: 'mysql', enabled: 'false', url: 'mysql://saved' },
        { provider: 'postgresql', enabled: true },
        { provider: 'sqlite', url: 'file:legacy.db' }
    ];
    assert.deepEqual(connections.filter(storageIsEnabled).map(c => c.provider), ['postgresql', 'sqlite']);
    assert.equal(storageIsConfigured(connections[2]), false);
});
