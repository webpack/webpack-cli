'use strict';

const { run } = require('../utils/test-utils');

describe('invalid flag value', () => {
    it('should throw an error for the invalid value passed', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--output-script-type', 'unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Invalid value 'unknown' for the '--output-script-type' option");
        expect(stderr).toContain("Expected: 'false | text/javascript | module'");
        expect(stdout).toBeFalsy();
    });
});
