'use strict';

const path = require('path');
// eslint-disable-next-line node/no-unpublished-require
const execa = require('execa');
const { sync: spawnSync } = execa;

const { runAsync, isWebpack5 } = require('../../../utils/test-utils');

describe('env object', () => {
    it('is able to set env for an object', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        if (isWebpack5) {
            const executable = path.join(__dirname, './dist/main.js');
            const bundledScript = spawnSync('node', [executable]);
            expect(bundledScript.stdout).toBe('environment is development');
        }
    });
});
