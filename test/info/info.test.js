'use strict';

const { sep } = require('path');
const { run, extractSummary } = require('../utils/test-utils');
const pkgJSON = require('../../package.json');

describe('info flag', () => {
    it('outputs version of webpack', () => {
        const { stdout, stderr } = run(__dirname);
        const summary = extractSummary(stdout);
        const str = summary.Version;
        const result1 = str.slice(1);
        expect(pkgJSON.dependencies.webpack).toContain(result1);
        expect(stderr).toContain('option has not been set, webpack will fallback to');
        const outputDir = 'info/bin';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 2, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
    });

    it('outputs versions with dashed syntax', () => {
        const { stderr } = run(__dirname, ['--info']);
        expect(stderr).toContain('option has not been set, webpack will fallback to');
    });
});
