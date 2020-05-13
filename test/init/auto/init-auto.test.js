'use strict';

const fs = require('fs');
const rimraf = require('rimraf');
const { join } = require('path');
const { run } = require('../../utils/test-utils');

const firstPrompt = 'Will your application have multiple bundles?';
const genPath = join(__dirname, 'test-assets');

jest.setTimeout(200000);
describe('init auto flag', () => {
    beforeAll(() => {
        rimraf.sync(genPath);
        fs.mkdirSync(genPath);
    });

    afterAll(() => {
        rimraf.sync(genPath);
    });

    it('should prompt with w/o auto flag', () => {
        const { stdout, stderr } = run(genPath, ['init'], false);
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(firstPrompt);
    });

    it('should scaffold and not prompt with auto flag', () => {
        const { stdout } = run(genPath, ['init', '--auto'], false);
        // Test no prompts are present
        expect(stdout).toBeTruthy();
        expect(stdout).not.toContain(firstPrompt);

        // Test regressively files are scaffolded
        const files = ['sw.js', 'package.json', 'src/index.js'];
        // eslint-disable-next-line prettier/prettier
        files.forEach((file) => {
            expect(fs.existsSync(join(genPath, file))).toBeTruthy();
        });
    });
});
