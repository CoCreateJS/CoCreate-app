import test from 'node:test';
import assert from 'node:assert/strict';
import { storageIsConfigured, storageIsEnabled, storageValue } from '../src/apps/storage-providers/shared.js';

test('configuration supports existing top-level and nested credentials', () => {
    assert.equal(storageIsConfigured({ provider: 'mongodb', url: 'mongodb://saved' }), true);
    assert.equal(storageIsConfigured({ provider: 'mongodb', credentials: { url: 'mongodb://saved' } }), true);
    assert.equal(storageIsConfigured({ provider: 'mongodb', url: 'placeholder' }), false);
    assert.equal(storageIsConfigured({ provider: 'firestore', projectId: 'project', clientEmail: 'service@example.com' }), false);
    assert.equal(storageIsConfigured({ provider: 'firestore', url: { projectId: 'project', clientEmail: 'service@example.com', privateKey: 'saved-key' } }), true);
    assert.equal(storageValue({ credentials: { url: 'saved' } }, 'url'), 'saved');
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
