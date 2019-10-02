'use strict';

const { sep } = require('path');
const { run, extractSummary } = require('../../utils/test-utils');

describe('single entry flag empty project', () => {
    it('sets default entry, compiles but throw missing entry module error', () => {
        const { stdout, stderr } = run(__dirname);
        const summary = extractSummary(stdout);
        const outputDir = 'defaults-empty/bin';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 2, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        expect(stderr).toContain('Entry module not found');
    });
});
