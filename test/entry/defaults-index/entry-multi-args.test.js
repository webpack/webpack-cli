'use strict';

const { stat } = require('fs');
const { resolve, sep } = require('path');

const { run, extractSummary } = require('../../utils/test-utils');

describe('single entry flag index present', () => {
    it('finds default index file and compiles successfully', done => {
        const { stdout, stderr } = run(__dirname);
        const summary = extractSummary(stdout);
        const outputDir = 'entry/defaults-index/bin';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 3, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        expect(stderr).not.toContain('Entry module not found');
        stat(resolve(__dirname, './bin/bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('finds default index file, compiles and overrides with flags successfully', done => {
        const { stdout, stderr } = run(__dirname, ['--output', 'bin/main.js']);
        expect(stderr).toContain('Duplicate flags found, defaulting to last set value');
        const summary = extractSummary(stdout);
        const outputDir = 'entry/defaults-index/bin';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 3, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        expect(stderr).not.toContain('Entry module not found');
        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
