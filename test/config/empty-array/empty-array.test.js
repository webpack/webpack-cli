'use strict';
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('config flag with empty config file', () => {
    it('should throw error with no configuration or index file', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')]);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(exitCode).toBe(0);
    });
});
