import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import actionsHelper from '../../CoCreate-modules/actions/test/helpers/actions.cjs';

const markup = readFileSync(new URL('../src/auth/signup.html', import.meta.url), 'utf8');
const attributes = id => Object.fromEntries([...markup.match(new RegExp(`<button\\s+id="${id}"[\\s\\S]*?<\\/button>`))[0]
    .matchAll(/([\w.$-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));

for (const success of [true, false]) {
    test(`signup switches to progress before onboarding and ${success ? 'completes after success' : 'keeps failures out of the completion screen'}`, async () => {
        const actions = actionsHelper.createActions();
        const form = actions.element({ 'data-signup-step': 'organization' }, 'form');
        const element = actions.element(attributes('signup-create-btn'), 'button', form);
        const progress = actions.element(attributes('signup-show-progress'), 'button', form);
        const complete = actions.element(attributes('signup-show-complete'), 'button', form);
        const error = actions.element({ id: 'signup-onboarding-error' }, 'p', form);
        actions.select('#signup-show-progress', [progress]);
        actions.select('#signup-show-complete', [complete]);
        const events = actionsHelper.lifecycle(element);
        let onboarding;
        actions.init([
            ...['validate', 'signUp', 'signIn', 'focus'].map(name => ({ name, callback: action => action.end() })),
            { name: 'click', endEvent: 'clicked', callback: action => { form.setAttribute('data-signup-step', action.element.getAttribute('click.data-signup-step')); action.end(); } },
            { name: 'onboardOrganization', callback: action => { onboarding = action; } }
        ]);
        actions.activate(element);
        for (let i = 0; i < 5; i++) await actions.flush();
        assert.ok(onboarding);
        assert.equal(form.getAttribute('data-signup-step'), 'preparing');
        assert.equal(element.hasAttribute('disabled'), true);
        assert.equal(complete.clickCount, 0);
        if (success) onboarding.end({ onboardOrganization: { status: 'configured' } });
        else onboarding.abort({ message: 'Storage provisioning is disabled.' });
        for (let i = 0; i < 5; i++) await actions.flush();
        assert.equal(form.getAttribute('data-signup-step'), success ? 'complete' : 'preparing');
        assert.equal(complete.clickCount, success ? 1 : 0);
        assert.equal(events[0].type, success ? 'actionsEnd' : 'actionsAbort');
        assert.equal(actions.location.href, 'https://example.test/', 'Navigation requires the separate Open workspace link');
        if (!success) assert.equal(error.valueCalls.at(-1), 'Storage provisioning is disabled.');
    });
}
