'use strict';

const { runAsync } = require('../../../utils/test-utils');

describe('error', () => {
    it('should log error with stacktrace', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Error: test');
        expect(stderr).toMatch(/at .+ (.+)/);
        expect(stdout).toBeFalsy();
    });

    it('should log error with stacktrace using the "bundle" command', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['bundle']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Error: test');
        expect(stderr).toMatch(/at .+ (.+)/);
        expect(stdout).toBeFalsy();
    });

    it('should log error with stacktrace using the "serve" command', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['serve']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Error: test');
        expect(stderr).toMatch(/at .+ (.+)/);
        expect(stdout).toBeFalsy();
    });
});
