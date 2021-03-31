'use strict';

const { runAsync, isWebpack5 } = require('../../utils/test-utils');
const { resolve } = require('path');

describe('colors', () => {
    it('should output by default', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, [], { env: { FORCE_COLOR: true } });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
    });

    it('should work with the "stats" option from flags', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--stats=verbose'], { env: { FORCE_COLOR: true } });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
    });

    it('should work with the "stats" option from flags and from configuration', async () => {
        const { exitCode, stderr, stdout } = await runAsync(
            __dirname,
            ['--stats=verbose', `--config=${resolve(__dirname, './no-stats.webpack.config.js')}`],
            { env: { FORCE_COLOR: true } },
        );

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
    });

    it('should work with the "stats" option from flags and from configuration #2', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--stats=verbose', '--config=stats-string.webpack.config.js'], {
            env: { FORCE_COLOR: true },
        });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
    });

    it('should work with the "stats" option and --color flags', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--stats=verbose', '--color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
    });

    it('should disable colored output with --no-color', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--stats=verbose', '--no-color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).not.toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
        expect(stdout).toContain(output);
    });

    it('should work with the "stats" option from the configuration', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--config=stats-string.webpack.config.js'], {
            env: { FORCE_COLOR: true },
        });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
    });

    it('should work with the "stats" option from the configuration #1', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--config=stats-boolean.webpack.config.js'], {
            env: { FORCE_COLOR: true },
        });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
    });

    it('should work with the "stats" option from the configuration #2', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--config=no-stats.webpack.config.js'], {
            env: { FORCE_COLOR: true },
        });

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
    });

    it('should work with the "stats" option from the configuration #3', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--config=colors-true.webpack.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
    });

    it('should work with the "stats" option from the configuration #4', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--config=colors-false.webpack.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).not.toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
        expect(stdout).toContain(output);
    });

    it('should prioritize --color over colors in config', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--config=colors-false.webpack.config.js', '--color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
    });

    it('should prioritize --no-color over colors in config', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--config=colors-true.webpack.config.js', '--no-color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).not.toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
        expect(stdout).toContain(output);
    });

    it('should work in multi compiler mode', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--config=multiple-configs.js', '--color']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        if (isWebpack5) {
            expect(stdout).toContain(`\u001b[1mfirst-config`);
            expect(stdout).toContain(`\u001b[1msecond-config`);
            expect(stdout).toContain(`\u001b[1m\u001b[32msuccessfully\u001b[39m\u001b[22m`);
        }
    });
});
