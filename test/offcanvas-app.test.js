import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '../src');
const appsRoot = path.join(root, 'apps');
const shells = fs.readdirSync(appsRoot, { recursive: true })
    .filter(file => file.endsWith('/aside.html'));
const read = file => fs.readFileSync(file, 'utf8');

for (const shell of shells) {
    test(`${path.dirname(shell)} has complete modular record and create routes`, () => {
        const directory = path.join(appsRoot, path.dirname(shell));
        const source = read(path.join(directory, 'aside.html'));
        assert.match(source, /class="offcanvas-app-shell /);
        assert.match(source, /src="\/components\/offcanvas-app\/header.html"/);
        const token = source.match(/value-replacement="([^"]+)"/)[1];
        assert.doesNotMatch(token, /\s/);
        for (const view of ['details', 'form', 'codearea']) {
            assert.ok(source.includes(`id="${token}-${view}-view"`));
            assert.ok(source.includes(`aria-labelledby="${token}-${view}-btn"`));
        }
        for (const src of source.matchAll(/\bsrc="([^\"]+)"/g)) {
            assert.ok(fs.existsSync(path.join(root, src[1])), src[1]);
        }
        assert.equal(fs.existsSync(path.join(directory, 'details.html')), false);
        assert.equal(fs.existsSync(path.join(directory, 'form.html')), false);
        const create = read(path.join(directory, 'create.html'));
        assert.match(create, /class="offcanvas-app-create /);
        assert.match(create, /src="\/apps\/[^\"]+\/components\/form.html"/);
        for (const view of ['details', 'form']) {
            const body = read(path.join(directory, 'components', `${view}.html`));
            assert.match(body, /state-id="offcanvas-app-form"/);
            assert.doesNotMatch(body, /src="\/apps\/[^\"]+\/header.html"/);
            if (view === 'form') assert.match(body, /src="\/components\/offcanvas-app\/footer.html"/);
        }
        assert.match(source, /src="\/components\/offcanvas-app\/codearea.html"/);
        assert.equal(fs.existsSync(path.join(directory, 'codearea.html')), false);
        assert.equal(fs.existsSync(path.join(directory, 'header.html')), false);
    });
}

test('shared JSON editor keeps save and clipboard controls in shared components', () => {
    const source = read(path.join(root, 'components/offcanvas-app/codearea.html'));
    assert.match(source, /state-id="offcanvas-app-form"/);
    assert.match(source, /src="\/components\/codearea\/"/);
    assert.match(source, /src="\/components\/offcanvas-app\/footer.html"/);
    assert.match(read(path.join(root, 'components/codearea/index.html')), /value-evaluate="false"/);
});
