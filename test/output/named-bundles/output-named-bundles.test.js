'use strict';
const { statSync } = require('fs');
const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('output flag named bundles', () => {
    it('should output file given as flag instead of in configuration', () => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js'), '--output-path', './binary'], false);
        expect(stderr).toBeFalsy();

        const stats = statSync(resolve(__dirname, './binary/a.bundle.js'));
        expect(stats.isFile()).toBe(true);
    });

    it('should resolve the path to binary/a.bundle.js as ./binary/a.bundle.js', () => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.config.js'), '--output-path', 'binary'], false);
        expect(stderr).toBeFalsy();

        const stats = statSync(resolve(__dirname, './binary/a.bundle.js'));
        expect(stats.isFile()).toBe(true);
    });

    it('should create multiple bundles with an overriding flag', () => {
        const { stderr } = run(__dirname, ['-c', resolve(__dirname, 'webpack.single.config.js'), '--output-path', './bin'], false);
        expect(stderr).toBeFalsy();

        let stats = statSync(resolve(__dirname, './bin/b.bundle.js'));
        expect(stats.isFile()).toBe(true);
        stats = statSync(resolve(__dirname, './bin/c.bundle.js'));
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
        const { stdout, stderr, exitCode } = run(__dirname, ['--output-path'], false);
        expect(stderr).toEqual("error: option '-o, --output-path <value>' argument missing");
        expect(exitCode).toEqual(1);
        expect(stdout).toBeFalsy();
    });
});
