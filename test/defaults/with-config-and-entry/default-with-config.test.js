'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('output flag defaults with config', () => {
    it.skip('should use default entry if config entry file is not present', (done) => {
        const { stdout, stderr } = run(__dirname, ['--defaults'], false);
        // Should use the output dir specified in the config
        expect(stdout).toContain('./index.js');
        // Should not throw because of unknown entry in config since it will pickup the default entry
        expect(stderr).toBeFalsy();
        stat(resolve(__dirname, './binary/a.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
