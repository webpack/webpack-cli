'use strict';

const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('custom config file', () => {
    it('should work with cjs format', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', resolve(__dirname, 'config.webpack.js')], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with esm format', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', resolve(__dirname, 'config.webpack.mjs')], false);

        if (/Unexpected token/.test(stderr)) {
            expect(exitCode).toBe(2);
            expect(stdout).toBeFalsy();
        } else {
            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toBeTruthy();
        }
    });
});
