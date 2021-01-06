'use strict';

const { run } = require('../utils/test-utils');

describe('basic info usage', () => {
    it('should validate webpack config successfully', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['configtest', './webpack.config.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('There are no validation errors in the given webpack configuration.');
    });

    it('should throw validation error', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['configtest', './error.config.js'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Invalid configuration object.');
        expect(stderr).toContain('configuration.mode should be one of these:');
        expect(stdout).toBeFalsy();
    });

    it('should throw syntax error', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['configtest', './syntax-error.config.js'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`SyntaxError: Unexpected token ';'`);
        expect(stdout).toBeFalsy();
    });

    it(`should validate the config with alias 't'`, () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['t', './error.config.js'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Invalid configuration object.');
        expect(stderr).toContain('configuration.mode should be one of these:');
        expect(stdout).toBeFalsy();
    });

    it('should throw error if configuration does not exist', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['configtest', './a.js'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`The specified config file doesn't exist`);
        expect(stdout).toBeFalsy();
    });

    it('should throw error if no configuration was provided', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['configtest'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain(`error: missing required argument 'config-path'`);
        expect(stdout).toBeFalsy();
    });
});
