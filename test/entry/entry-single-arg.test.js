'use strict';

const { stat } = require('fs');
const { resolve } = require('path');

const { run, extractSummary } = require('../utils/test-utils');

describe('single entry flag', () => {
    it('compile but throw missing entry module error', done => {
        const { stdout, stderr } = run(__dirname);
        const summary = extractSummary(stdout);
        const outputDir = 'entry/bin';
        expect(summary['Output Directory']).toContain(outputDir);
        expect(stderr).toContain('Entry module not found');
        stat(resolve(__dirname, './bin'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isDirectory()).toBe(true);
            done();
        });
    });
});
