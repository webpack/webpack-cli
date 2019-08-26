'use strict';
const { stat } = require('fs');
const { resolve, sep } = require('path');
const { run, extractSummary } = require('../../utils/test-utils');

describe('config flag test : Empty config file', () => {
    const { stdout, stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')]);
    const summary = extractSummary(stdout);
    const outputDir = 'empty/bin';
    it('should log Output Directory as basic/bin', done => {
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 2, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        done();
    });
    it('compile but throw missing entry module error', done => {
        expect(stderr).toContain('Entry module not found');
        done();
    });
    it('should create a bin Directory', done => {
        stat(resolve(__dirname, './bin'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isDirectory()).toBe(true);
            done();
        });
    });
});
