'use strict';

const { run } = require('../utils/test-utils');

describe('commands help', () => {
    it('log help information with subcommands as an arg', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain('webpack s | serve');
        expect(stderr).toHaveLength(0);
    });

    it('log error for invalid command with --help flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'myCommand'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Invalid command 'myCommand'.");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and arguments");
        expect(stdout).toHaveLength(0);
    });

    it('log error for invalid command with help command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'myCommand'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Invalid command 'myCommand'.");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and arguments");
        expect(stdout).toHaveLength(0);
    });

    it('log error for multiple commands', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'init', 'info'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("You provided multiple commands or arguments - command 'init' (alias 'c'), command 'info' (alias 'i').");
        expect(stdout).toHaveLength(0);
    });
});
