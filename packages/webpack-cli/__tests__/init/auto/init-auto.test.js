/* eslint-disable node/no-unpublished-require */
'use strict';

const { sync: spawnSync } = require('execa');
const path = require('path');
const firstPrompt = 'Will your application have multiple bundles?';
const fs = require('fs');
const { join } = require('path');

describe('init auto flag', () => {
    it('should prompt with w/o auto flag', () => {
        const { stdout, stderr } = spawnSync(path.resolve(__dirname, '../../bin/cli.js'), ['init'], {
            cwd: path.resolve(__dirname),
            reject: false,
        });
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(firstPrompt);
    });

    it('should scaffold and not prompt with auto flag', () => {
        const { stdout } = spawnSync(path.resolve(__dirname, '../bin/cli.js'), ['init', '--auto'], {
            cwd: path.resolve(__dirname),
            reject: false,
        });
        // Test no prompts are present
        expect(stdout).toBeTruthy();
        expect(stdout).not.toContain(firstPrompt);

        // Test regressively files are scaffolded
        const files = ['./sw.js', './package.json', './yarn.lock', './src/index.js'];
        // eslint-disable-next-line prettier/prettier
        files.forEach((file) => {
            expect(fs.existsSync(join(__dirname, file))).toBeTruthy();
        });
    });
});
