'use strict';
const { readdir, stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('source-map object', () => {
    it('should not write a source map for obj config', (done) => {
        run(__dirname, ['-c', './webpack.eval.config.js']);
        readdir(resolve(__dirname, 'bin'), (err, files) => {
            expect(files.length).toBeGreaterThanOrEqual(1);
            expect(err).toBe(null);
            done();
        });
    });

    it('should write a sourcemap file', (done) => {
        const { stderr } = run(__dirname, ['-c', './webpack.source.config.js'], false);
        expect(stderr).toBe('');
        stat(resolve(__dirname, 'dist/dist-amd.js.map'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should override config with source-map', (done) => {
        run(__dirname, ['-c', './webpack.eval.config.js', '--sourcemap', 'source-map', '-o', './binary/dist-amd.js'], false);
        stat(resolve(__dirname, 'binary/dist-amd.js.map'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });
});
