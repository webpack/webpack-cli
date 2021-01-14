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

    it('should show help information and taking precedence when "--help" and "--version" option using together', () => {
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

    it('should show help information using the "help --mode" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--mode'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Usage: webpack --mode <value>');
        expect(stdout).toContain('Description: Defines the mode to pass to webpack.');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
    });

    it('should show help information using the "help --target" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--target'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Usage: webpack --target <value...>');
        expect(stdout).toContain('Short: webpack -t <value...>');
        expect(stdout).toContain('Description: Sets the build target e.g. node.');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
    });

    it('should show help information using the "help --stats" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--stats'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Usage: webpack --stats [value]');
        expect(stdout).toContain('Description: It instructs webpack on how to treat the stats e.g. verbose.');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
    });

    it('should show help information using the "help --no-stats" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--no-stats'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Usage: webpack --no-stats');
        expect(stdout).toContain('Description: Disable stats output.');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
    });

    it('should show help information using the "help --mode" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--mode'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Usage: webpack --mode <value>');
        expect(stdout).toContain('Description: Defines the mode to pass to webpack.');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
    });

    it('should show help information using the "help serve --mode" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve', '--mode'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Usage: webpack serve --mode <value>');
        expect(stdout).toContain('Description: Defines the mode to pass to webpack.');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
    });

    it('should show help information using the "help --color" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--color'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Usage: webpack --color');
        expect(stdout).toContain('Description: Enable colors on console.');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
    });

    it('should show help information using the "help --no-color" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--no-color'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Usage: webpack --no-color');
        expect(stdout).toContain('Description: Disable colors on console.');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
    });

    it('should show help information using the "help serve --color" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve', '--color'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Usage: webpack serve --color');
        expect(stdout).toContain('Description: Enable colors on console.');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
    });

    it('should show help information using the "help serve --no-color" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve', '--no-color'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Usage: webpack serve --no-color');
        expect(stdout).toContain('Description: Disable colors on console.');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
    });

    it('should show help information using the "help --version" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Usage: webpack --version');
        expect(stdout).toContain('Short: webpack -v');
        expect(stdout).toContain(
            "Description: Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and commands.",
        );
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
    });

    it('should show help information using the "help -v" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '-v'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('Usage: webpack --version');
        expect(stdout).toContain('Short: webpack -v');
        expect(stdout).toContain(
            "Description: Output the version number of 'webpack', 'webpack-cli' and 'webpack-dev-server' and commands.",
        );
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
    });

    it('should log error for invalid command using the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'myCommand'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown value for '--help' option, please use '--help=verbose'");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using the "--help" option #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--flag', '--help'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Incorrect use of help');
        expect(stderr).toContain("Please use: 'webpack help [command] [option]' | 'webpack [command] --help'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using the "--help" option #3', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['serve', '--flag', '--help'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Incorrect use of help');
        expect(stderr).toContain("Please use: 'webpack help [command] [option]' | 'webpack [command] --help'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown command using command syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'myCommand'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Can't find and load command 'myCommand'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown command using command syntax #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'verbose'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Can't find and load command 'verbose'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown option using command syntax #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--made'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown option '--made'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown option using command syntax #3', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve', '--made'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown option '--made'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using command syntax #3', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--mode', 'serve'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Incorrect use of help');
        expect(stderr).toContain("Please use: 'webpack help [command] [option]' | 'webpack [command] --help'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using command syntax #4', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve', '--mode', '--mode'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Incorrect use of help');
        expect(stderr).toContain("Please use: 'webpack help [command] [option]' | 'webpack [command] --help'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid flag with the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--my-flag'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Incorrect use of help');
        expect(stderr).toContain("Please use: 'webpack help [command] [option]' | 'webpack [command] --help'");
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
