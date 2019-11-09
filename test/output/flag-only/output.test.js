'use strict';
const { stat } = require('fs');
const { resolve, sep } = require('path');
const { run, extractSummary } = require('../../utils/test-utils');

describe('Output flag : No webpack.config.js', () => {
    it('should create a file named "bundle.js" in the output dir mentioned : --output bin ', done => {
        const { stdout } = run(__dirname, ['--entry', './a.js', '--output', './binary']);
        const summary = extractSummary(stdout);
        const outputDir = 'flag-only/binary';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 2, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        stat(resolve(__dirname, './binary/bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
    it('should create file name "bundle.js" for passing no input for output flag : --output <empty> ', done => {
        const { stdout } = run(__dirname, ['--entry', './a.js', '--output']);
        const summary = extractSummary(stdout);
        const outputDir = 'flag-only/bin';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 2, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        stat(resolve(__dirname, './bin/bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
