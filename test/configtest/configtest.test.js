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
        expect(stderr).toContain('ValidationError: Invalid configuration object.');
        expect(stderr).toContain('configuration.mode should be one of these:');
        expect(stdout).toBeFalsy();
    });

    it(`should validate the config with alias 't'`, () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['t', './error.config.js'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('ValidationError: Invalid configuration object.');
        expect(stderr).toContain('configuration.mode should be one of these:');
        expect(stdout).toBeFalsy();
    });

    it('should throw error when multiple configurations are provided simultaneously', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['configtest', './error.config.js', './webpack.config.js'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Only one configuration can be validated at a time');
        expect(stdout).toBeFalsy();
    });
});
