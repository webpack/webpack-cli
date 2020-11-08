'use strict';

const { run } = require('../utils/test-utils');
const { stat } = require('fs');
const { resolve } = require('path');

describe('--config-name flag', () => {
    it('should select only the config whose name is passed with --config-name', (done) => {
        const { stderr, exitCode } = run(__dirname, ['--config-name', 'first'], false);

        expect(stderr).toContain('first');
        expect(stderr).not.toContain('second');
        expect(stderr).not.toContain('third');
        expect(exitCode).toBe(0);

        stat(resolve(__dirname, './dist/dist-first.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should work with multiple values for --config-name', (done) => {
        const { stderr, exitCode } = run(__dirname, ['--config-name', 'first', '--config-name', 'third'], false);

        expect(stderr).toContain('first');
        expect(stderr).not.toContain('second');
        expect(stderr).toContain('third');
        expect(exitCode).toBe(0);

        stat(resolve(__dirname, './dist/dist-third.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);

            stat(resolve(__dirname, './dist/dist-first.js'), (err, stats) => {
                expect(err).toBe(null);
                expect(stats.isFile()).toBe(true);
                done();
            });
        });
    });

    it('should log error if invalid config name is provided', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config-name', 'test'], false);

        expect(stderr).toContain('Configuration with name "test" was not found.');
        expect(stdout).toBeFalsy();
        expect(exitCode).toBe(2);
    });

    it('should log error if multiple configurations are not found', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config-name', 'test', '-c', 'single-config.js'], false);

        expect(stderr).toContain('Configuration with name "test" was not found.');
        expect(stdout).toBeFalsy();
        expect(exitCode).toBe(2);
    });

    it('should log error if multiple configurations are not found #1', () => {
        const { stderr, stdout, exitCode } = run(
            __dirname,
            ['--config-name', 'test', '--config-name', 'bar', '-c', 'single-config.js'],
            false,
        );

        expect(stderr).toContain('Configuration with name "test" was not found.');
        expect(stderr).toContain('Configuration with name "bar" was not found.');
        expect(stdout).toBeFalsy();
        expect(exitCode).toBe(2);
    });

    it('should log error if multiple configurations are not found #2', () => {
        const { stderr, stdout, exitCode } = run(
            __dirname,
            ['--config-name', 'first', '--config-name', 'bar', '-c', 'single-config.js'],
            false,
        );

        expect(stderr).not.toContain('Configuration with name "first" was not found.');
        expect(stderr).toContain('Configuration with name "bar" was not found.');
        expect(stdout).toBeFalsy();
        expect(exitCode).toBe(2);
    });

    it('should work with config as a function', (done) => {
        const { stderr, exitCode } = run(__dirname, ['--config', 'function-config.js', '--config-name', 'first'], false);

        expect(stderr).toContain('first');
        expect(stderr).not.toContain('second');
        expect(stderr).not.toContain('third');
        expect(exitCode).toBe(0);

        stat(resolve(__dirname, './dist/dist-first.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should work with multiple values for --config-name when the config is a function', (done) => {
        const { stderr, exitCode } = run(
            __dirname,
            ['--config', 'function-config.js', '--config-name', 'first', '--config-name', 'third'],
            false,
        );

        expect(stderr).toContain('first');
        expect(stderr).not.toContain('second');
        expect(stderr).toContain('third');
        expect(exitCode).toBe(0);

        stat(resolve(__dirname, './dist/dist-third.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);

            stat(resolve(__dirname, './dist/dist-first.js'), (err, stats) => {
                expect(err).toBe(null);
                expect(stats.isFile()).toBe(true);
                done();
            });
        });
    });

    it('should log error if invalid config name is provided ', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['--config', 'function-config.js', '--config-name', 'test'], false);

        expect(stderr).toContain('Configuration with name "test" was not found.');
        expect(stdout).toBeFalsy();
        expect(exitCode).toBe(2);
    });
});
