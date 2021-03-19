'use strict';

const { existsSync } = require('fs');
const { resolve } = require('path');

const { run } = require('../../../utils/test-utils');

describe('dotfolder single config lookup', () => {
    it('should find a webpack configuration in a dotfolder', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain('Module not found');
        expect(stdout).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/main.js'))).toBeTruthy();
    });
});
