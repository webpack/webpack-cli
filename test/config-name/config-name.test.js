'use strict';

const { run } = require('../utils/test-utils');

describe('--config-name flag', () => {
    it('should select only the config whose name is passed with --config-name', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config-name', 'first'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('first');
        expect(stdout).not.toContain('second');
        expect(stdout).not.toContain('third');
    });

    it('should work with multiple values for --config-name', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config-name', 'first', '--config-name', 'third'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('first');
        expect(stdout).not.toContain('second');
        expect(stdout).toContain('third');
    });

    it('should work with multiple values for --config-name and multiple configurations', () => {
        const { stderr, stdout, exitCode } = run(
            __dirname,
            ['-c', './function-config.js', '-c', './single-other-config.js', '--config-name', 'first', '--config-name', 'four'],
            false,
        );

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('first');
        expect(stdout).not.toContain('second');
        expect(stdout).not.toContain('third');
        expect(stdout).toContain('four');
    });

    it('should log error if invalid config name is provided', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config-name', 'test'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Configuration with the "test" name was not found.');
        expect(stdout).toBeFalsy();
    });

    it('should log error if multiple configurations are not found', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config-name', 'test', '-c', 'single-config.js'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Configuration with the "test" name was not found.');
        expect(stdout).toBeFalsy();
    });

    it('should log error if multiple configurations are not found #1', () => {
        const { exitCode, stderr, stdout } = run(
            __dirname,
            ['--config-name', 'test', '--config-name', 'bar', '-c', 'single-config.js'],
            false,
        );

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Configuration with the "test" name was not found.');
        expect(stderr).toContain('Configuration with the "bar" name was not found.');
        expect(stdout).toBeFalsy();
    });

    it('should log error if multiple configurations are not found #2', () => {
        const { exitCode, stderr, stdout } = run(
            __dirname,
            ['--config-name', 'first', '--config-name', 'bar', '-c', 'single-config.js'],
            false,
        );

        expect(exitCode).toBe(2);
        expect(stderr).not.toContain('Configuration with the "first" name was not found.');
        expect(stderr).toContain('Configuration with the "bar" name was not found.');
        expect(stdout).toBeFalsy();
    });

    it('should work with config as a function', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', 'function-config.js', '--config-name', 'first'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('first');
        expect(stdout).not.toContain('second');
        expect(stdout).not.toContain('third');
    });

    it('should work with multiple values for --config-name when the config is a function', () => {
        const { exitCode, stderr, stdout } = run(
            __dirname,
            ['--config', 'function-config.js', '--config-name', 'first', '--config-name', 'third'],
            false,
        );

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('first');
        expect(stdout).not.toContain('second');
        expect(stdout).toContain('third');
    });

    it('should log error if invalid config name is provided ', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--config', 'function-config.js', '--config-name', 'test'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain('Configuration with the "test" name was not found.');
        expect(stdout).toBeFalsy();
    });
});
