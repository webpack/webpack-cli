'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run, extractSummary } = require('../../../utils/test-utils');

describe('single entry with entry in config', () => {
    it('should use config entry if config entry existed', done => {
        const { stdout, stderr } = run(__dirname, ['-c', '../1.js'], false);
        const summary = extractSummary(stdout);
        const outputDir = 'entry-with-config/binary';
        // eslint-disable-next-line quotes
        expect(summary['Output Directory']).toContain(outputDir);

        // eslint-disable-next-line quotes
        console.log(stderr);
        expect(stdout).toContain('./a.js');
        stat(resolve(__dirname, './binary/index.bundle.js'), (err, stats) => {
            expect(err).toBeFalsy();
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
