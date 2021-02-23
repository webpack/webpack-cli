'use strict';
const { bold, enabled: coloretteEnabled } = require('colorette');
const { run } = require('../utils/test-utils');

describe('help', () => {
    it('should show help information using the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it.skip('should show help information using the "--help" option with the "verbose" value', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'verbose']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it.skip('should show help information using the "--help" option with the "verbose" value #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help=verbose']);
        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using command syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        expect(stdout).toMatchSnapshot();
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
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--color'], { env: { FORCE_COLOR: true } });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('\x1b[1m');

        expect(stdout).toMatchSnapshot();
    });

    it('should show help information and respect the "--no-color" flag using the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--no-color'], { env: { FORCE_COLOR: true } });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        expect(stdout).toMatchSnapshot();
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
            expect(stdout).toMatchSnapshot();
        });

        it(`should show help information for '${command}' command using the "--help verbose" option`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, [command, '--help', 'verbose']);

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
            const { exitCode, stderr, stdout } = run(__dirname, [command, '--help', '--color'], { env: { FORCE_COLOR: true } });

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain('\x1b[1m');
            expect(stdout).toContain(`webpack ${command === 'build' || command === 'bundle' || command === 'b' ? '' : command}`);
            expect(stdout).toContain('Made with ♥ by the webpack team');
        });

        it('should show help information and respect the "--no-color" flag using the "--help" option', () => {
            const { exitCode, stderr, stdout } = run(__dirname, [command, '--help', '--no-color'], { env: { FORCE_COLOR: true } });

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).not.toContain('\x1b[1m');
            expect(stdout).toContain(`webpack ${command === 'build' || command === 'bundle' || command === 'b' ? '' : command}`);
            expect(stdout).toContain('Made with ♥ by the webpack team');
        });
    });

    it('should show help information with options for sub commands', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['info', '--help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        expect(stdout).toMatchSnapshot();
    });

    it('should show help information and taking precedence when "--help" and "--version" option using together', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--version']);

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

    it('should show help information using the "help --target" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--target']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
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
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--color'], { env: { FORCE_COLOR: true } });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('\x1b[1m');

        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --no-color" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--no-color'], { env: { FORCE_COLOR: true } });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help serve --color" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve', '--color'], { env: { FORCE_COLOR: true } });

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
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using the "--help" option #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--flag', '--help']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using the "--help" option #3', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['serve', '--flag', '--help']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown command using command syntax', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'myCommand']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown command using command syntax #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'verbose']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown option using command syntax #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--made']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown option using command syntax #3', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve', '--made']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown option using command syntax #4', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'bui', '--mode']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using command syntax #3', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', '--mode', 'serve']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using command syntax #4', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['help', 'serve', '--mode', '--mode']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid flag with the "--help" option', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', '--my-flag']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid flag with the "--help" option #2', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--help', 'init', 'info']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });
});
