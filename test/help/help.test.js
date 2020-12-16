'use strict';

const { bold } = require('colorette');
const { run } = require('../utils/test-utils');

const helpDefaultHeader = 'The build tool for modern web applications';

describe('commands help', () => {
    it('shows usage information on supplying help flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack info|i [options]');
        expect(stdout).toContain(helpDefaultHeader);
    });

    it('shows usage information on supplying help flag for command syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack info|i [options]');
        expect(stdout).toContain(helpDefaultHeader);
    });

    it('should work and respect the --no-color flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--no-color'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain(bold('Made with ♥ by the webpack team'));
        expect(stdout).toContain('Made with ♥ by the webpack team');
    });

    it('should work and respect the --color flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--color'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(bold('Made with ♥ by the webpack team'));
    });

    it('should output all cli flags', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`--output-path`);
    });

    const commands = ['bundle', 'loader', 'plugin', 'info', 'init', 'migrate', 'serve'];

    commands.forEach((cmd) => {
        it(`shows help for '${cmd}' command`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, [`${cmd}`, '--help'], false);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`Usage: webpack ${cmd}`);
        });

        it(`shows help for '${cmd}' command using command syntax`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['help', `${cmd}`], false);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`Usage: webpack ${cmd}`);
        });
    });

    it('shows usage information on supplying help flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack info|i [options]');
    });

    it('should work and respect the --no-color flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--help', '--no-color'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack info|i [options]');
        expect(stdout).not.toContain(bold('Made with ♥ by the webpack team'));
        expect(stdout).toContain('Made with ♥ by the webpack team');
    });

    it('should work and respect the --color flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--help', '--color'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack info|i [options]');
        expect(stdout).toContain(bold('Made with ♥ by the webpack team'));
    });

    it('should output all cli flags', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack info|i [options]');
        expect(stdout).toContain('--output <value>');
    });

    it('should output help for --version by taking precedence', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--version'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain(helpDefaultHeader);
        expect(stdout).toContain('webpack -v, --version');
    });

    it('outputs basic help info with dashed syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(helpDefaultHeader);
        expect(stdout).toContain('--merge'); // minimum
        expect(stdout).not.toContain('--node'); // verbose
    });

    it('outputs advanced help info with dashed syntax', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help', 'verbose'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(helpDefaultHeader);
        expect(stdout).toContain('--node'); // verbose
        expect(stdout).toContain('--config'); // minimum
    });

    it('outputs advanced help info with command syntax', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['help', 'verbose'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(helpDefaultHeader);
        expect(stdout).toContain('--node'); // verbose
        expect(stdout).toContain('--config'); // minimum
    });

    it('outputs advanced help info with --help=verbose', () => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--help=verbose'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(helpDefaultHeader);
        expect(stdout).toContain('--node'); // verbose
        expect(stdout).toContain('--config'); // minimum
        expect(stderr).toBeFalsy();
    });

    it('log help information with subcommands as an arg', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('webpack serve|s [options]');
    });

    it('log error for invalid command with --help flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'myCommand'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown value for '--help' option, please use '--help=verbose'");
        expect(stdout).toBeFalsy();
    });

    it('log error for invalid command with help command', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'myCommand'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown 'myCommand' command");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('log error for invalid help usage', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'init', 'info'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown value for '--help' option, please use '--help=verbose'");
        expect(stdout).toBeFalsy();
    });

    it('log error for invalid flag with --help flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--my-flag'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown option '--my-flag'");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });

    it('log error for unknown flags', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--entry', '--merge'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown option '--entry'");
        expect(stdout).toBeFalsy();
    });
});
