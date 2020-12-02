'use strict';

const { run } = require('../utils/test-utils');

describe('invalid flag value', () => {
    it('should throw an error for the invalid value passed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--output-script-type', 'unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Found the 'invalid-value' problem with the '--output-script-type' argument by path 'output.scriptType'");
        expect(stdout).toBeFalsy();
    });
});
