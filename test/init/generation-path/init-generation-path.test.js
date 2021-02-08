'use strict';

const fs = require('fs');
const rimraf = require('rimraf');
const { join, resolve } = require('path');
const { run } = require('../../utils/test-utils');

const firstPrompt = 'Will your application have multiple bundles?';

const genPath = join(__dirname, 'test-assets');

describe('init generate-path flag', () => {
    beforeEach(() => {
        rimraf.sync(genPath);
    });

    it('should scaffold in the specified path with --generation-path', () => {
        const { stdout } = run(__dirname, ['init', '--generation-path', 'test-assets', '--auto'], false);
        // Test no prompts are present
        expect(stdout).toBeTruthy();
        expect(stdout).not.toContain(firstPrompt);

        // Skip test in case installation fails
        if (!fs.existsSync(resolve(genPath, './yarn.lock'))) {
            return;
        }

        // Test regressively files are scaffolded
        const files = ['./package.json', './src/index.js', './webpack.config.js'];

        files.forEach((file) => {
            expect(fs.existsSync(resolve(genPath, file))).toBeTruthy();
        });

        const webpackConfig = require(join(genPath, 'webpack.config.js'));

        expect(webpackConfig.modules.rules).toEqual([]);

        // Check package json is correctly configured
        const pkgJsonTests = () => {
            const pkgJson = require(join(genPath, './package.json'));
            expect(pkgJson).toBeTruthy();
            expect(pkgJson['devDependencies']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack-dev-server']).toBeTruthy();
            expect(pkgJson['scripts']['build'] == 'webpack').toBeTruthy();
            expect(pkgJson['scripts']['serve'] == 'webpack serve').toBeTruthy();
        };
        expect(pkgJsonTests).not.toThrow();
    });

    it('should scaffold in the current directory', () => {
        // Create test-assets directory
        fs.mkdirSync(genPath);

        const { stdout } = run(genPath, ['init', '--generation-path', './', '--auto'], false);
        // Test no prompts are present
        expect(stdout).toBeTruthy();
        expect(stdout).not.toContain(firstPrompt);

        // Skip test in case installation fails
        if (!fs.existsSync(resolve(genPath, './yarn.lock'))) {
            return;
        }

        // Test regressively files are scaffolded
        const files = ['./package.json', './src/index.js', './webpack.config.js'];

        files.forEach((file) => {
            expect(fs.existsSync(resolve(genPath, file))).toBeTruthy();
        });

        const webpackConfig = require(join(genPath, 'webpack.config.js'));

        expect(webpackConfig.modules.rules).toEqual([]);

        // Check package json is correctly configured
        const pkgJsonTests = () => {
            const pkgJson = require(join(genPath, './package.json'));
            expect(pkgJson).toBeTruthy();
            expect(pkgJson['devDependencies']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack']).toBeTruthy();
            expect(pkgJson['devDependencies']['webpack-dev-server']).toBeTruthy();
            expect(pkgJson['scripts']['build'] == 'webpack').toBeTruthy();
            expect(pkgJson['scripts']['serve'] == 'webpack serve').toBeTruthy();
        };
        expect(pkgJsonTests).not.toThrow();
    });
});
