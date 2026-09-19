import test from 'node:test';
import assert from 'node:assert/strict';
import { aiQuery, aiIsConfigured, aiValue } from '../src/apps/ai-providers/shared.js';

test('AI records require a saved key and accept providers added to the database', () => {
    assert.deepEqual(aiQuery, { type: 'ai' });
    assert.equal(aiIsConfigured({ provider: 'gemini', key: 'gemini_api_key_placeholder' }), false);
    assert.equal(aiIsConfigured({ provider: 'openai' }), false);
    assert.equal(aiIsConfigured({ provider: 'copilot', key: 'saved-token' }), true);
    assert.equal(aiIsConfigured({ provider: 'custom', credentials: { key: 'saved-key' } }), true);
    assert.equal(aiValue({ key: 'current', credentials: { key: 'previous' } }, 'key'), 'current');
});
