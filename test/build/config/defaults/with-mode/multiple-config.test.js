'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../../utils/test-utils');

describe('multiple config files', () => {
    it('Uses dev config when development mode is supplied', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--mode', 'development'], false);
        expect(exitCode).toEqual(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toBe(undefined);
        expect(existsSync(resolve(__dirname, './binary/dev.bundle.js'))).toBeTruthy();
    });
});
