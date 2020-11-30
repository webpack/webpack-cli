'use strict';
const { readdir, stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('source-map object', () => {
    it('should not write a source map for obj config', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.eval.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'amd' starting...");
        expect(stderr).toContain("Compilation 'amd' finished");
        expect(stdout).toBeTruthy();

        readdir(resolve(__dirname, 'bin'), (err, files) => {
            expect(files.length).toBeGreaterThanOrEqual(1);
            expect(err).toBe(null);
            done();
        });
    });

    it('should write a sourcemap file', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.source.config.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'amd' starting...");
        expect(stderr).toContain("Compilation 'amd' finished");
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, 'dist/dist-amd.js.map'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should override config with source-map', (done) => {
        const { exitCode, stderr, stdout } = run(
            __dirname,
            ['-c', './webpack.eval.config.js', '--devtool', 'source-map', '-o', './binary'],
            false,
        );

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'amd' starting...");
        expect(stderr).toContain("Compilation 'amd' finished");
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, 'binary/dist-amd.js.map'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
