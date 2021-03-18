'use strict';

const { run } = require('../../utils/test-utils');

describe('--bail flag', () => {
    it('should set bail to true', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--bail']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('bail: true');
    });

    it('should set bail to false', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--no-bail']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('bail: false');
    });
});
