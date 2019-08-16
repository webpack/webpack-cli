'use strict';

const { exists } = require('fs');
const { run, extractSummary } = require('../utils/test-utils');

describe('single entry flag', () => {
    it('compile but throw missing entry module error', done => {
        const { stdout, stderr } = run(__dirname);
        const summary = extractSummary(stdout);
        const outputDir = 'entry/dist';
        expect(summary['Output Directory']).toContain(outputDir);
        expect(stderr).toContain('Entry module not found');

        exists('./dist', dirExists => {
            expect(dirExists).toBe(true);
            done();
        });
    });
});
