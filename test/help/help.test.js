'use strict';
const { run } = require('../utils/test-utils');
// eslint-disable-next-line node/no-unpublished-require
const serializer = require('jest-serializer-ansi');

describe('help', () => {
    expect.addSnapshotSerializer(serializer);

    it('should show help information using the "--help" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it.skip('should show help information using the "--help" option with the "verbose" value', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--help', 'verbose']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it.skip('should show help information using the "--help" option with the "verbose" value #2', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--help=verbose']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using command syntax', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show the same information using the "--help" option and command syntax', async () => {
        const { exitCode: exitCodeFromOption, stderr: stderrFromOption, stdout: stdoutFromOption } = await run(__dirname, ['--help']);
        const {
            exitCode: exitCodeFromCommandSyntax,
            stderr: stderrFromCommandSyntax,
            stdout: stdoutFromCommandSyntax,
        } = await run(__dirname, ['help']);

        expect(exitCodeFromOption).toBe(0);
        expect(exitCodeFromCommandSyntax).toBe(0);
        expect(stderrFromOption).toBeFalsy();
        expect(stderrFromCommandSyntax).toBeFalsy();
        expect(stdoutFromOption).toBe(stdoutFromCommandSyntax);
    });

    it('should show help information and respect the "--color" flag using the "--help" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--help', '--color'], { env: { FORCE_COLOR: true } });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('\x1b[1m');
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information and respect the "--no-color" flag using the "--help" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--help', '--no-color'], { env: { FORCE_COLOR: true } });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    const commands = [
        {
            name: 'init',
            alias: ['create', 'new', 'c', 'n'],
            usage: 'webpack init|create|new|c|n [generation-path] [options]',
        },
        {
            name: 'info',
            alias: 'i',
            usage: 'webpack info|i [options]',
        },
        {
            name: 'loader',
            alias: 'l',
            usage: 'webpack loader|l [output-path] [options]',
        },
        {
            name: 'migrate',
            alias: 'm',
            usage: 'webpack migrate|m <config-path> [new-config-path]',
        },
        {
            name: 'plugin',
            alias: 'p',
            usage: 'webpack plugin|p [output-path] [options]',
        },
        {
            name: 'configtest',
            alias: 't',
            usage: 'webpack configtest|t [config-path]',
        },
        {
            name: 'watch',
            alias: 'w',
            usage: 'webpack watch|w [entries...] [options]',
        },
        {
            name: 'serve',
            alias: ['server', 's'],
            usage: 'webpack serve|server|s [entries...] [options]',
        },
        {
            name: 'build',
            alias: 'b',
            usage: 'webpack build|bundle|b [entries...] [options]',
        },
    ];

    commands.forEach(({ name, alias, usage }) => {
        it(`should show help information for '${name}' command using the "--help" option`, async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, [name, '--help']);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`webpack ${name === 'build' || name === 'bundle' || name === 'b' ? '' : name}`);
            expect(stdout).toMatchSnapshot();
        });

        it(`should show help information for '${name}' command using the "--help verbose" option`, async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, [name, '--help', 'verbose']);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(usage);
        });

        it(`should show help information for '${name}' command using command syntax`, async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, ['help', name]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(usage);
        });

        it(`should show help information for '${name}' and respect the "--color" flag using the "--help" option`, async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, [name, '--help', '--color'], { env: { FORCE_COLOR: true } });

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain('\x1b[1m');
            expect(stdout).toContain(usage);
            expect(stdout).toContain('Made with ♥ by the webpack team');
        });

        it(`should show help information for '${name}' and respect the "--no-color" flag using the "--help" option`, async () => {
            const { exitCode, stderr, stdout } = await run(__dirname, [name, '--help', '--no-color'], { env: { FORCE_COLOR: true } });

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).not.toContain('\x1b[1m');
            expect(stdout).toContain(usage);
            expect(stdout).toContain('Made with ♥ by the webpack team');
        });

        const alises = Array.isArray(alias) ? alias : [alias];

        alises.forEach((alias) => {
            it(`should show help information for '${alias}' command using the "--help" option`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [alias, '--help']);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(usage);
            });

            it(`should show help information for '${alias}' command using the "--help verbose" option`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, [alias, '--help', 'verbose']);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(usage);
            });

            it(`should show help information for '${alias}' command using command syntax`, async () => {
                const { exitCode, stderr, stdout } = await run(__dirname, ['help', alias]);

                expect(exitCode).toBe(0);
                expect(stderr).toBeFalsy();
                expect(stdout).toContain(usage);
            });
        });
    });

    it('should show help information with options for sub commands', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['info', '--help']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information and taking precedence when "--help" and "--version" option using together', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--help', '--version']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --mode" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', '--mode']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --target" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', '--target']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --stats" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', '--stats']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --no-stats" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', '--no-stats']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --mode" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', '--mode']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help serve --mode" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', 'serve', '--mode']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --color" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', '--color'], { env: { FORCE_COLOR: true } });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('\x1b[1m');
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --no-color" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', '--no-color'], { env: { FORCE_COLOR: true } });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help serve --color" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', 'serve', '--color'], { env: { FORCE_COLOR: true } });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('\x1b[1m');
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help serve --no-color" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', 'serve', '--no-color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help --version" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', '--version']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should show help information using the "help -v" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', '-v']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toMatchSnapshot();
    });

    it('should log error for invalid command using the "--help" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--help', 'myCommand']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using the "--help" option #2', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--flag', '--help']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using the "--help" option #3', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['serve', '--flag', '--help']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown command using command syntax', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', 'myCommand']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown command using command syntax #2', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', 'verbose']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown option using command syntax #2', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', '--made']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown option using command syntax #3', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', 'serve', '--made']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for unknown option using command syntax #4', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', 'bui', '--mode']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using command syntax #3', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', '--mode', 'serve']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid command using command syntax #4', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['help', 'serve', '--mode', '--mode']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid flag with the "--help" option', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--help', '--my-flag']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid flag with the "--help" option #2', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--help', 'init', 'info']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });

    it('should log error for invalid flag with the "--help" option #2', async () => {
        const { exitCode, stderr, stdout } = await run(__dirname, ['--help=']);

        expect(exitCode).toBe(2);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toBeFalsy();
    });
});
