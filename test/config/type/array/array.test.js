'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('array', () => {
    it('is able to understand a configuration file in array format', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'amd' starting...");
        expect(stderr).toContain("Compilation 'amd' finished");
        expect(stderr).toContain("Compilation 'commonjs' starting...");
        expect(stderr).toContain("Compilation 'commonjs' finished");
        expect(stdout).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/dist-commonjs.js'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/dist-amd.js'))).toBeTruthy();
    });
});
