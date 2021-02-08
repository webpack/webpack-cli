'use strict';

const fs = require('fs');
const { join, resolve } = require('path');
const rimraf = require('rimraf');
const { runPromptWithAnswers } = require('../../../utils/test-utils');
const firstPrompt = 'Will your application have multiple bundles?';

const ENTER = '\x0D';
const DOWN = '\x1B\x5B\x42';
const genPath = join(__dirname, 'test-assets');

describe('init with Typescript', () => {
    beforeAll(() => {
        rimraf.sync(genPath);
        fs.mkdirSync(genPath);
    });

    it('should use typescript', async () => {
        const { stdout } = await runPromptWithAnswers(
            genPath,
            ['init'],
            [`N${ENTER}`, ENTER, ENTER, `${DOWN}${DOWN}${ENTER}`, ENTER, ENTER, ENTER, ENTER],
        );

        expect(stdout).toBeTruthy();
        expect(stdout).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!fs.existsSync(resolve(genPath, './yarn.lock'))) {
            return;
        }

        // Test regressively files are scaffolded
        const files = ['./package.json', './.yo-rc.json', './tsconfig.json', './src/index.ts', 'webpack.config.js'];

        files.forEach((file) => {
            expect(fs.existsSync(resolve(genPath, file))).toBeTruthy();
        });

        const webpackConfig = require(join(genPath, 'webpack.config.js'));

        expect(webpackConfig.module.rules).toEqual([
            {
                test: /\.(ts|tsx)$/,
                loader: 'ts-loader',
                include: [path.resolve(__dirname, 'src')], // eslint-disable-line
                exclude: [/node_modules/],
            },
        ]);
        expect(webpackConfig.resolve.extensions).toEqual(['.tsx', '.ts', '.js']);

        // Check package json is correctly configured
        const pkgJsonTests = () => {
            const pkgJson = require(join(genPath, './package.json'));
            expect(pkgJson).toBeTruthy();
            expect(pkgJson['devDependencies']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack-dev-server']).toBeTruthy();
            expect(pkgJson['devDependencies']['typescript']).toBeTruthy();
            expect(pkgJson['devDependencies']['ts-loader']).toBeTruthy();
            expect(pkgJson['scripts']['build'] == 'webpack').toBeTruthy();
            expect(pkgJson['scripts']['start'] == 'webpack serve').toBeTruthy();
        };
        expect(pkgJsonTests).not.toThrow();
    });
});
