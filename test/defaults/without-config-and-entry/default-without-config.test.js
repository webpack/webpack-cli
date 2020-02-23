'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run, extractSummary } = require('../../utils/test-utils');

describe('output flag defaults without config', () => {
    it('should throw if the entry file is not present', done => {
        const { stdout, stderr } = run(__dirname, ['--defaults'], false);
        const summary = extractSummary(stdout);
        console.log(stdout, stderr);
        const outputDir = 'without-config/dist';
        // eslint-disable-next-line quotes
        expect(stderr).toContain("Module not found: Error: Can't resolve './index.js' in");
        expect(summary['Output Directory']).toContain(outputDir);
        stat(resolve(__dirname, './dist/main.js'), (err, stats) => {
            expect(err).toBeTruthy();
            expect(stats).toBe(undefined);
            done();
        });
    });
});
