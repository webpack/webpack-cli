'use strict';

const fs = require('fs');
const { join, resolve } = require('path');
const rimraf = require('rimraf');
const { runPromptWithAnswers } = require('../../utils/test-utils');
const firstPrompt = 'Will your application have multiple bundles?';

const ENTER = '\x0D';
const genPath = join(__dirname, 'test-assets');

describe('init force flag', () => {
    beforeAll(() => {
        rimraf.sync(genPath);
        fs.mkdirSync(genPath);
    });

    afterAll(() => {
        rimraf.sync(genPath);
    });

    it('should scaffold webpack config', async () => {
        const { stdout } = await runPromptWithAnswers(genPath, ['init', '--force'], [`N${ENTER}`, ENTER, ENTER, ENTER, ENTER, ENTER]);

        expect(stdout).toBeTruthy();
        expect(stdout).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!fs.existsSync(resolve(genPath, './yarn.lock'))) {
            return;
        }

        // Test regressively files are scaffolded
        const files = ['./sw.js', './package.json', './src/index.js', './webpack.config.js'];

        // eslint-disable-next-line prettier/prettier
        files.forEach((file) => {
            expect(fs.existsSync(resolve(genPath, file))).toBeTruthy();
        });

        // Check package json is correctly configured
        const pkgJsonTests = () => {
            const pkgJson = require(join(genPath, './package.json'));
            expect(pkgJson).toBeTruthy();
            expect(pkgJson['devDependencies']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack']).toBeTruthy();
            expect(pkgJson['scripts']['build'] == 'webpack').toBeTruthy();
        };
        expect(pkgJsonTests).not.toThrow();
    });
});
