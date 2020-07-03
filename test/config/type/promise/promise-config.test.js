'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('promise configuration', () => {
    it('is able to understand a configuration file as a promise', (done) => {
        const { stdout, stderr } = run(__dirname, ['-c', './webpack.config.js'], false);
        expect(stdout).toBeTruthy();
        expect(stderr).toBeFalsy();
        stat(resolve(__dirname, './binary/promise.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
