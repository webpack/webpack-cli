'use strict';

const { run, isWebpack5 } = require('../utils/test-utils');

const helpDefaultHeader = 'The build tool for modern web applications.';

describe('help', () => {
    it('should show help information using the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        if (isWebpack5) {
            expect(stdout).toMatchSnapshot();
        } else {
            expect(stdout).toContain('webpack [entries...] [options]');
            expect(stdout).toContain('webpack [command] [options]');
            expect(stdout).toContain(helpDefaultHeader);
            expect(stdout).toContain('Options:');
            expect(stdout).toContain('--merge');
            expect(stdout).toContain('Global options:');
            expect(stdout).toContain('Commands:');
            expect(stdout.match(/build\|bundle\|b/g)).toHaveLength(1);
            expect(stdout.match(/watch\|w/g)).toHaveLength(1);
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
            expect(stdout).toContain('Made with ♥ by the webpack team.');
        }
    });

    it('should show help information using the "--help" option with the "verbose" value', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'verbose']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack [entries...] [options]');
        expect(stdout).toContain('webpack [command] [options]');
        expect(stdout).toContain(helpDefaultHeader);
        expect(stdout).toContain('Options:');
        expect(stdout).toContain('--merge'); // minimum

        if (isWebpack5) {
            expect(stdout).toContain('--cache-type'); // verbose
        }

        expect(stdout).toContain('Global options:');
        expect(stdout).toContain('Commands:');
        expect(stdout.match(/build\|bundle\|b/g)).toHaveLength(1);
        expect(stdout.match(/watch\|w/g)).toHaveLength(1);
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
        expect(stdout).toContain('Made with ♥ by the webpack team.');
    });

    it('should show help information using the "--help" option with the "verbose" value #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help=verbose']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack [entries...] [options]');
        expect(stdout).toContain('webpack [command] [options]');
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
        expect(stdout).toContain('Made with ♥ by the webpack team.');
    });

    it('should show help information using command syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        if (isWebpack5) {
            expect(stdout).toMatchSnapshot();
        } else {
            expect(stdout).toContain('webpack [entries...] [options]');
            expect(stdout).toContain('webpack [command] [options]');
            expect(stdout).toContain(helpDefaultHeader);
            expect(stdout).toContain('Options:');
            expect(stdout).toContain('--merge');
            expect(stdout).toContain('Global options:');
            expect(stdout).toContain('Commands:');
            expect(stdout.match(/build\|bundle\|b/g)).toHaveLength(1);
            expect(stdout.match(/watch\|w/g)).toHaveLength(1);
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
            expect(stdout).toContain('Made with ♥ by the webpack team.');
        }
    });

    it('should show the same information using the "--help" option and command syntax', () => {
        const { exitCode: exitCodeFromOption, stderr: stderrFromOption, stdout: stdoutFromOption } = run(__dirname, ['--help']);
        const { exitCode: exitCodeFromCommandSyntax, stderr: stderrFromCommandSyntax, stdout: stdoutFromCommandSyntax } = run(__dirname, [
            'help',
        ]);

        expect(exitCodeFromOption).toBe(0);
        expect(exitCodeFromCommandSyntax).toBe(0);
        expect(stderrFromOption).toBeFalsy();
        expect(stderrFromCommandSyntax).toBeFalsy();
        expect(stdoutFromOption).toBe(stdoutFromCommandSyntax);
    });

    it('should show help information and respect the "--color" flag using the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        if (isWebpack5) {
            expect(stdout).toMatchSnapshot();
        } else {
            expect(stdout).toContain('webpack [entries...] [options]');
            expect(stdout).toContain('webpack [command] [options]');
            expect(stdout).toContain(helpDefaultHeader);
            // colorful stdout
            expect(stdout).toContain('[1mWebpack documentation:[22m https://webpack.js.org/.');
            expect(stdout).toContain('[1mCLI documentation:[22m https://webpack.js.org/api/cli/.');
            expect(stdout).toContain(`[1mMade with ♥ by the webpack team[22m`);
        }
    });

    it('should show help information and respect the "--no-color" flag using the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--no-color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        if (isWebpack5) {
            expect(stdout).toMatchSnapshot();
        } else {
            expect(stdout).toContain('webpack [entries...] [options]');
            expect(stdout).toContain('webpack [command] [options]');
            expect(stdout).toContain(helpDefaultHeader);
            expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
            expect(stdout).not.toContain(`[1mMade with ♥ by the webpack team[22m`);
            expect(stdout).toContain('Made with ♥ by the webpack team.');
        }
    });

    const commands = [
        'build',
        'bundle',
        'b',
        'watch',
        'w',
        'serve',
        's',
        'info',
        'i',
        'init',
        'c',
        'loader',
        'l',
        'plugin',
        'p',
        'configtest',
        't',
        'migrate',
        'm',
    ];

    commands.forEach((command) => {
        it(`should show help information for '${command}' command using the "--help" option`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, [command, '--help']);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`webpack ${command === 'build' || command === 'bundle' || command === 'b' ? '' : command}`);
        });

        it(`should show help information for '${command}' command using command syntax`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['help', command]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`webpack ${command === 'build' || command === 'bundle' || command === 'b' ? '' : command}`);
        });

        it('should show help information and respect the "--color" flag using the "--help" option', () => {
            const { exitCode, stderr, stdout } = run(__dirname, [command, '--help', '--color']);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`webpack ${command === 'build' || command === 'bundle' || command === 'b' ? '' : command}`);
            expect(stdout).toContain('Made with ♥ by the webpack team');
        });

        it('should show help information and respect the "--no-color" flag using the "--help" option', () => {
            const { exitCode, stderr, stdout } = run(__dirname, [command, '--help', '--no-color']);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`webpack ${command === 'build' || command === 'bundle' || command === 'b' ? '' : command}`);
            expect(stdout).not.toContain(`[1mMade with ♥ by the webpack team[22m`);
            expect(stdout).toContain('Made with ♥ by the webpack team');
        });
    });

    it('should show help information with options for "info" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information with options for "serve" command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['serve', '--help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information and taking precedence when "--help" and "--version" option using together', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--version']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack [entries...] [options]');
        expect(stdout).toContain('webpack [command] [options]');
        expect(stdout).toContain(helpDefaultHeader);
        expect(stdout).toContain('Options:');
        expect(stdout).toContain('--merge'); // minimum
        expect(stdout).not.toContain('--cache-type'); // verbose
        expect(stdout).toContain('Global options:');
        expect(stdout).toContain('Commands:');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
        expect(stdout).toContain('Made with ♥ by the webpack team.');
    });

    it('should show help information using the "help --mode" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--mode']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --target" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--target']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        if (isWebpack5) {
            expect(stdout).toContain('Usage: webpack --target <value...>');
            expect(stdout).toContain('Short: webpack -t <value...>');
        } else {
            expect(stdout).toContain('Usage: webpack --target <value>');
            expect(stdout).toContain('Short: webpack -t <value>');
        }

        expect(stdout).toContain('Description: Sets the build target e.g. node.');
        expect(stdout).toContain("To see list of all supported commands and options run 'webpack --help=verbose'.");
        expect(stdout).toContain('CLI documentation: https://webpack.js.org/api/cli/.');
    });

    it('should show help information using the "help --stats" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--stats']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --no-stats" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--no-stats']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --mode" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--mode']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help serve --mode" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve', '--mode']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --color" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --no-color" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--no-color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help serve --color" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve', '--color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help serve --no-color" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve', '--no-color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --version" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--version']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help -v" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '-v']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should log error for invalid command using the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'myCommand']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown value for '--help' option, please use '--help=verbose'");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using the "--help" option #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--flag', '--help']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Incorrect use of help');
        expect(stderr).toContain("Please use: 'webpack help [command] [option]' | 'webpack [command] --help'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using the "--help" option #3', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['serve', '--flag', '--help']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Incorrect use of help');
        expect(stderr).toContain("Please use: 'webpack help [command] [option]' | 'webpack [command] --help'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown command using command syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'myCommand']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Can't find and load command 'myCommand'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown command using command syntax #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'verbose']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Can't find and load command 'verbose'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown option using command syntax #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--made']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown option '--made'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown option using command syntax #3', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve', '--made']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown option '--made'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown option using command syntax #4', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'bui', '--mode']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Can't find and load command 'bui'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using command syntax #3', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--mode', 'serve']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Incorrect use of help');
        expect(stderr).toContain("Please use: 'webpack help [command] [option]' | 'webpack [command] --help'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using command syntax #4', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve', '--mode', '--mode']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Incorrect use of help');
        expect(stderr).toContain("Please use: 'webpack help [command] [option]' | 'webpack [command] --help'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid flag with the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--my-flag']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Incorrect use of help');
        expect(stderr).toContain("Please use: 'webpack help [command] [option]' | 'webpack [command] --help'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid flag with the "--help" option #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'init', 'info']);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown value for '--help' option, please use '--help=verbose'");
        expect(stdout).toBeFalsy();
    });
});
