'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('output flag named bundles', () => {
    it('should output file given as flag instead of in configuration', done => {
        run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js'), '--output', './binary/a.bundle.js'], false);
        stat(resolve(__dirname, './binary/a.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should create multiple bundles with an overriding flag', done => {
        run(__dirname, ['-c', resolve(__dirname, 'webpack.single.config.js'), '--output', './bin/[name].bundle.js'], false);

        stat(resolve(__dirname, './bin/b.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });
        stat(resolve(__dirname, './bin/c.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });
        done();
    });

    it('should throw error on same bundle name for multiple entries', done => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.single.config.js')], false);
        const errMsg = 'Multiple chunks emit assets to the same filename bundle.js';
        expect(stderr).toContain(errMsg);
        done();
    });

    it('should not throw error on same bundle name for multiple entries with defaults', done => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.defaults.config.js'), '--defaults'], false);

        expect(stderr).toBe('');

        stat(resolve(__dirname, './dist/b.main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });
        stat(resolve(__dirname, './dist/c.main.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });
        done();
    });

    it('should successfully compile multiple entries', done => {
        run(__dirname, ['-c', resolve(__dirname, 'webpack.multiple.config.js')], false);

        stat(resolve(__dirname, './bin/b.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });
        stat(resolve(__dirname, './bin/c.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });
        done();
    });
});
