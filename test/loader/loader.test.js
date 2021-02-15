'use strict';

const { existsSync, mkdirSync } = require('fs');
const { join, resolve } = require('path');
const rimraf = require('rimraf');
const { run, runPromptWithAnswers } = require('../utils/test-utils');

const firstPrompt = '? Loader name (my-loader)';
const ENTER = '\x0D';
const loaderName = 'test-loader';
const loaderPath = join(__dirname, loaderName);
const defaultLoaderPath = join(__dirname, 'my-loader');
const genPath = join(__dirname, 'test-assets');
const customLoaderPath = join(genPath, loaderName);

describe('loader command', () => {
    beforeEach(() => {
        rimraf.sync(defaultLoaderPath);
        rimraf.sync(loaderPath);
        rimraf.sync(genPath);
    });

    it('should ask the loader name when invoked', () => {
        const { stdout, stderr } = run(__dirname, ['loader'], false);
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(firstPrompt);
    });

    it('should scaffold loader with default name if no loader name provided', async () => {
        let { stdout } = await runPromptWithAnswers(__dirname, ['loader'], [`${ENTER}`]);

        expect(stdout).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!existsSync(resolve(defaultLoaderPath, './yarn.lock'))) {
            return;
        }

        // Check if the output directory exists with the appropriate loader name
        expect(existsSync(defaultLoaderPath)).toBeTruthy();

        // All test files are scaffolded
        const files = ['package.json', 'examples', 'src', 'test', 'src/index.js', 'examples/simple/webpack.config.js'];

        files.forEach((file) => {
            expect(existsSync(defaultLoaderPath, file)).toBeTruthy();
        });

        // Check if the the generated loader works successfully
        const path = resolve(__dirname, './my-loader/examples/simple/');
        ({ stdout } = run(path, [], false));
        expect(stdout).toContain('my-loader');
    });

    it('should scaffold loader template with a given name', async () => {
        let { stdout } = await runPromptWithAnswers(__dirname, ['loader'], [`${loaderName}${ENTER}`]);

        expect(stdout).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!existsSync(resolve(loaderPath, './yarn.lock'))) {
            return;
        }

        // Check if the output directory exists with the appropriate loader name
        expect(existsSync(loaderPath)).toBeTruthy();

        // All test files are scaffolded
        const files = ['package.json', 'examples', 'src', 'test', 'src/index.js', 'examples/simple/webpack.config.js'];

        files.forEach((file) => {
            expect(existsSync(loaderPath, file)).toBeTruthy();
        });

        // Check if the the generated loader works successfully
        const path = resolve(__dirname, './test-loader/examples/simple/');
        ({ stdout } = run(path, [], false));
        expect(stdout).toContain('test-loader');
    });

    it('should scaffold loader template in the specified path', async () => {
        let { stdout } = await runPromptWithAnswers(__dirname, ['loader', 'test-assets'], [`${loaderName}${ENTER}`]);

        expect(stdout).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!existsSync(resolve(customLoaderPath, './yarn.lock'))) {
            return;
        }

        // Check if the output directory exists with the appropriate loader name
        expect(existsSync(customLoaderPath)).toBeTruthy();

        // All test files are scaffolded
        const files = ['package.json', 'examples', 'src', 'test', 'src/index.js', 'examples/simple/webpack.config.js'];

        files.forEach((file) => {
            expect(existsSync(customLoaderPath, file)).toBeTruthy();
        });

        // Check if the the generated loader works successfully
        const path = resolve(customLoaderPath, './examples/simple/');
        ({ stdout } = run(path, [], false));
        expect(stdout).toContain('test-loader');
    });

    it('should scaffold loader template in the current directory', async () => {
        // Create test-assets directory
        mkdirSync(genPath);

        let { stdout } = await runPromptWithAnswers(genPath, ['loader', './'], [`${loaderName}${ENTER}`]);

        expect(stdout).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!existsSync(resolve(customLoaderPath, './yarn.lock'))) {
            return;
        }

        // Check if the output directory exists with the appropriate loader name
        expect(existsSync(customLoaderPath)).toBeTruthy();

        // All test files are scaffolded
        const files = ['package.json', 'examples', 'src', 'test', 'src/index.js', 'examples/simple/webpack.config.js'];

        files.forEach((file) => {
            expect(existsSync(customLoaderPath, file)).toBeTruthy();
        });

        // Check if the the generated loader works successfully
        const path = resolve(customLoaderPath, './examples/simple/');
        ({ stdout } = run(path, [], false));
        expect(stdout).toContain('test-loader');
    });
});
