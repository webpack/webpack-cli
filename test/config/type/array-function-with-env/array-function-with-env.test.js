'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('array of functions with env', () => {
    it('is able to understand a configuration file as a function', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--mode', 'development'], false);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(exitCode).toBe(0);

        // Should generate the appropriate files
        expect(existsSync(resolve(__dirname, './dist/a-dev.js'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/b-dev.js'))).toBeTruthy();
    });
});
