'use strict';

const { run } = require('../utils/test-utils');

describe('--parallelism flag', () => {
    it('should set parallelism to the value passed', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--parallelism', '50']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain('parallelism: 50');
    });

    it('should throw error for invalid parallelism value', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--parallelism', '0']);

        expect(stderr).toContain('configuration.parallelism should be >= 1');
        expect(exitCode).toBe(2);
        expect(stdout).toBeFalsy();
    });
});
