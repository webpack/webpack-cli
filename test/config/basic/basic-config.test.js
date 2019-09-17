'use strict';
const { stat } = require('fs');
const { resolve, sep } = require('path');
const { run, extractSummary } = require('../../utils/test-utils');

describe('basic config file', () => {
    it('Has Output Directory as basic/bin, creates a file name bundle.js', done => {
        const { stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')]);
        const summary = extractSummary(stdout);
        const outputDir = 'basic/bin';
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
