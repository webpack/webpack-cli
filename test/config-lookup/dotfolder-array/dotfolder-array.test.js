'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('dotfolder array config lookup', () => {
    it('should find a webpack array configuration in a dotfolder', done => {
        const { stdout, stderr } = run(__dirname, [], false);
        expect(stderr).not.toBeUndefined();
        expect(stdout).not.toBeUndefined();

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
