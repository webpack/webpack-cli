'use strict';
const { stat } = require('fs');
const { resolve, join } = require('path');
const { run } = require('../utils/test-utils');
const rimraf = require('rimraf');

const outputDirs = ['binary', 'dist'];

describe('output flag defaults', () => {
    afterAll(() => {
        outputDirs.forEach((oPath) => rimraf.sync(join(__dirname, oPath)));
    });
    it('should create default file for a given directory', (done) => {
        const { stdout } = run(__dirname, ['--entry', './a.js', '--output', './binary'], false);
        // Should print a warning about config fallback
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
        const { stderr } = run(__dirname, ['--entry', './a.js', '--output'], false);
        expect(stderr).toContain("error: option '-o, --output <value>' argument missing");
    });
});
