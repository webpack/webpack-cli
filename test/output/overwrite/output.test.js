'use strict';
const { stat } = require('fs');
const { resolve, sep } = require('path');
const { run, extractSummary } = require('../../utils/test-utils');

describe('Overwrite Output flag ', () => {
    it('should create a file passed in the output file not that one present in webpack.config.js', done => {
        const { stdout } = run(__dirname, ['--entry', './a.js', '--output', './bin/a.bundle.js']);
        const summary = extractSummary(stdout);
        const outputDir = 'overwrite/bin';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 2, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        stat(resolve(__dirname, './bin/a.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
