'use strict';

const { stat } = require('fs');
const { resolve, sep } = require('path');

const { run, extractSummary } = require('../utils/test-utils');

describe('single entry flag', () => {
    it('compile but throw missing entry module error', done => {
        const { stdout, stderr } = run(__dirname);
        const summary = extractSummary(stdout);
        const outputDir = 'entry/bin';
        const outDirectoryFromCompiler = summary['Output Directory'].split(sep);
        const outDirToMatch = outDirectoryFromCompiler.slice(outDirectoryFromCompiler.length - 2, outDirectoryFromCompiler.length).join('/');
        expect(outDirToMatch).toContain(outputDir);
        expect(stderr).toContain('Entry module not found');
        stat(resolve(__dirname, 'bin'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isDirectory()).toBe(true);
            done();
        });
    });
});
