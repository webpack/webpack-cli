'use strict';
const { stat, readFile } = require('fs');
const { resolve } = require('path');
// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../../utils/test-utils');

describe('mode flags with config', () => {
    it('should run in production mode when --mode=production is passed', (done) => {
        const { exitCode } = run(__dirname, ['--mode', 'production', '--config', './webpack.config.js']);

        expect(exitCode).toBe(0);

        // Should generate the appropriate files
        stat(resolve(__dirname, './bin/main.js.OTHER.LICENSE.txt'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });

        // Should not generate source maps when not specified
        stat(resolve(__dirname, './bin/main.js.map'), (err) => {
            expect(err).toBeTruthy();
        });

        // Correct mode should be propagated to the compiler
        readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('"production mode"');
            done();
        });
    });

    it('should run in development mode when --mode=development is passed', (done) => {
        const { exitCode } = run(__dirname, ['--mode', 'development', '--config', './webpack.config.js']);

        expect(exitCode).toBe(0);

        // Should generate the appropriate files
        stat(resolve(__dirname, './bin/main.js.OTHER.LICENSE.txt'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });

        // Should not generate source maps when not specified
        stat(resolve(__dirname, './bin/main.js.map'), (err) => {
            expect(err).toBeTruthy();
        });

        // Correct mode should be propagated to the compiler
        readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('development mode');
            done();
        });
    });

    it('should run in none mode when --mode=none is passed', (done) => {
        const { exitCode } = run(__dirname, ['--mode', 'none', '--config', './webpack.config.js']);

        expect(exitCode).toBe(0);

        // Should generate the appropriate files
        stat(resolve(__dirname, './bin/main.js.OTHER.LICENSE.txt'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });

        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });

        // Should not generate source maps when not specified
        stat(resolve(__dirname, './bin/main.js.map'), (err) => {
            expect(err).toBeTruthy();
        });

        // Correct mode should be propagated to the compiler
        readFile(resolve(__dirname, './bin/main.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('none mode');
            done();
        });
    });

    it('should use mode flag over config', () => {
        const { stdout, exitCode } = run(__dirname, ['--mode', 'production', '-c', 'webpack.config2.js']);

        expect(exitCode).toEqual(0);
        expect(stdout).toContain(`mode: 'production'`);
    });

    it('should use mode from flag over NODE_ENV', () => {
        const { stdout, exitCode } = run(__dirname, ['--mode', 'none', '-c', 'webpack.config2.js'], false, [], {
            NODE_ENV: 'production',
        });

        expect(exitCode).toEqual(0);
        expect(stdout).toContain(`mode: 'none'`);
    });

    it('should use mode from config over NODE_ENV', () => {
        const { stdout, exitCode } = run(__dirname, ['-c', 'webpack.config2.js']);

        expect(exitCode).toEqual(0);
        expect(stdout).toContain(`mode: 'development'`);
    });

    it('should use mode from config when multiple config are supplied', () => {
        const { stdout } = run(__dirname, ['-c', 'webpack.config3.js', '-c', 'webpack.config2.js']);

        expect(stdout).toContain(`mode: 'development'`);
        expect(stdout.match(new RegExp("mode: 'development'", 'g')).length).toEqual(1);
    });

    it('mode flag should apply to all configs', () => {
        const { stdout, exitCode } = run(__dirname, ['--mode', 'none', '-c', './webpack.config3.js', '-c', './webpack.config2.js']);

        expect(exitCode).toEqual(0);
        expect(stdout).toContain(`mode: 'none'`);
        expect(stdout.match(new RegExp("mode: 'none'", 'g')).length).toEqual(2);
    });

    it('only config where mode is absent pick up from NODE_ENV', () => {
        const { stdout, exitCode } = run(__dirname, ['-c', './webpack.config3.js', '-c', './webpack.config2.js'], false, [], {
            NODE_ENV: 'production',
        });

        expect(exitCode).toEqual(0);
        expect(stdout).toContain(`mode: 'production'`);
        expect(stdout).toContain(`mode: 'development'`);
        expect(stdout.match(new RegExp("mode: 'production'", 'g')).length).toEqual(1);
        expect(stdout.match(new RegExp("mode: 'development'", 'g')).length).toEqual(1);
    });
});
