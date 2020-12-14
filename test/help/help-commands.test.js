'use strict';

const { green } = require('colorette');
const { run } = require('../utils/test-utils');

describe('commands help', () => {
    it('shows usage information on supplying help flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack info|i [options]');
    });

    it('should work and respect the --no-color flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--help', '--no-color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain(green('webpack info|i [options]'));
    });

    it('should work and respect the --color flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--help', '--color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(green('webpack info|i [options]'));
    });

    it('should output all cli flags', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`--output`);
    });

    it('shows usage information on supplying help flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack info|i [options]');
    });

    it('should work and respect the --no-color flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--no-color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain(green('webpack info|i [options]'));
    });

    it('should work and respect the --color flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(green('webpack info|i [options]'));
    });

    it('should output all cli flags', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`--output`);
    });

    it('log help information with subcommands as an arg', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack serve|s [options]');
    });

    it('log error for invalid command with --help flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'myCommand'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Invalid command 'myCommand'.");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toHaveLength(0);
    });

    it('log error for invalid command with help command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'myCommand'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Invalid command 'myCommand'.");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toHaveLength(0);
    });

    it('log error for multiple commands', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'init', 'info'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("You provided multiple commands or arguments - command 'init' (alias 'c'), command 'info' (alias 'i').");
        expect(stdout).toHaveLength(0);
    });
});
