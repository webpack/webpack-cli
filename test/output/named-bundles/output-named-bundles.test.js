'use strict';
const { stat } = require('fs');
const { join, resolve } = require('path');
const rimraf = require('rimraf');
const { run } = require('../../utils/test-utils');

describe('output flag named bundles', () => {
    const clean = () => {
        rimraf.sync(join(__dirname, 'bin'));
        rimraf.sync(join(__dirname, 'dist'));
        rimraf.sync(join(__dirname, 'binary'));
    };

    beforeEach(clean);

    afterAll(clean);

    it('should output file given as flag instead of in configuration', (done) => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js'), '--output', './binary/a.bundle.js'], false);
        expect(stderr).toBeFalsy();

        stat(resolve(__dirname, './binary/a.bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should create multiple bundles with an overriding flag', (done) => {
        const { stderr } = run(
            __dirname,
            ['-c', resolve(__dirname, 'webpack.single.config.js'), '--output', './bin/[name].bundle.js'],
            false,
        );
        expect(stderr).toBeFalsy();

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

    it('should not throw error on same bundle name for multiple entries with defaults', (done) => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.defaults.config.js'), '--defaults'], false);
        expect(stderr).toBeFalsy();

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

    it('should successfully compile multiple entries', (done) => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.multiple.config.js')], false);
        expect(stderr).toBeFalsy();

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

    it('should output file in bin directory using default webpack config with warning for empty output value', (done) => {
        const { stderr } = run(__dirname, ['--output='], false);
        expect(stderr).toContain(
            "You provided an empty output value. Falling back to the output value of your webpack config file, or './dist/' if none was provided",
        );

        stat(resolve(__dirname, './bin/bundle.js'), (err, stats) => {
            expect(err).toBe(null);
            expect(stats.isFile()).toBe(true);
            done();
        });
    });

    it('should output file in dist directory using default value with warning for empty output value', (done) => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.defaults.config.js'), '--defaults', '--output='], false);
        expect(stderr).toContain(
            "You provided an empty output value. Falling back to the output value of your webpack config file, or './dist/' if none was provided",
        );

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
});
