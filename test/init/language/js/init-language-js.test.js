'use strict';

const fs = require('fs');
const { join, resolve } = require('path');
const rimraf = require('rimraf');
const { runPromptWithAnswers } = require('../../../utils/test-utils');
const firstPrompt = 'Will your application have multiple bundles?';

const ENTER = '\x0D';
const DOWN = '\x1B\x5B\x42';
const genPath = join(__dirname, 'test-assets');

jest.setTimeout(60000);

describe('init with Typescript', () => {
    beforeAll(() => {
        rimraf.sync(genPath);
        fs.mkdirSync(genPath);
    });

    afterAll(() => {
        rimraf.sync(genPath);
    });

    it('should use typescript', async () => {
        const { stdout } = await runPromptWithAnswers(
            genPath,
            ['init'],
            [`N${ENTER}`, ENTER, ENTER, `${DOWN}${DOWN}${ENTER}`, ENTER, ENTER],
        );

        expect(stdout).toBeTruthy();
        expect(stdout).toContain(firstPrompt);

        // Test regressively files are scaffolded
        const files = ['./package.json', './yarn.lock', './.yo-rc.json', './tsconfig.json', './src/index.ts'];

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
            expect(pkgJson['devDependencies']['typescript']).toBeTruthy();
            expect(pkgJson['devDependencies']['ts-loader']).toBeTruthy();
            expect(pkgJson['scripts']['build'] == 'webpack').toBeTruthy();
        };
        expect(pkgJsonTests).not.toThrow();
    });
});
