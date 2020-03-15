'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('defaults flag used with merge flag', () => {
    it('should use default config when merge flag is supplied', done => {
        const { stdout, stderr } = run(__dirname, ['--defaults', '-m', './webpack.config.js'], false);
        // Should use the output dir specified in the config
        expect(stdout).toContain('./index.js');
        // Should not throw because of unknown entry in config since it will pickup the default entry
        expect(stderr).toBeFalsy();
        stat(resolve(__dirname, './dist/main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
