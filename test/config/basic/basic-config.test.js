'use strict';
const { stat } = require('fs');
const { resolve, sep } = require('path');
const { run, extractSummary } = require('../../utils/test-utils');

describe('basic config file', () => {
    it('is able to understand and parse a very basic configuration file', done => {
        const { stdout, stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js'), '--output', './binary/a.bundle.js']);
        expect(stderr).toContain('Duplicate flags found, defaulting to last set value');
        expect(stdout).not.toBe(undefined);
        const summary = extractSummary(stdout);
        const outputDir = 'basic/binary';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler
            .slice(outDirectoryFromCompiler.length - 2, outDirectoryFromCompiler.length)
            .join('/');
        expect(outDirToMatch).toContain(outputDir);
        stat(resolve(__dirname, './binary/a.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
