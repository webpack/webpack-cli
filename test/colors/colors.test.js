'use strict';
const { run } = require('../utils/test-utils');
const { resolve } = require('path');
const { options: coloretteOptions } = require('colorette');

describe('colorts', () => {
    it('should output by default', () => {
        const { stderr, stdout, exitCode } = run(__dirname);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(coloretteOptions.enabled ? '\u001b[1m\u001b[32msuccessfully\u001b[39m\u001b[22m' : 'successfully');
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from flags', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--stats=verbose']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(coloretteOptions.enabled ? '\u001b[1m\u001b[32msuccessfully\u001b[39m\u001b[22m' : 'successfully');
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from the configuration', () => {
        const { stderr, stdout, exitCode } = run(__dirname, [`--config=${resolve(__dirname, './stats-string.webpack.config.js')}`]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(coloretteOptions.enabled ? '\u001b[1m\u001b[32msuccessfully\u001b[39m\u001b[22m' : 'successfully');
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from the configuration #1', () => {
        const { stderr, stdout, exitCode } = run(__dirname, [`--config=${resolve(__dirname, './stats-boolean.webpack.config.js')}`]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(coloretteOptions.enabled ? '\u001b[1m\u001b[32msuccessfully\u001b[39m\u001b[22m' : 'successfully');
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from the configuration #2', () => {
        const { stderr, stdout, exitCode } = run(__dirname, [`--config=${resolve(__dirname, './no-stats.webpack.config.js')}`]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(coloretteOptions.enabled ? '\u001b[1m\u001b[32msuccessfully\u001b[39m\u001b[22m' : 'successfully');
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from the configuration #3', () => {
        const { stderr, stdout, exitCode } = run(__dirname, [`--config=${resolve(__dirname, './colors-true.webpack.config.js')}`]);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(coloretteOptions.enabled ? '\u001b[1m\u001b[32msuccessfully\u001b[39m\u001b[22m' : 'successfully');
        expect(exitCode).toBe(0);
    });

    it('should work with the "stats" option from the configuration #4', () => {
        const { stderr, stdout, exitCode } = run(__dirname, [`--config=${resolve(__dirname, './colors-false.webpack.config.js')}`]);

        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain('\u001b[1m\u001b[32msuccessfully\u001b[39m\u001b[22m');
        expect(stdout).toContain('successfully');
        expect(exitCode).toBe(0);
    });
});
