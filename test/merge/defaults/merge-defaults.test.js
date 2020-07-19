'use strict';

const { stat, readFile } = require('fs');
const { resolve } = require('path');

const { run } = require('../../utils/test-utils');

describe('merge flag defaults', () => {
    it('merges a default webpack.base.config with default config lookup', (done) => {
        const { stdout } = run(__dirname, ['-m', './'], false);
        expect(stdout).not.toContain('option has not been set, webpack will fallback to');

        stat(resolve(__dirname, './dist/default.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
        readFile(resolve(__dirname, './dist/default.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('some_entry');
            done();
        });
    });
    it('merges a configuration file with default base config', (done) => {
        const { stdout } = run(__dirname, ['-c', './1.js'], false);

        expect(stdout).not.toContain('option has not been set, webpack will fallback to');
        stat(resolve(__dirname, './dist/default.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
        readFile(resolve(__dirname, './dist/default.js'), 'utf-8', (err, data) => {
            expect(err).toBe(null);
            expect(data).toContain('some_entry');
            done();
        });
    });
});
