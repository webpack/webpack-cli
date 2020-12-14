'use strict';

const { run } = require('../../utils/test-utils');

describe('bundle command', () => {
    it('should work', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['bundle'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with alias', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['b'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should log error with multi commands', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['bundle', 'info'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Running multiple commands at the same time is not possible');
        expect(stderr).toContain("Found commands: 'bundle', 'info'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error with multi commands', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['b', 'i'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Running multiple commands at the same time is not possible');
        expect(stderr).toContain("Found commands: 'bundle', 'i'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });
});
