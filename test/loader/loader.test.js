/* eslint-disable node/no-unpublished-require */
'use strict';

const { existsSync } = require('fs');
const { join, resolve } = require('path');
const rimraf = require('rimraf');
const { run, runPromptWithAnswers } = require('../utils/test-utils');

const firstPrompt = '? Loader name (my-loader)';
const ENTER = '\x0D';
const loaderName = 'test-loader';
const loaderPath = join(__dirname, loaderName);

// Since scaffolding is time consuming

jest.setTimeout(60000);

describe('loader command', () => {
    beforeAll(() => {
        rimraf.sync(loaderPath);
    });

    it('Should ask the loader name when invoked', () => {
        const { stdout, stderr } = run(__dirname, ['loader'], false);
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(firstPrompt);
    });

    it('should scaffold loader template with a given name', async () => {
        let { stdout } = await runPromptWithAnswers(__dirname, ['loader'], [`${loaderName}${ENTER}`]);

        expect(stdout).toContain(firstPrompt);

        // Skip test in case installation fails
        if (!existsSync(resolve(loaderPath, './yarn.lock'))) {
            return;
        }

        // check if the output directory exists with the appropriate loader name
        expect(existsSync(join(__dirname, loaderName))).toBeTruthy();

        // All test files are scaffolded
        const files = ['package.json', 'examples', 'src', 'test', 'src/index.js', 'examples/simple/webpack.config.js'];

        files.forEach((file) => {
            expect(existsSync(join(__dirname, `${loaderName}/${file}`))).toBeTruthy();
        });

        //check if the the generated plugin works successfully
        const path = resolve(__dirname, './test-loader/examples/simple/');
        ({ stdout } = run(path, [], false));
        expect(stdout).toContain('test-loader');
    });
});
