/* eslint-disable node/no-unpublished-require */
'use strict';

const { sync: spawnSync } = require('execa');
const path = require('path');
const firstPrompt = 'Will your application have multiple bundles?';

describe('init with core flags', () => {
    it('should output help with --help flag', () => {
        const { stdout, stderr } = spawnSync(path.resolve(__dirname, '../../bin/cli.js'), ['init', '--help'], {
            cwd: path.resolve(__dirname),
            reject: false,
        });
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain(firstPrompt);
        expect(stdout).toContain('Initialize a new webpack configuration');
    });
});
