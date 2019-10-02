'use strict';
const { stat } = require('fs');
const { resolve, sep } = require('path');
const { run, extractSummary } = require('../../../utils/test-utils');

describe('function configuration', () => {
    it('is able to understand a configuration file as a function', done => {
        const { stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')], false);
        const summary = extractSummary(stdout);
        const outputDir = 'type/function/binary';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 3, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        stat(resolve(__dirname, './binary/functor.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
