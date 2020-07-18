'use strict';

const { stat } = require('fs');
const { resolve } = require('path');

const { run } = require('../../utils/test-utils');

describe('merge flag configuration', () => {
    it('merges two configurations together', (done) => {
        const { stdout } = run(__dirname, ['--config', './1.js', '--merge', './2.js'], false);
        expect(stdout).not.toContain('option has not been set, webpack will fallback to');
        stat(resolve(__dirname, './dist/merged.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
    it('merges two configurations together with flag alias', (done) => {
        const { stdout } = run(__dirname, ['--config', './1.js', '-m', './2.js'], false);
        expect(stdout).toContain('merged.js');
        stat(resolve(__dirname, './dist/merged.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
