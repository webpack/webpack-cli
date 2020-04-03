'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../utils/test-utils');

describe('output flag defaults', () => {
    it('should create default file for a given directory', (done) => {
        run(__dirname, ['--entry', './a.js', '--output', './binary'], false);

        stat(resolve(__dirname, './binary/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
    it('set default output directory on empty flag', (done) => {
        const { stdout } = run(__dirname, ['--entry', './a.js', '--output'], false);
        // Should print a warning about config fallback since we did not supply --defaults
        expect(stdout).toContain('option has not been set, webpack will fallback to');

        stat(resolve(__dirname, './dist/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
    it('should not throw when --defaults flag is passed', (done) => {
        const { stderr } = run(__dirname, ['--defaults'], false);
        // When using --defaults it should not print warnings about config fallback
        expect(stderr).toBeFalsy();
        stat(resolve(__dirname, './dist/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
