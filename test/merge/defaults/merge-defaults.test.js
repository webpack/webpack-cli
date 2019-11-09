'use strict';

const { stat } = require('fs');
const { resolve } = require('path');

const { run } = require('../../utils/test-utils');

describe('merge flag defaults', () => {
    it('merges a default webpack.base.config with default config lookup', done => {
        const { stderr } = run(__dirname, ['-m'], false);
        expect(stderr).toBe('');
        stat(resolve(__dirname, './dist/default.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
    it('merges a configuraiton file with default base config', done => {
        const { stderr } = run(__dirname, ['-c', './1.js'], false);
        expect(stderr).toBe('');
        stat(resolve(__dirname, './dist/bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
