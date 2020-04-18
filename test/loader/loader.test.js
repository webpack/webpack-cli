/* eslint-disable node/no-unpublished-require */
'use strict';

const firstPrompt = '? Loader name (my-loader)';
const { existsSync } = require('fs');
const { join } = require('path');
const { run, runPromptWithAnswers } = require('../utils/test-utils');

const ENTER = '\x0D';
const loaderName = 'test-loader';

// Since scaffolding is time consuming
jest.setTimeout(200000);

describe('loader command', () => {
    it('Should ask the loader name when invoked', () => {
        const { stdout, stderr } = run(__dirname, ['loader'], false);
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(firstPrompt);
    });

    it('should scaffold loader template with a given name', async () => {
        const stdout = await runPromptWithAnswers(__dirname, ['loader'], [loaderName, ENTER]);

        expect(stdout).toContain(firstPrompt);

        // check if the output directory exists with the appropriate loader name
        expect(existsSync(join(__dirname, loaderName))).toBeTruthy();

        // Test regressively files are scaffolded
        const files = ['package.json', 'yarn.lock', 'examples', 'src', 'test', 'src/index.js', 'examples/simple/webpack.config.js'];
        // eslint-disable-next-line prettier/prettier
        files.forEach((file) => {
            expect(existsSync(join(__dirname, `${loaderName}/${file}`))).toBeTruthy();
        });
    });
});
