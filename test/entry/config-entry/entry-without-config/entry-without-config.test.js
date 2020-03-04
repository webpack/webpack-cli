'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run, extractSummary } = require('../../../utils/test-utils');

describe('single entry with entry in config', () => {
    it('should use config entry if config entry existed', done => {
        const { stdout } = run(__dirname, ['-c', '../1.js', '../index.js'], false);
        const summary = extractSummary(stdout);
        const outputDir = 'entry-without-config/binary';
        // eslint-disable-next-line quotes
        expect(summary['Output Directory']).toContain(outputDir);

        // eslint-disable-next-line quotes
        expect(stdout).toContain('./index.js');
        stat(resolve(__dirname, './binary/main.bundle.js'), (err, stats) => {
            expect(err).toBeFalsy();
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
