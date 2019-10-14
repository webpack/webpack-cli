'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run, extractSummary, outDirExtractor } = require('../../../utils/test-utils');

describe('promise configuration', () => {
    it('is able to understand a configuration file as a promise', done => {
        const { stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')], false);
        const summary = extractSummary(stdout);
        const outputDir = 'type/promise/binary';
        const outDirToMatch = outDirExtractor(summary['Output Directory'], 3);
        expect(outDirToMatch).toContain(outputDir);
        stat(resolve(__dirname, './binary/promise.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
