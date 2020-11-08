'use strict';

const { existsSync } = require('fs');
const { join, resolve } = require('path');
const rimraf = require('rimraf');
const stripAnsi = require('strip-ansi');
const { run, runPromptWithAnswers } = require('../utils/test-utils');

const firstPrompt = '? Loader name (my-loader)';
const ENTER = '\x0D';
const loaderName = 'test-loader';
const loaderPath = join(__dirname, loaderName);
const customLoaderPath = join(__dirname, 'test-assets', 'my-loader');

describe('loader command', () => {
    beforeAll(() => {
        rimraf.sync(loaderPath);
        rimraf.sync(customLoaderPath);
    });

    it('should ask the loader name when invoked', () => {
        const { stdout, stderr } = run(__dirname, ['loader'], false);
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stripAnsi(stdout)).toContain(firstPrompt);
    });

    it('should scaffold loader template with a given name', async () => {
        let { stdout } = await runPromptWithAnswers(__dirname, ['loader'], [`${loaderName}${ENTER}`]);

        expect(stripAnsi(stdout)).toContain(firstPrompt);

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
        let { stdout } = await runPromptWithAnswers(__dirname, ['loader', 'test-assets'], [ENTER]);

        expect(stripAnsi(stdout)).toContain(firstPrompt);

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
        const path = resolve(__dirname, './test-loader/examples/simple/');
        ({ stdout } = run(path, [], false));
        expect(stdout).toContain('test-loader');
    });
});
