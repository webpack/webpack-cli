'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { runAsync } = require('../../../../utils/test-utils');

describe('function async', () => {
    it('is able to understand a configuration file as a function', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(existsSync(resolve(__dirname, './binary/functor.js'))).toBeTruthy();
    });
});
