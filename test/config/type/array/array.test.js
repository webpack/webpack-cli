'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('array', () => {
    it('is able to understand a configuration file in array format', (done) => {
        const { stderr, stdout, exitCode } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')], false);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        expect(stdout).toBeTruthy();
        stat(resolve(__dirname, './dist/dist-commonjs.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });
        stat(resolve(__dirname, './dist/dist-amd.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
