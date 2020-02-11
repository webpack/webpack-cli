'use strict';

const path = require('path');
const execa = require('execa');
const { sync: spawnSync } = execa;

const { run } = require('../../utils/test-utils');

describe('env object', () => {
    it('is able to compile successfully with --prod flag', () => {
        const { stderr, stdout } = run(__dirname, ['--prod']);
        const executable = path.join(__dirname, './bin/main.js');
        const bundledScript = spawnSync('node', [executable]);
        expect(bundledScript.stdout).toBe('environment is production');
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('is able to compile successfully with -p flag', () => {
        const { stderr, stdout } = run(__dirname, ['-p']);
        const executable = path.join(__dirname, './bin/main.js');
        const bundledScript = spawnSync('node', [executable]);
        expect(bundledScript.stdout).toBe('environment is production');
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });
});
