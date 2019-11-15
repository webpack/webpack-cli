'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run, extractSummary } = require('../../utils/test-utils');

describe('output flag named bundles', () => {
    it('should output file given as flag instead of in configuration', done => {
        const { stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js'), '--output', './binary/a.bundle.js'], false);
        const summary = extractSummary(stdout);
        const outputDir = 'named-bundles/binary';
        expect(summary['Output Directory']).toContain(outputDir);
        stat(resolve(__dirname, './binary/a.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should create multiple bundles with an overriding flag', done => {
        const { stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.single.config.js'), '--output', './bin/[name].bundle.js'], false);
        const summary = extractSummary(stdout);
        const outputDir = 'named-bundles/bin';
        expect(summary['Output Directory']).toContain(outputDir);

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
        const { stdout, stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.defaults.config.js'), '--defaults'], false);
        const summary = extractSummary(stdout);
        const outputDir = 'named-bundles/dist';

        expect(stderr).toBe('');

        expect(summary['Output Directory']).toContain(outputDir);

        stat(resolve(__dirname, './dist/b.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });
        stat(resolve(__dirname, './dist/c.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
        });
        done();
    });

    it('should sucessfully compile multiple entries', done => {
        const { stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.multiple.config.js')], false);
        const summary = extractSummary(stdout);
        const outputDir = 'named-bundles/bin';
        expect(summary['Output Directory']).toContain(outputDir);

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
