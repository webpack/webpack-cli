'use strict';
const { stat } = require('fs');
const { resolve, sep } = require('path');
const { run, extractSummary } = require('../../utils/test-utils');

describe('Overwrite-and-chunk Output flag ', () => {
    it('should create a file passed in the output flag, not that one present in webpack.config.js', done => {
        const { stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js'), '--output', './bin/a.bundle.js']);
        const summary = extractSummary(stdout);
        const outputDir = 'overwrite-and-chunk/bin';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 2, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        stat(resolve(__dirname, './bin/a.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
    // Overwriting the single output from config file to chunk using --output flag
    it('should create chunk file as an output for the entries as overwriting the config single bundle output : [name].bundle.js', done => {
        const { stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.single.config.js'), '--output', './bin/[name].bundle.js']);
        const summary = extractSummary(stdout);
        const outputDir = 'overwrite-and-chunk/bin';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 2, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        stat(resolve(__dirname, './bin/b.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });
        stat(resolve(__dirname, './bin/c.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });
        done();
    });
    // Overwriting the chunk output from config file to single bundle file using --output flag
    it('should throw error as multiple entry to a single chunk: single.bundle.js', done => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.single.config.js'), '--output', './bin/single.bundle.js']);
        expect(stderr).toContain('webpack: Conflict: Multiple chunks emit assets to the same filename single.bundle.js (chunks 0 and 1)');
        done();
    });
});
