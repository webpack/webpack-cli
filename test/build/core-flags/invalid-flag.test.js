'use strict';

const { runAsync } = require('../../utils/test-utils');

describe('invalid flag value', () => {
    it('should throw an error for the invalid value passed', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--output-script-type', 'unknown']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Invalid value 'unknown' for the '--output-script-type' option");
        expect(stderr).toContain("Expected: 'false | text/javascript | module'");
        expect(stdout).toBeFalsy();
    });
});
