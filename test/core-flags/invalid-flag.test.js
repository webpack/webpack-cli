'use strict';

const { run } = require('../utils/test-utils');

describe('--parallelism flag', () => {
    it('should set parallelism to the value passed', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--output-script-type', 'unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Found the 'invalid-value' problem with the '--output-script-type' argument by path 'output.scriptType'");
        expect(stdout).toBeFalsy();
    });
});
