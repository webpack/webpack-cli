'use strict';

const { run } = require('../utils/test-utils');

describe('error', () => {
    it('should log error with stacktrace', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname);

        expect(exitCode).toBe(2);
        expect(stderr).not.toContain('Compilation starting...');
        expect(stderr).not.toContain('Compilation finished');
        expect(stderr).toContain('Error: test');
        expect(stderr).toMatch(/at .+ (.+)/);
        expect(stdout).toBeFalsy();
    });
});
