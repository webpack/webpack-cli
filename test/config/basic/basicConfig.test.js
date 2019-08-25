'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run, extractSummary } = require('../../utils/test-utils');

describe('config flag test : Basic config file', () => {
    it('Should not throw any module not found', done => {
        const { stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')]);
        const summary = extractSummary(stdout);
        const outputDir = 'basic/bin';
        const outDirectoryFromCompiler = summary['Output Directory'];
        const outDirToMatch = outDirectoryFromCompiler
            .split('\\')
            .slice(outDirectoryFromCompiler.split('\\').length - 2, outDirectoryFromCompiler.split('\\').length)
            .join('/');
        expect(outDirToMatch).toContain(outputDir);
        stat(resolve(__dirname, './bin'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isDirectory()).toBe(true);
            done();
        });
    });
});
