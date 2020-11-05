'use strict';

const { run } = require('../utils/test-utils');
const helpHeader = 'The build tool for modern web applications';

describe('commands help', () => {
    it('log warning for invalid flag with --help flag', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--help', '--my-flag'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain(`You provided an invalid option '--my-flag'`);
        expect(stdout).toContain(helpHeader);
    });

    it('log warning for invalid flag with help command', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['help', '--my-flag'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain(`You provided an invalid option '--my-flag'`);
        expect(stdout).toContain(helpHeader);
    });

    it('shows flag help with valid flag', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help', '--merge'], false);

        expect(exitCode).toBe(0);
        expect(stdout).not.toContain(helpHeader);
        expect(stdout).toContain('webpack -m, --merge');
        expect(stderr).toHaveLength(0);
    });

    it('should show help for --mode', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--mode', '--help'], false);

        expect(exitCode).toBe(0);
        expect(stdout).not.toContain(helpHeader);
        expect(stdout).toContain('webpack --mode <development | production | none>');
        expect(stdout).toContain('Defines the mode to pass to webpack');
        expect(stderr).toHaveLength(0);
    });

    it('gives precedence to earlier flag in case of multiple flags', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help', '--entry', '--merge'], false);

        expect(exitCode).toBe(0);
        expect(stdout).not.toContain(helpHeader);
        expect(stdout).toContain('webpack --entry <path to entry file>');
        expect(stderr).toHaveLength(0);
    });
});
