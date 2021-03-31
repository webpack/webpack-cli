'use strict';

const path = require('path');
// eslint-disable-next-line node/no-unpublished-require
const execa = require('execa');

const { sync: spawnSync } = execa;
const { runAsync, isWebpack5 } = require('../../../utils/test-utils');

const devFile = path.join(__dirname, './dist/dev.js');
const prodFile = path.join(__dirname, './dist/prod.js');

describe('env array', () => {
    it('is able to set two different environments for an array configuration', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        if (isWebpack5) {
            const devScript = spawnSync('node', [devFile]);
            const prodScript = spawnSync('node', [prodFile]);

            expect(devScript.stdout).toBe('environment is development');
            expect(prodScript.stdout).toBe('environment is production');
        }
    });
});
