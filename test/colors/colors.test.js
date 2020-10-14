'use strict';
const { run, isWebpack5 } = require('../utils/test-utils');
const { resolve } = require('path');
const { options: coloretteOptions } = require('colorette');

describe('colorts', () => {
    it('should output by default', () => {
        const { stderr, stdout, exitCode } = run(__dirname);

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from flags', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--stats=verbose']);

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from flags and from configuration', () => {
        const { stderr, stdout, exitCode } = run(__dirname, [
            '--stats=verbose',
            `--config=${resolve(__dirname, './no-stats.webpack.config.js')}`,
        ]);

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from flags and from configuration #2', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--stats=verbose', '--config=stats-string.webpack.config.js']);

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from the configuration', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config=stats-string.webpack.config.js']);

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from the configuration #1', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config=stats-boolean.webpack.config.js']);

        expect(stderr).toBeFalsy();
        const output = isWebpack5 ? 'successfully' : 'main.js';
        expect(stdout).toContain(coloretteOptions.enabled ? `\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m` : output);
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from the configuration #2', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config=no-stats.webpack.config.js']);

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
        console.log(stdout);
        expect(stdout).not.toContain(`\u001b[1m\u001b[32m${output}\u001b[39m\u001b[22m`);
        expect(stdout).toContain(output);
        expect(exitCode).toBe(0);
    });
});
