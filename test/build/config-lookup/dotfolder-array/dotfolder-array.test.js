'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('dotfolder array config lookup', () => {
    it('should find a webpack array configuration in a dotfolder', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/dist-commonjs.js'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/dist-amd.js'))).toBeTruthy();
    });
});
