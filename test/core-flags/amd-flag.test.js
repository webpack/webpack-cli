'use strict';

const { run } = require('../utils/test-utils');

describe('--no-amd flag', () => {
    it('throw error for --amd', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--amd']);

        expect(stderr).toContain('Invalid configuration object');
        expect(stderr).toContain('configuration.amd should be false');
        expect(exitCode).toBe(2);
        expect(stdout).toBeFalsy();
    });

    it('should accept --no-amd', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--no-amd']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain('amd: false');
    });
});
