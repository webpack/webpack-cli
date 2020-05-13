'use strict';
const { statSync } = require('fs');
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

    it('should output file given as flag instead of in configuration', () => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js'), '--output', './binary/a.bundle.js'], false);
        expect(stderr).toBeFalsy();

        const stats = statSync(resolve(__dirname, './binary/a.bundle.js'));
        expect(stats.isFile()).toBe(true);
    });

    it('should resolve the path to binary/a.bundle.js as ./binary/a.bundle.js', () => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js'), '--output', 'binary/a.bundle.js'], false);
        expect(stderr).toBeFalsy();

        const stats = statSync(resolve(__dirname, './binary/a.bundle.js'));
        expect(stats.isFile()).toBe(true);
    });

    it('should create multiple bundles with an overriding flag', () => {
        const { stderr } = run(
            __dirname,
            ['-c', resolve(__dirname, 'webpack.single.config.js'), '--output', './bin/[name].bundle.js'],
            false,
        );
        expect(stderr).toBeFalsy();

        let stats = statSync(resolve(__dirname, './bin/b.bundle.js'));
        expect(stats.isFile()).toBe(true);
        stats = statSync(resolve(__dirname, './bin/c.bundle.js'));
        expect(stats.isFile()).toBe(true);
    });

    it('should not throw error on same bundle name for multiple entries with defaults', () => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.defaults.config.js'), '--defaults'], false);
        expect(stderr).toBeFalsy();

        let stats = statSync(resolve(__dirname, './dist/b.main.js'));
        expect(stats.isFile()).toBe(true);
        stats = statSync(resolve(__dirname, './dist/c.main.js'));
        expect(stats.isFile()).toBe(true);
    });

    it('should successfully compile multiple entries', () => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.multiple.config.js')], false);
        expect(stderr).toBeFalsy();

        let stats = statSync(resolve(__dirname, './bin/b.bundle.js'));
        expect(stats.isFile()).toBe(true);
        stats = statSync(resolve(__dirname, './bin/c.bundle.js'));
        expect(stats.isFile()).toBe(true);
    });

    it('should output file in bin directory using default webpack config with warning for empty output value', () => {
        const { stderr } = run(__dirname, ['--output='], false);
        expect(stderr).toContain(
            "You provided an empty output value. Falling back to the output value of your webpack config file, or './dist/' if none was provided",
        );

        const stats = statSync(resolve(__dirname, './bin/bundle.js'));
        expect(stats.isFile()).toBe(true);
    });

    it('should output file in dist directory using default value with warning for empty output value', () => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.defaults.config.js'), '--defaults', '--output='], false);
        expect(stderr).toContain(
            "You provided an empty output value. Falling back to the output value of your webpack config file, or './dist/' if none was provided",
        );

        let stats = statSync(resolve(__dirname, './dist/b.main.js'));
        expect(stats.isFile()).toBe(true);
        stats = statSync(resolve(__dirname, './dist/c.main.js'));
        expect(stats.isFile()).toBe(true);
    });
});
