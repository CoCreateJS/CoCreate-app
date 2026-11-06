import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import actionsHelper from '../../CoCreate-modules/actions/test/helpers/actions.cjs';

const markup = readFileSync(new URL('../src/auth/signup.html', import.meta.url), 'utf8');
const button = markup.match(/<button\s+id="signup-create-btn"[\s\S]*?<\/button>/)[0];
const chain = button.match(/actions="([^"]+)"/)[1];

for (const success of [true, false]) {
    test(`signup ${success ? 'waits one minute before tenant navigation' : 'aborts navigation when organization creation fails'}`, async t => {
        t.mock.timers.enable({ apis: ['setTimeout'] });
        const actions = actionsHelper.createActions();
        const element = actions.element({ actions: chain });
        const events = actionsHelper.lifecycle(element);
        let organization;
        actions.init([
            ...['validate', 'signUp', 'signIn'].map(name => ({ name, callback: action => action.end() })),
            { name: 'createOrganization', callback: action => { organization = action; } }
        ]);
        actions.activate(element);
        await actions.flush();
        assert.equal(element.hasAttribute('disabled'), true);
        t.mock.timers.tick(60000);
        await actions.flush();
        assert.equal(actions.location.href, 'https://example.test/', 'the delay cannot start before organization creation returns');
        if (success) {
            element.setAttribute('href', 'https://tenant.test/auth/');
            organization.end({ success: true });
            await actions.flush();
            t.mock.timers.tick(59999);
            await actions.flush();
            assert.equal(actions.location.href, 'https://example.test/');
            assert.equal(element.hasAttribute('disabled'), true, 'disabled state keeps the existing spinner visible');
            assert.equal(events.length, 0);
            t.mock.timers.tick(1);
            await actions.flush();
            assert.equal(actions.location.href, 'https://tenant.test/auth/');
            assert.equal(events[0].type, 'actionsEnd');
        } else {
            organization.abort();
            t.mock.timers.tick(60000);
            await actions.flush();
            assert.equal(actions.location.href, 'https://example.test/');
            assert.equal(element.hasAttribute('disabled'), false);
            assert.equal(events[0].type, 'actionsAbort');
        }
    });
}
