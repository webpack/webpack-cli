'use strict';

const { run } = require('../utils/test-utils');

describe('error', () => {
    it('should log error with stacktrace', async () => {
        const { stderr, stdout, exitCode } = await run(__dirname);

        expect(stderr).toContain('Error: test');
        expect(stderr).toMatch(/at .+ (.+)/);
        expect(stdout).toBeFalsy();
        expect(exitCode).toBe(2);
    });
});
