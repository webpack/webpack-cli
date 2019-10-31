'use strict';

const { stat } = require('fs');
const { resolve } = require('path');

const { run, extractSummary } = require('../../utils/test-utils');

describe('config lookup test : dotfolder', () => {
    it('should find a webpack configuration in a dotfolder', done => {
        const { stdout, stderr } = run(__dirname, [], false);
        expect(stderr).not.toBeUndefined();
        expect(stdout).not.toBeUndefined();

        const summary = extractSummary(stdout);
        const outputDir = 'config-lookup/dotfiles/dist';

        expect(summary['Output Directory']).toContain(outputDir);
        expect(stderr).not.toContain('Entry module not found');
        stat(resolve(__dirname, './dist/bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
