'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('multiple dev config files with webpack.config.js', () => {
    it('Uses webpack.config.development.js', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, [], false);

        expect(exitCode).toEqual(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toBeTruthy();

        stat(resolve(__dirname, './binary/dev.folder.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
