'use strict';

const { run } = require('../utils/test-utils');

describe('--parallelism flag', () => {
    it('should set parallelism to the value passed', () => {
        const { stdout, exitCode } = run(__dirname, ['--parallelism', '50']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain('parallelism: 50');
    });
});
