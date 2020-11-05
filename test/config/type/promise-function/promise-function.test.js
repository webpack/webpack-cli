'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('promise function', () => {
    it('is able to understand a configuration file as a promise', (done) => {
        const { stdout, stderr, exitCode } = run(__dirname, ['-c', './webpack.config.js'], false);

        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);
        stat(resolve(__dirname, './binary/promise.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
