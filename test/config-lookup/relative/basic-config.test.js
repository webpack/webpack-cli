'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('relative path to config', () => {
    it('should work', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['-c', 'webpack.config.js', '--output-path', './binary/a'], false);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(exitCode).toBe(0);
        expect(existsSync(resolve(__dirname, './binary/a/a.bundle.js'))).toBeTruthy();
    });

    it('should work #2', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['-c', './webpack.config.js', '--output-path', './binary/b'], false);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(exitCode).toBe(0);
        expect(existsSync(resolve(__dirname, './binary/b/a.bundle.js'))).toBeTruthy();
    });
});
