'use strict';
const { resolve } = require('path');
const { run, extractSummary, outDirExtractor } = require('../../utils/test-utils');

describe('config flag test : Empty config file', () => {
    it('Output Directory as basic/bin, throw missing entry module error', () => {
        const { stdout, stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')]);
        const summary = extractSummary(stdout);
        const outputDir = 'empty/bin';
        const outDirToMatch = outDirExtractor(summary['Output Directory'], 2);
        expect(outDirToMatch).toContain(outputDir);
        expect(stderr).toContain('Entry module not found');
    });
});
