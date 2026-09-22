import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';

for (const initiallyHidden of [false, true]) {
    test(`grid observer settles after leaving grid with summary hidden=${initiallyHidden}`, () => {
        let callback, writes = 0, hidden = initiallyHidden;
        const queue = [];
        class Element {
            closest() { return null; }
        }
        const summary = new Element();
        Object.defineProperty(summary, 'hidden', {
            get: () => hidden,
            set(value) {
                hidden = value;
                writes++;
                queue.push({ target: summary, addedNodes: [] });
            }
        });
        const document = {
            documentElement: {},
            addEventListener() {},
            querySelector: () => null,
            querySelectorAll(selector) {
                if (!selector.startsWith('[data-selection-summary]')) return [];
                return selector.includes(':not([hidden])') && hidden ? [] : [summary];
            }
        };
        vm.runInNewContext(fs.readFileSync(new URL('../src/components/list/selection.js', import.meta.url), 'utf8'), {
            document, Element,
            MutationObserver: class {
                constructor(fn) { callback = fn; }
                observe() {}
            }
        });
        queue.push({ target: new Element(), addedNodes: [] });
        for (let i = 0; i < 20 && queue.length; i++) callback(queue.splice(0));
        assert.equal(queue.length, 0, 'observer must not keep generating hidden mutations');
        assert.equal(hidden, true);
        assert.equal(writes, initiallyHidden ? 0 : 1);
    });
}
