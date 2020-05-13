'use strict';

const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const { runPromptWithAnswers } = require('../../utils/test-utils');
const firstPrompt = 'Will your application have multiple bundles?';

const ENTER = '\x0D';
const genPath = path.join(__dirname, 'test-assets');

jest.setTimeout(60000);

describe('init', () => {
    beforeAll(() => {
        rimraf.sync(genPath);
        fs.mkdirSync(genPath);
    });

    afterAll(() => {
        rimraf.sync(genPath);
    });

    it('should scaffold when given answers', async () => {
        const { stdout } = await runPromptWithAnswers(genPath, ['init'], [`N${ENTER}`, ENTER, ENTER, ENTER, ENTER, ENTER]);

        expect(stdout).toBeTruthy();
        expect(stdout).toContain(firstPrompt);

        // Test regressively files are scaffolded
        const files = ['sw.js', 'package.json', 'src/index.js'];
        // eslint-disable-next-line prettier/prettier
        files.forEach((file) => {
            expect(fs.existsSync(path.join(genPath, file))).toBeTruthy();
        });

        // Check package json is correctly configured
        const pkgJsonTests = () => {
            const pkgJson = require(path.join(genPath, './package.json'));
            expect(pkgJson).toBeTruthy();
            expect(pkgJson['devDependencies']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack']).toBeTruthy();
            expect(pkgJson['scripts']['build'] == 'webpack').toBeTruthy();
        };
        expect(pkgJsonTests).not.toThrow();
    });
});
