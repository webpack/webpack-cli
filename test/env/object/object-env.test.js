'use strict';

const path = require('path');
const execa = require('execa');
const { sync: spawnSync } = execa;

const { run } = require('../../utils/test-utils');

describe('env object', () => {
    it('is able to set env for an object', () => {
        const { exitCode } = run(__dirname);

        expect(exitCode).toBe(0);

        const executable = path.join(__dirname, './bin/main.js');
        const bundledScript = spawnSync('node', [executable]);
        expect(bundledScript.stdout).toBe('environment is development');
    });
});
