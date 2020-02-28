'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run, extractSummary } = require('../utils/test-utils');

describe('output flag defaults', () => {
    it('should create default file for a given directory', done => {
        const { stdout } = run(__dirname, ['--entry', './a.js', '--output', './binary'], false);
        const summary = extractSummary(stdout);
        const outputDir = 'defaults/binary';

        expect(summary['Output Directory']).toContain(outputDir);

        stat(resolve(__dirname, './binary/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
    it('set default output directory on empty flag', done => {
        const { stdout, stderr } = run(__dirname, ['--entry', './a.js', '--output'], false);
        // Should print a warning about config fallback since we did not supply --defaults
        expect(stderr).toContain('option has not been set, webpack will fallback to');
        const summary = extractSummary(stdout);

        const outputDir = 'defaults/dist';

        expect(summary['Output Directory']).toContain(outputDir);
        stat(resolve(__dirname, './dist/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
    it('should not throw when --defaults flag is passed', done => {
        const { stdout, stderr } = run(__dirname, ['--defaults'], false);
        const summary = extractSummary(stdout);
        const outputDir = 'defaults/dist';
        // When using --defaults it should not print warnings about config fallback
        expect(stderr).toBeFalsy();
        expect(summary['Output Directory']).toContain(outputDir);
        stat(resolve(__dirname, './dist/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
