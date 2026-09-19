import test from 'node:test';
import assert from 'node:assert/strict';
import { routingQuery, routingKeys, routingValue, routingIsConfigured } from '../src/apps/routing-providers/shared.js';

test('routing credentials recognize existing API records without treating partial credentials as configured', () => {
    assert.equal(routingIsConfigured({ provider: 'cloudns', authId: '123' }), false);
    assert.equal(routingIsConfigured({ provider: 'cloudns', credentials: { authId: '123', authPassword: 'saved' } }), true);
    assert.deepEqual(routingQuery, { type: 'routing' });
    assert.deepEqual(routingKeys({ provider: 'cloudflare' }), ['key']);
    assert.equal(routingIsConfigured({ provider: 'cloudflare', key: 'saved' }), true);
    assert.equal(routingIsConfigured({ provider: 'dnsimple', token: 'saved' }), false);
    assert.equal(routingIsConfigured({ provider: 'dnsimple', accountId: 123, credentials: { token: 'saved' } }), true);
    assert.equal(routingIsConfigured({ provider: 'dnsmadeeasy', apiKey: 'saved' }), false);
    assert.equal(routingIsConfigured({ provider: 'dnsmadeeasy', apiKey: 'saved', secretKey: 'secret' }), true);
    assert.equal(routingIsConfigured({ provider: 'easydns', apiKey: 'saved' }), false);
    assert.equal(routingIsConfigured({ provider: 'easydns', userToken: 'user', apiKey: 'saved' }), true);
    assert.equal(routingIsConfigured({ provider: 'bunny', apiKey: 'placeholder' }), false);
    assert.equal(routingValue({ key: 'primary', credentials: { token: 'legacy' } }, 'key'), 'primary');
});
