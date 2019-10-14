'use strict';
const { run, extractSummary, outDirExtractor } = require('../../utils/test-utils');

describe('single entry flag empty project', () => {
    it('sets default entry, compiles but throw missing entry module error', () => {
        const { stdout, stderr } = run(__dirname);
        const summary = extractSummary(stdout);
        const outputDir = 'defaults-empty/bin';
        const outDirToMatch = outDirExtractor(summary['Output Directory'], 2);
        expect(outDirToMatch).toContain(outputDir);
        expect(stderr).toContain('Entry module not found');
    });
});
