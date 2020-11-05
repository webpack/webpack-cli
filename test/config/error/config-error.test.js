'use strict';
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('config error', () => {
    it('should throw error with invalid configuration', () => {
        const { stderr, exitCode } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')]);

        expect(stderr).toContain('Invalid configuration object');
        expect(stderr).toContain(`"development" | "production" | "none"`);
        expect(exitCode).toBe(2);
    });

    it('should throw syntax error and exit with non-zero exit code', () => {
        const { stderr, exitCode } = run(__dirname, ['-c', resolve(__dirname, 'syntax-error.js')]);

        expect(stderr).toContain('SyntaxError: Unexpected token');
        expect(exitCode).toBe(2);
    });
});
