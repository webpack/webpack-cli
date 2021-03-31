'use strict';
const { existsSync } = require('fs');
const { resolve } = require('path');
const { runAsync } = require('../../../../utils/test-utils');

describe('multiple dev config files with webpack.config.js', () => {
    it('Uses webpack.config.development.js', async () => {
        const { stdout, stderr, exitCode } = await runAsync(__dirname, [], false);
        expect(exitCode).toEqual(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toBe(undefined);
        expect(existsSync(resolve(__dirname, './binary/dev.folder.js'))).toBeTruthy();
    });
});
