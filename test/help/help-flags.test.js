'use strict';

const { run } = require('../utils/test-utils');
const helpHeader = 'The build tool for modern web applications';

describe('commands help', () => {
    it('log warning for invalid flag with --help flag', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help', '--my-flag'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain(`You provided an invalid option '--my-flag'`);
        expect(stdout).toContain(helpHeader);
    });

    it('log warning for invalid flag with help command', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['help', '--my-flag'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain(`You provided an invalid option '--my-flag'`);
        expect(stdout).toContain(helpHeader);
    });

    it('shows flag help with valid flag', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help', '--merge'], false);

        expect(exitCode).toBe(0);
        expect(stderr).not.toContain(helpHeader);
        expect(stdout).toContain('webpack -m, --merge');
    });

    it('should show help for --mode', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--mode', '--help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).not.toContain(helpHeader);
        expect(stdout).toContain('webpack --mode <development | production | none>');
        expect(stdout).toContain('Defines the mode to pass to webpack');
    });

    it('gives precedence to earlier flag in case of multiple flags', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help', '--entry', '--merge'], false);

        expect(exitCode).toBe(0);
        expect(stderr).not.toContain(helpHeader);
        expect(stdout).toContain('webpack --entry <path to entry file>');
    });
});
