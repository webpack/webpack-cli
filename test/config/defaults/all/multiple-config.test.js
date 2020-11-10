'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('Default configuration files: ', () => {
    it('Uses prod config from dot folder if present', () => {
        const { stdout, stderr, exitCode } = run(__dirname, [], false);
        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).not.toBe(undefined);
        expect(existsSync(resolve(__dirname, './binary/prod.bundle.js'))).toBeTruthy();
    });
});
