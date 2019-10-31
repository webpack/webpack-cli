'use strict';
const { stat } = require('fs');
const { resolve, sep } = require('path');
const { run, extractSummary } = require('../../utils/test-utils');

describe('dotfolder array config lookup', () => {
    it('should find a webpack array configuration in a dotfolder', done => {
        const { stdout, stderr } = run(__dirname, [], false);
        expect(stderr).not.toBeUndefined();
        expect(stdout).not.toBeUndefined();

        const summary = extractSummary(stdout);
        const outputDir = 'config-lookup/dotfolder-array/dist';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 3, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        stat(resolve(__dirname, './dist/dist-commonjs.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });
        stat(resolve(__dirname, './dist/dist-amd.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
