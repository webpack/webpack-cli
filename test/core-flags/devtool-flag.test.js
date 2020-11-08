'use strict';

const { run } = require('../utils/test-utils');

describe('--devtool flag', () => {
    it('should set devtool option', () => {
        const { stdout, exitCode } = run(__dirname, ['--devtool', 'source-map']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`devtool: 'source-map'`);
    });

    it('should throw error for invalid config', () => {
        const { stderr, exitCode } = run(__dirname, ['--devtool', 'invalid']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Invalid configuration object');
    });
});
