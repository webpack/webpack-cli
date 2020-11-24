'use strict';
const { run, isWebpack5 } = require('../utils/test-utils');
const { resolve } = require('path');
const { options: coloretteOptions } = require('colorette');

describe('colors related tests', () => {
    it('should output by default', () => {
        const { stderr, stdout, exitCode } = run(__dirname, [], true, [], { FORCE_COLOR: true });

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from flags', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--stats=verbose'], true, [], { FORCE_COLOR: true });

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from flags and from configuration', () => {
        const { stderr, stdout, exitCode } = run(
            __dirname,
            ['--stats=verbose', `--config=${resolve(__dirname, './no-stats.webpack.config.js')}`],
            true,
            [],
            { FORCE_COLOR: true },
        );

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from flags and from configuration #2', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--stats=verbose', '--config=stats-string.webpack.config.js'], true, [], {
            FORCE_COLOR: true,
        });

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should disable colored output with --no-color', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--stats=verbose', '--no-color']);

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).not.toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
        expect(stdout).toContain(output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option and --color flags', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--stats=verbose', '--color']);

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from the configuration', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config=stats-string.webpack.config.js'], true, [], { FORCE_COLOR: true });

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from the configuration #1', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config=stats-boolean.webpack.config.js'], true, [], { FORCE_COLOR: true });

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from the configuration #2', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config=no-stats.webpack.config.js'], true, [], { FORCE_COLOR: true });

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from the configuration #3', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config=colors-true.webpack.config.js']);

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from the configuration #4', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config=colors-false.webpack.config.js']);

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';

        expect(stdout).not.toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
        expect(stdout).toContain(output);
        expect(exitCode).toBe(0);
    });

    it('should prioritize --color over colors in config', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config=colors-false.webpack.config.js', '--color']);

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';

        expect(stdout).toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
        expect(exitCode).toBe(0);
    });

    it('should prioratize --no-color over colors in config', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config=colors-true.webpack.config.js', '--no-color']);

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';

        expect(stdout).not.toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
        expect(stdout).toContain(output);
        expect(exitCode).toBe(0);
    });

    it('should work in multicompiler mode', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config=multiple-configs.js', '--color']);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);

        if (isWebpack5) {
            expect(stdout).toContain(`\u001b[1mfirst-config`);
            expect(stdout).toContain(`\u001b[1msecond-config`);
            expect(stdout).toContain(`\u001b[1m\u001b[32msuccessfully\u001b[39m\u001b[22m`);
        }
    });
});
