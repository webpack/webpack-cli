'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('custom config file', () => {
    it('should work', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--config', resolve(__dirname, 'config.webpack.js')], false);
        console.log(stdout);
        console.log(stderr);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(exitCode).toBe(0);
        expect(existsSync(resolve(__dirname, './binary/a.bundle.js'))).toBeTruthy();
    });
});
