'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../utils/test-utils');

describe('output flag defaults', () => {
    it('should create default file for a given directory', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', './a.js', '--output-path', './binary'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        // Should print warning about config fallback
        expect(stdout).toContain('option has not been set, webpack will fallback to');

        stat(resolve(__dirname, './binary/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('set default output directory on no output flag', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', './a.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './dist/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('throw error on empty output flag', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--entry', './a.js', '--output-path'], false);

        expect(exitCode).toBe(1);
        expect(stderr).toContain("error: option '-o, --output-path <value>' argument missing");
        expect(stdout).toBeFalsy();
    });
});
