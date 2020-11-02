'use strict';
const { readdir, stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('source-map object', () => {
    it('should not write a source map for obj config', (done) => {
        const { stderr, stdout, exitCode } = run(__dirname, ['-c', './webpack.eval.config.js']);

        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(exitCode).toBe(0);
        readdir(resolve(__dirname, 'bin'), (err, files) => {
            expect(files.length).toBeGreaterThanOrEqual(1);
            expect(err).toBe(null);
            done();
        });
    });

    it('should write a sourcemap file', (done) => {
        const { stderr, stdout, exitCode } = run(__dirname, ['-c', './webpack.source.config.js'], false);

        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
        expect(exitCode).toBe(0);
        stat(resolve(__dirname, 'dist/dist-amd.js.map'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should override config with source-map', (done) => {
        run(__dirname, ['-c', './webpack.eval.config.js', '--devtool', 'source-map', '-o', './binary'], false);
        stat(resolve(__dirname, 'binary/dist-amd.js.map'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
