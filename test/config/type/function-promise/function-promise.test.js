'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../../utils/test-utils');

describe('function promise', () => {
    it('is able to understand a configuration file as a function', (done) => {
        const { stderr, exitCode } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js')], false);

        expect(stderr).toBeFalsy();
        expect(exitCode).toBe(0);

        stat(resolve(__dirname, './binary/functor.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
