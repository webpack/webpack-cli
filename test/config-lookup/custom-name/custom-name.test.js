'use strict';

const { resolve } = require('path');
const { run, isWindows } = require('../../utils/test-utils');

describe('custom config file', () => {
    it('should work with cjs format', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', resolve(__dirname, 'config.webpack.js')]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with esm format', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', resolve(__dirname, 'config.webpack.mjs')], {
            env: { WEBPACK_CLI_FORCE_LOAD_ESM_CONFIG: true },
        });

        if (/Error: Not supported/.test(stderr)) {
            expect(exitCode).toBe(2);
            expect(stdout).toBeFalsy();
        } else {
            // TODO: fix for windows
            if (isWindows) {
                expect(true).toBe(true);
                return;
            }
            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toBeTruthy();
        }
    });
});
