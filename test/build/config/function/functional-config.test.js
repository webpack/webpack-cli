'use strict';

const { resolve } = require('path');
const { existsSync } = require('fs');
const { runAsync } = require('../../../utils/test-utils');

describe('functional config', () => {
    it('should work as expected in case of single config', async () => {
        const { stderr, stdout, exitCode } = await runAsync(__dirname, ['--config', resolve(__dirname, 'single-webpack.config.js')]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('./src/index.js');
        expect(existsSync(resolve(__dirname, './dist/dist-single.js'))).toBeTruthy();
    });

    it('should work as expected in case of multiple config', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--config', resolve(__dirname, 'multi-webpack.config.js')]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('first');
        expect(stdout).toContain('second');
        expect(existsSync(resolve(__dirname, './dist/dist-first.js'))).toBeTruthy();
        expect(existsSync(resolve(__dirname, './dist/dist-second.js'))).toBeTruthy();
    });
});
