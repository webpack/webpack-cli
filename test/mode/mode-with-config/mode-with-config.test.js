'use strict';
const { stat, readFile } = require('fs');
const { resolve } = require('path');
// eslint-disable-next-line node/no-unpublished-require
const { run } = require('../../utils/test-utils');

describe('mode flags with config', () => {
    it('should run in production mode when --mode=production is passed', (done) => {
        const { stderr, stdout } = run(__dirname, ['--mode', 'production', '--config', './webpack.config.js']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

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
        const { stderr, stdout } = run(__dirname, ['--mode', 'development', '--config', './webpack.config.js']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

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
        const { stderr, stdout } = run(__dirname, ['--mode', 'none', '--config', './webpack.config.js']);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

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
});
