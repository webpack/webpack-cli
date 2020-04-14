/* eslint-disable node/no-unpublished-require */
'use strict';

const firstPrompt = 'Will your application have multiple bundles?';
const fs = require('fs');
const { join } = require('path');
const { run } = require('../../../../../test/utils/test-utils');

describe('init auto flag', () => {
    it('should prompt with w/o auto flag', () => {
        const { stdout, stderr } = run(__dirname, ['init'], false);
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(firstPrompt);
    });

    it('should scaffold and not prompt with auto flag', () => {
        const { stdout } = run(__dirname, ['init', '--auto'], false);
        // Test no prompts are present
        expect(stdout).toBeTruthy();
        expect(stdout).not.toContain(firstPrompt);

        // Test regressively files are scaffolded
        const files = ['./sw.js', './package.json', './yarn.lock', './src/index.js'];
        // eslint-disable-next-line prettier/prettier
        files.forEach((file) => {
            console.log(file); // Debug comment
            expect(fs.existsSync(join(__dirname, file))).toBeTruthy();
        });
    });
});
