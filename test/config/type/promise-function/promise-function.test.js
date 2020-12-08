'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('promise function', () => {
    it('is able to understand a configuration file as a promise', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.config.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        expect(existsSync(resolve(__dirname, './binary/promise.js'))).toBeTruthy();
    });
});
