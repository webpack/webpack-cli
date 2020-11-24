'use strict';

const { run } = require('../utils/test-utils');

describe('commands help', () => {
    it('log error for invalid flag with --help flag', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--help', '--my-flag'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`Invalid option '--my-flag'`);
        expect(stderr).toContain(`Run webpack --help to see available commands and arguments.`);
        expect(stdout).toHaveLength(0);
    });

    it('log error for invalid flag with help command', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['help', '--my-flag'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`Invalid option '--my-flag'.`);
        expect(stderr).toContain(`Run webpack --help to see available commands and arguments.`);
        expect(stdout).toHaveLength(0);
    });

    it('log flag help with valid flag', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help', '--merge'], false);

        expect(exitCode).toBe(0);
        expect(stdout).not.toContain('The build tool for modern web applications');
        expect(stdout).toContain('webpack -m, --merge');
        expect(stderr).toHaveLength(0);
    });

    it('log show help for --mode', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--mode', '--help'], false);

        expect(exitCode).toBe(0);
        expect(stdout).not.toContain('The build tool for modern web applications');
        expect(stdout).toContain('webpack --mode <development | production | none>');
        expect(stdout).toContain('Defines the mode to pass to webpack');
        expect(stderr).toHaveLength(0);
    });

    it('log error for multiple flags', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help', '--entry', '--merge'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(
            `You provided multiple commands or arguments - argument '--merge' (alias '-m'), argument '--entry'. Please use only one command at a time.`,
        );
        expect(stdout).toHaveLength(0);
    });
});
