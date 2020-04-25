'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('basic config file', () => {
    it('is able to understand and parse a very basic configuration file', (done) => {
        const { stdout, stderr } = run(
            __dirname,
            ['-c', resolve(__dirname, 'webpack.config.js'), '--output', './binary/a.bundle.js'],
            false,
        );
        expect(stderr).toBeFalsy();
        expect(stdout).not.toBe(undefined);
        stat(resolve(__dirname, './binary/a.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
