'use strict';

const { run } = require('../utils/test-utils');
const helpHeader = 'The build tool for modern web applications';

describe('commands help', () => {
    it('shows help for subcommands', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['serve', 'help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack s | serve');
    });

    it('shows help information with subcommands as an arg', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['help', 'serve'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain('webpack s | serve');
        expect(stderr).toHaveLength(0);
    });

    it('shows warning for invalid command with --help flag', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--help', 'myCommand'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain(`You provided an invalid command 'myCommand'`);
        expect(stdout).toContain(helpHeader);
    });

    it('shows warning for invalid command with help command', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['help', 'myCommand'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain(`You provided an invalid command 'myCommand'`);
        expect(stdout).toContain(helpHeader);
    });

    it('gives precedence to earlier command in case of multiple commands', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help', 'init', 'info'], false);

        expect(exitCode).toBe(0);
        expect(stdout).not.toContain(helpHeader);
        expect(stdout).toContain('webpack c | init [scaffold]');
        expect(stderr).toHaveLength(0);
    });
});
