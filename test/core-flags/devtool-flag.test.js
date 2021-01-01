'use strict';

const { run } = require('../utils/test-utils');

describe('--devtool flag', () => {
    it('should set devtool option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--devtool', 'source-map']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`devtool: 'source-map'`);
    });

    it('should set devtool option to false', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--no-devtool']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`devtool: false`);
    });

    it('should log error for invalid config', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--devtool', 'invalid']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Invalid configuration object');
        expect(stdout).toBeFalsy();
    });
});
