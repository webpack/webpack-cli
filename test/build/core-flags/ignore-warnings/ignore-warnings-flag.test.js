'use strict';

const { run } = require('../../../utils/test-utils');

describe('ignore-warnings', () => {
    it('should ignore the warning emitted', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--ignore-warnings', /Generated Warning/]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain('Module Warning (from ./my-warning-loader.js):');
        expect(stdout).not.toContain('Generated Warning');
    });

    it('should reset options.ignoreWarnings', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--ignore-warnings', /Generated Warning/, '--ignore-warnings-reset']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Module Warning (from ./my-warning-loader.js):');
        expect(stdout).toContain('Generated Warning');
    });

    it('should throw error for an invalid value', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--ignore-warnings', 'abc']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`Invalid value 'abc' for the '--ignore-warnings' option`);
        expect(stderr).toContain(`Expected: 'regular expression (example: /ab?c*/)'`);
        expect(stdout).toBeFalsy();
    });
});
