/* eslint-disable node/no-unpublished-require */
'use strict';

const firstPrompt = '? Plugin name';
const { existsSync } = require('fs');
const { join } = require('path');
const { run, runPromptWithAnswers } = require('../utils/test-utils');

const ENTER = '\x0D';
const pluginName = 'test-plugin';

// Since scaffolding is time consuming
jest.setTimeout(200000);

describe('plugin command', () => {
    it('Should ask the plugin name when invoked', () => {
        const { stdout, stderr } = run(__dirname, ['plugin'], false);
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(firstPrompt);
    });

    it('should scaffold plugin template with a given name', async () => {
        const stdout = await runPromptWithAnswers(__dirname, ['plugin'], [pluginName, ENTER]);

        expect(stdout).toContain(firstPrompt);

        // check if the output directory exists with the appropriate plugin name
        expect(existsSync(join(__dirname, pluginName))).toBeTruthy();

        // Test regressively files are scaffolded
        const files = ['package.json', 'yarn.lock', 'examples', 'src', 'test', 'src/index.js', 'examples/simple/webpack.config.js'];
        // eslint-disable-next-line prettier/prettier
        files.forEach((file) => {
            expect(existsSync(join(__dirname, `${pluginName}/${file}`))).toBeTruthy();
        });
    });
});
