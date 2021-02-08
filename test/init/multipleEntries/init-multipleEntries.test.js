'use strict';

const fs = require('fs');
const { join, resolve } = require('path');
const rimraf = require('rimraf');
const { runPromptWithAnswers } = require('../../utils/test-utils');
const firstPrompt = 'Will your application have multiple bundles?';

const ENTER = '\x0D';
const genPath = join(__dirname, 'test-assets');

describe('init with multiple entries', () => {
    beforeAll(() => {
        rimraf.sync(genPath);
        fs.mkdirSync(genPath);
    });

    it('should scaffold with multiple entries', async () => {
        const { stdout } = await runPromptWithAnswers(
            genPath,
            ['init'],
            [`Y${ENTER}`, `a, b${ENTER}`, ENTER, ENTER, ENTER, ENTER, ENTER, ENTER, ENTER, ENTER],
        );

        expect(stdout).toBeTruthy();
        expect(stdout).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!fs.existsSync(resolve(genPath, './yarn.lock'))) {
            return;
        }

        // Test regressively files are scaffolded
        const files = ['./package.json', './src/a.js', './src/b.js', './.yo-rc.json', './webpack.config.js'];

        files.forEach((file) => {
            expect(fs.existsSync(resolve(genPath, file))).toBeTruthy();
        });

        const webpackConfig = require(join(genPath, 'webpack.config.js'));

        expect(webpackConfig.entry).toEqual({
            a: './src/a.js',
            b: './src/b.js',
        });
        expect(webpackConfig.module.rules).toEqual([]);

        // Check if package.json is correctly configured
        const pkgJsonTests = () => {
            const pkgJson = require(join(genPath, './package.json'));
            expect(pkgJson).toBeTruthy();
            expect(pkgJson['devDependencies']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack-dev-server']).toBeTruthy();
            expect(pkgJson['devDependencies']['terser-webpack-plugin']).toBeTruthy();
            expect(pkgJson['scripts']['build'] == 'webpack').toBeTruthy();
            expect(pkgJson['scripts']['serve'] == 'webpack-dev-server').toBeTruthy();
        };
        expect(pkgJsonTests).not.toThrow();
    });
});
