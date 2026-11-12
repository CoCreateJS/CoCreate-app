import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import vm from 'node:vm';
import { getData } from '../../CoCreate-modules/utils/src/modules/getData.js';
import { setData } from '../../CoCreate-modules/utils/src/modules/setData.js';

for (const failure of [false, true]) {
    test(`signup workflow bindings ${failure ? 'abort provider failures' : 'send only onboarding inputs and render the navigation result'}`, async () => {
        const attributes = values => ({ nodeType: 1,
            hasAttribute: name => Object.hasOwn(values, name.toLowerCase()),
            getAttribute: name => values[name.toLowerCase()] ?? null,
            closest: () => null });
        const name = { ...attributes({ 'onboardorganization-key': 'organization.name', 'onboardorganization-set-data': 'false' }),
            getValue: () => 'Tenant', setValue: () => assert.fail('Keep the submitted organization name') };
        const host = { ...attributes({ 'onboardorganization-key': 'organization.host[0].name', 'onboardorganization-set-data': 'false' }),
            getValue: () => 'tenant.cocreatejs.com', setValue: () => assert.fail('Keep the submitted hostname') };
        const password = { ...attributes({ key: 'password' }), getValue: () => assert.fail('Account credentials do not enter onboarding') };
        let rendered, ended, aborted;
        const controller = { ...attributes({ 'onboardorganization-key': 'onboardOrganization', 'onboardorganization-get-data': 'false' }),
            getValue: () => assert.fail('Result controller must not enter input'), renderValue: value => { rendered = value; } };
        const elements = [name, host, password, controller];
        const form = { ...attributes({ workflow: 'unique, onboardOrganization' }), elements,
            querySelectorAll: () => elements };
        const source = fs.readFileSync(new URL('../../CoCreate-modules/workflows/src/client.js', import.meta.url), 'utf8');
        const functions = source.slice(source.indexOf('function getWorkflowNames('), source.indexOf('function registerWorkflow('));
        const output = { organizationId: 'tenant', clusterId: 'cluster', status: 'configured', redirect: 'https://tenant.cocreatejs.com/auth/' };
        const run = vm.runInNewContext(`(() => { ${functions}; return runWorkflow; })()`, { getData, setData,
            Socket: { async send(payload) {
                assert.equal(payload.method, 'workflow.onboardOrganization');
                assert.deepEqual(JSON.parse(JSON.stringify(payload.onboardOrganization)), [{ organization: {
                    name: 'Tenant', host: [{ name: 'tenant.cocreatejs.com' }]
                } }]);
                return failure ? { error: ['Storage provisioning is disabled.'] } : { onboardOrganization: output };
            } } });
        await run('onboardOrganization', { element: { closest: () => form }, end: value => { ended = value; }, abort: value => { aborted = value; } });
        if (failure) {
            assert.equal(ended, undefined);
            assert.equal(rendered, undefined);
            assert.equal(aborted.message, 'Storage provisioning is disabled.');
        } else {
            assert.equal(aborted, undefined);
            assert.deepEqual(rendered, output);
            assert.deepEqual(ended.onboardOrganization, output);
        }
    });
}
