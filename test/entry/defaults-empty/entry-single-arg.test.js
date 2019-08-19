'use strict';

const { stat } = require('fs');
const { resolve } = require('path');

const { run, extractSummary } = require('../../utils/test-utils');

describe('single entry flag empty project', () => {
    it('sets default entry, compiles but throw missing entry module error', done => {
        const { stdout, stderr } = run(__dirname);
        const summary = extractSummary(stdout);
        const outputDir = 'entry/defaults-empty/bin';

        expect(summary['Output Directory']).toContain(outputDir);
        // eslint-disable-next-line
        expect(stderr).toContain('Entry module not found: Error: Can\'t resolve \'./index.js\'');
        stat(resolve(__dirname, './bin'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isDirectory()).toBe(true);
            done();
        });
    });
});
