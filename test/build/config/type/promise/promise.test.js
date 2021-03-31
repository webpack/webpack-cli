'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { runAsync } = require('../../../../utils/test-utils');

describe('promise', () => {
    it('is able to understand a configuration file as a promise', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['-c', './webpack.config.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(existsSync(resolve(__dirname, './binary/promise.js'))).toBeTruthy();
    });
});
