'use strict';

const { run } = require('../utils/test-utils');

describe('--parallelism flag', () => {
    it('should set parallelism to the value passed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--parallelism', '50']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain('parallelism: 50');
    });

    it('should throw error for invalid parallelism value', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--parallelism', '0']);

        expect(exitCode).toBe(2);
        expect(stderr).not.toContain("Compilation 'compiler' starting...");
        expect(stderr).not.toContain("Compilation 'compiler' finished");
        expect(stderr).toContain('configuration.parallelism should be >= 1');
        expect(stdout).toBeFalsy();
    });
});
