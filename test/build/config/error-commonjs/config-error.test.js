'use strict';
const { resolve } = require('path');
const { runAsync } = require('../../../utils/test-utils');

describe('config error', () => {
    it('should throw error with invalid configuration', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')]);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Invalid configuration object');
        expect(stderr).toContain(`"development" | "production" | "none"`);
        expect(stdout).toBeFalsy();
    });

    it('should throw syntax error and exit with non-zero exit code', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['-c', resolve(__dirname, 'syntax-error.js')]);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('SyntaxError: Unexpected token');
        expect(stdout).toBeFalsy();
    });
});
