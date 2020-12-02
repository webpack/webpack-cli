'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('multiple dev config files with webpack.config.js', () => {
    it('Uses webpack.config.development.js', () => {
        const { stdout, stderr, exitCode } = run(__dirname, [], false);
        expect(exitCode).toEqual(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).not.toBe(undefined);
        expect(existsSync(resolve(__dirname, './binary/dev.folder.js'))).toBeTruthy();
    });
});
