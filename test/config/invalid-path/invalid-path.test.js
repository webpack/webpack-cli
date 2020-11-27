'use strict';
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('basic config file', () => {
    it('is able to understand and parse a very basic configuration file', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['-c', resolve(__dirname, 'invalid-webpack.config.js')], false);
        expect(exitCode).toBe(2);
        expect(stderr).toContain(`The specified config file doesn't exist in '${resolve(__dirname, 'invalid-webpack.config.js')}'`);
        expect(stdout).toBeFalsy();
    });
});
