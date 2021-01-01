'use strict';

const { run } = require('../utils/test-utils');

describe('--profile flag', () => {
    it('should set profile to true', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--profile']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('profile: true');
    });

    it('should set profile to false', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--no-profile']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('profile: false');
    });
});
