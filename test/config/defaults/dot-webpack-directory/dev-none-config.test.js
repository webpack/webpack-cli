'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('multiple config files', () => {
    it('Uses dev config when both dev and none are present', () => {
        const { stdout, stderr, exitCode } = run(__dirname, [], false);
        expect(exitCode).toEqual(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toBe(undefined);
        expect(existsSync(resolve(__dirname, './binary/dev.bundle.js'))).toBeTruthy();
    });
});
