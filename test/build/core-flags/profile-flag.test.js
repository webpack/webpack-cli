'use strict';

const { runAsync } = require('../../utils/test-utils');

describe('--profile flag', () => {
    it('should set profile to true', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--profile']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('profile: true');
    });

    it('should set profile to false', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--no-profile']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('profile: false');
    });
});
