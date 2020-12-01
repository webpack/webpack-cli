'use strict';
const { readdir } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('source-map object', () => {
    it('should treat source-map settings right', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, [], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'commonjs' starting...");
        expect(stderr).toContain("Compilation 'commonjs' finished");
        expect(stderr).toContain("Compilation 'amd' starting...");
        expect(stderr).toContain("Compilation 'amd' finished");
        expect(stdout).toBeTruthy();

        readdir(resolve(__dirname, 'dist'), (err, files) => {
            expect(err).toBe(null);
            expect(files.length).toBe(3);
            done();
        });
    });
    it('should override entire array on flag', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--devtool', 'source-map', '--output-path', './binary'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'commonjs' starting...");
        expect(stderr).toContain("Compilation 'commonjs' finished");
        expect(stderr).toContain("Compilation 'amd' starting...");
        expect(stderr).toContain("Compilation 'amd' finished");
        expect(stdout).toBeTruthy();

        readdir(resolve(__dirname, 'binary'), (err, files) => {
            expect(err).toBe(null);
            expect(files.length).toBe(4);
            done();
        });
    });
});
