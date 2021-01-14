'use strict';

const stripAnsi = require('strip-ansi');
const { bold, enabled: coloretteEnabled } = require('colorette');
const { run, isWebpack5 } = require('../utils/test-utils');

const helpDefaultHeader = 'The build tool for modern web applications.';

describe('help', () => {
    it('should show help information using the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack [options]');
        expect(stdout).toContain(helpDefaultHeader);
        expect(stdout).toContain('Options:');
        expect(stdout).toContain('--merge'); // minimum
        expect(stdout).not.toContain('--cache-type'); // verbose
        expect(stdout).toContain('Global options:');
        expect(stdout).toContain('Commands:');
        expect(stdout.match(/bundle\|b/g)).toHaveLength(1);
        expect(stdout.match(/version\|v/g)).toHaveLength(1);
        expect(stdout.match(/help\|h/g)).toHaveLength(1);
        expect(stdout.match(/serve\|s/g)).toHaveLength(1);
        expect(stdout.match(/info\|i/g)).toHaveLength(1);
        expect(stdout.match(/init\|c/g)).toHaveLength(1);
        expect(stdout.match(/loader\|l/g)).toHaveLength(1);
        expect(stdout.match(/plugin\|p/g)).toHaveLength(1);
        expect(stdout.match(/migrate\|m/g)).toHaveLength(1);
        expect(stdout.match(/configtest\|t/g)).toHaveLength(1);
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
        // TODO buggy on windows
        // expect(coloretteEnabled ? stripAnsi(stdout) : stdout).toContain('Made with ♥ by the webpack team.');
    });

    it.skip('should show help information using the "--help" option with the "verbose" value', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'verbose'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack [options]');
        expect(stdout).toContain(helpDefaultHeader);
        expect(stdout).toContain('Options:');
        expect(stdout).toContain('--merge'); // minimum

        if (isWebpack5) {
            expect(stdout).toContain('--cache-type'); // verbose
        }

        expect(stdout).toContain('Global options:');
        expect(stdout).toContain('Commands:');
        expect(stdout.match(/bundle\|b/g)).toHaveLength(1);
        expect(stdout.match(/version\|v/g)).toHaveLength(1);
        expect(stdout.match(/help\|h/g)).toHaveLength(1);
        expect(stdout.match(/serve\|s/g)).toHaveLength(1);
        expect(stdout.match(/info\|i/g)).toHaveLength(1);
        expect(stdout.match(/init\|c/g)).toHaveLength(1);
        expect(stdout.match(/loader\|l/g)).toHaveLength(1);
        expect(stdout.match(/plugin\|p/g)).toHaveLength(1);
        expect(stdout.match(/migrate\|m/g)).toHaveLength(1);
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
        expect(coloretteEnabled ? stripAnsi(stdout) : stdout).toContain('Made with ♥ by the webpack team.');
    });

    it.skip('should show help information using the "--help" option with the "verbose" value #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help=verbose'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack [options]');
        expect(stdout).toContain(helpDefaultHeader);
        expect(stdout).toContain('Options:');
        expect(stdout).toContain('--merge'); // minimum

        if (isWebpack5) {
            expect(stdout).toContain('--cache-type'); // verbose
        }

        expect(stdout).toContain('Global options:');
        expect(stdout).toContain('Commands:');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
        expect(coloretteEnabled ? stripAnsi(stdout) : stdout).toContain('Made with ♥ by the webpack team.');
    });

    it('should show help information using command syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack [options]');
        expect(stdout).toContain(helpDefaultHeader);
        expect(stdout).toContain('Options:');
        expect(stdout).toContain('--merge'); // minimum
        expect(stdout).not.toContain('--cache-type'); // verbose
        expect(stdout).toContain('Global options:');
        expect(stdout).toContain('Commands:');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
        // TODO buggy on windows
        // expect(coloretteEnabled ? stripAnsi(stdout) : stdout).toContain('Made with ♥ by the webpack team.');
    });

    it('should show the same information using the "--help" option and command syntax', () => {
        const { exitCode: exitCodeFromOption, stderr: stderrFromOption, stdout: stdoutFromOption } = run(__dirname, ['--help'], false);
        const { exitCode: exitCodeFromCommandSyntax, stderr: stderrFromCommandSyntax, stdout: stdoutFromCommandSyntax } = run(
            __dirname,
            ['help'],
            false,
        );

        expect(exitCodeFromOption).toBe(0);
        expect(exitCodeFromCommandSyntax).toBe(0);
        expect(stderrFromOption).toBeFalsy();
        expect(stderrFromCommandSyntax).toBeFalsy();
        expect(stdoutFromOption).toBe(stdoutFromCommandSyntax);
    });

    it('should show help information and respect the "--color" flag using the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--color'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack [options]');
        expect(stdout).toContain(helpDefaultHeader);
        expect(stdout).toContain('Options:');
        expect(stdout).toContain('--merge'); // minimum
        expect(stdout).not.toContain('--cache-type'); // verbose
        expect(stdout).toContain('Global options:');
        expect(stdout).toContain('Commands:');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
        expect(stdout).toContain(coloretteEnabled ? bold('Made with ♥ by the webpack team') : 'Made with ♥ by the webpack team');
    });

    it('should show help information and respect the "--no-color" flag using the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--no-color'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack [options]');
        expect(stdout).toContain(helpDefaultHeader);
        expect(stdout).toContain('Options:');
        expect(stdout).toContain('--merge'); // minimum
        expect(stdout).not.toContain('--cache-type'); // verbose
        expect(stdout).toContain('Global options:');
        expect(stdout).toContain('Commands:');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
        // TODO bug in tests
        // expect(stdout).not.toContain(bold('Made with ♥ by the webpack team'));
        expect(stdout).toContain('Made with ♥ by the webpack team');
    });

    const commands = ['build', 'bundle', 'loader', 'plugin', 'info', 'init', 'serve', 'migrate'];

    commands.forEach((command) => {
        it(`should show help information for '${command}' command using the "--help" option`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, [command, '--help'], false);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`webpack ${command === 'build' || command === 'bundle' ? '' : command}`);
        });

        it(`should show help information for '${command}' command using command syntax`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['help', command], false);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`webpack ${command === 'build' || command === 'bundle' ? '' : command}`);
        });

        it('should show help information and respect the "--color" flag using the "--help" option', () => {
            const { exitCode, stderr, stdout } = run(__dirname, [command, '--help', '--color'], false);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`webpack ${command === 'build' || command === 'bundle' ? '' : command}`);
            expect(stdout).toContain(coloretteEnabled ? bold('Made with ♥ by the webpack team') : 'Made with ♥ by the webpack team');
        });

        it('should show help information and respect the "--no-color" flag using the "--help" option', () => {
            const { exitCode, stderr, stdout } = run(__dirname, [command, '--help', '--no-color'], false);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`webpack ${command === 'build' || command === 'bundle' ? '' : command}`);
            // TODO bug in tests
            // expect(stdout).not.toContain(bold('Made with ♥ by the webpack team'));
            expect(stdout).toContain('Made with ♥ by the webpack team');
        });
    });

    it('should show help information with options for sub commands', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack info|i [options]');
        expect(stdout).toContain('Options:');
        expect(stdout).toContain('--output <value>');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
        expect(stdout).toContain('Made with ♥ by the webpack team');
    });

    it('should show help information and taking precedence when "--help" and "--verison" option using together', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack [options]');
        expect(stdout).toContain(helpDefaultHeader);
        expect(stdout).toContain('Options:');
        expect(stdout).toContain('--merge'); // minimum
        expect(stdout).not.toContain('--cache-type'); // verbose
        expect(stdout).toContain('Global options:');
        expect(stdout).toContain('Commands:');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
        // TODO buggy on windows
        // expect(coloretteEnabled ? stripAnsi(stdout) : stdout).toContain('Made with ♥ by the webpack team.');
    });

    it('should log error for invalid command using the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'myCommand'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown value for '--help' option, please use '--help=verbose'");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using command syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'myCommand'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Can't find and load command 'myCommand'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using command syntax #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'verbose'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Can't find and load command 'verbose'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid flag with the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--my-flag'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown option '--my-flag'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid flag with the "--help" option #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'init', 'info'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown value for '--help' option, please use '--help=verbose'");
        expect(stdout).toBeFalsy();
    });
});
