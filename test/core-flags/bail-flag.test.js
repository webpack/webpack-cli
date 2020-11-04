'use strict';

const { run } = require('../utils/test-utils');

describe('--bail flag', () => {
    it('should set bail to true', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--bail']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain('bail: true');
    });

    it('should set bail to false', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--no-bail']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toContain('bail: false');
    });
});
