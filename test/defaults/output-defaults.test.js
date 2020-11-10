'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../utils/test-utils');

describe('output flag defaults', () => {
    it('should create default file for a given directory', (done) => {
        const { stdout, stderr, exitCode } = run(__dirname, ['--entry', './a.js', '--output-path', './binary'], false);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        // Should print warning about config fallback
        expect(stdout).toContain('option has not been set, webpack will fallback to');
        stat(resolve(__dirname, './binary/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('set default output directory on no output flag', (done) => {
        run(__dirname, ['--entry', './a.js'], false);

        stat(resolve(__dirname, './dist/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('throw error on empty output flag', () => {
        const { stderr } = run(__dirname, ['--entry', './a.js', '--output-path'], false);
        expect(stderr).toContain("error: option '-o, --output-path <value>' argument missing");
    });
});
