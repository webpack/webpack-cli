'use strict';
const { stat } = require('fs');
const { resolve, sep } = require('path');
const { run, extractSummary } = require('../../utils/test-utils');

describe('config flag test : Basic config file', () => {
    const { stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')]);
    const summary = extractSummary(stdout);
    const outputDir = 'basic/bin';
    it('should log Output Directory as basic/bin', done => {
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 2, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        done();
    });
    it('should create a bin Directory', done => {
        stat(resolve(__dirname, './bin'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isDirectory()).toBe(true);
            done();
        });
    });
    it('should create a file name bundle.js inside bin', done => {
        stat(resolve(__dirname, './bin/bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
