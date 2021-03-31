'use strict';

const { runAsync } = require('../../utils/test-utils');

describe('--parallelism flag', () => {
    it('should set parallelism to the value passed', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--parallelism', '50']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('parallelism: 50');
    });

    it('should throw error for invalid parallelism value', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--parallelism', '0']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('configuration.parallelism should be >= 1');
        expect(stdout).toBeFalsy();
    });
});
