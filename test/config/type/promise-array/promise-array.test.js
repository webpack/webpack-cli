'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('promise array', () => {
    it('is able to understand a configuration file as a promise', (done) => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.config.js'], false);

        expect(exitCode).toBe(0);
        expect(stdout).toBeTruthy();
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');

        stat(resolve(__dirname, './binary/a-promise.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);

            stat(resolve(__dirname, './binary/b-promise.js'), (err, stats) => {
                expect(err).toBe(null);
                expect(stats.isFile()).toBe(true);
                done();
            });
        });
    });
});
