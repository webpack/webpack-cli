'use strict';

const { resolve } = require('path');
const { run } = require('../../utils/test-utils');

describe('output flag named bundles', () => {
    it('should output file given as flag instead of in configuration', () => {
        const { exitCode, stderr, stdout } = run(
            __dirname,
            ['-c', resolve(__dirname, 'webpack.config.js'), '--output-path', './binary'],
            false,
        );

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should resolve the path to binary/a.bundle.js as ./binary/a.bundle.js', () => {
        const { exitCode, stderr, stdout } = run(
            __dirname,
            ['-c', resolve(__dirname, 'webpack.config.js'), '--output-path', 'binary'],
            false,
        );

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should create multiple bundles with an overriding flag', () => {
        const { exitCode, stderr, stdout } = run(
            __dirname,
            ['-c', resolve(__dirname, 'webpack.single.config.js'), '--output-path', './bin'],
            false,
        );

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should successfully compile multiple entries', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', resolve(__dirname, 'webpack.multiple.config.js')], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should output file in bin directory using default webpack config with warning for empty output value', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--output-path'], false);

        expect(exitCode).toEqual(2);
        expect(stderr).toEqual("error: option '-o, --output-path <value>' argument missing");
        expect(stdout).toBeFalsy();
    });
});
