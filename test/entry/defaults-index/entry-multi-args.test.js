'use strict';

const { stat } = require('fs');
const { resolve } = require('path');

const { run, extractSummary } = require('../../utils/test-utils');

describe('single entry flag index present', () => {
    it('finds default index file and compiles successfully', done => {
        const { stdout, stderr } = run(__dirname);
        const summary = extractSummary(stdout);
        const outputDir = 'entry/defaults-index/bin';

        expect(summary['Output Directory']).toContain(outputDir);
        // eslint-disable-next-line
        expect(stderr).not.toContain('Entry module not found: Error: Can\'t resolve \'./index.js\'');
        stat(resolve(__dirname, './bin/bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('finds default index file, compiles and overrides with flags successfully', done => {
        const { stdout, stderr } = run(__dirname, ['output', 'bin/main.js']);
        expect(stderr).toBe(undefined);
        const summary = extractSummary(stdout);
        const outputDir = 'entry/defaults-index/bin';

        expect(summary['Output Directory']).toContain(outputDir);
        // eslint-disable-next-line
        expect(stderr).not.toContain('Entry module not found: Error: Can\'t resolve \'./index.js\'');
        stat(resolve(__dirname, './bin/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
