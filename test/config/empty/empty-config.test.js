'use strict';
const { resolve, sep } = require('path');
const { run, extractSummary } = require('../../utils/test-utils');

describe('config flag with empty config file', () => {
    it('should throw error with no configuration or index file', () => {
        const { stdout, stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')]);
        const summary = extractSummary(stdout);
        const outputDir = 'empty/bin';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler
            .slice(outDirectoryFromCompiler.length - 2, outDirectoryFromCompiler.length)
            .join('/');
        expect(outDirToMatch).toContain(outputDir);
        expect(stderr).toBeTruthy();
    });
});
