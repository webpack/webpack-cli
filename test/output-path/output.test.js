'use strict';

// eslint-disable-next-line node/no-unsupported-features/node-builtins
const fs = require('fs').promises;
const { resolve } = require('path');
const { run } = require('../utils/test-utils');

describe('basic', () => {
    it('should work by default without any values', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, []);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        const stats = await fs.stat(resolve(__dirname, 'dist'));

        expect(stats.isDirectory()).toBe(true);
    });

    it('should respect the "--output-path" option (relative)', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--output-path', './binary']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        const stats = await fs.stat(resolve(__dirname, 'binary'));

        expect(stats.isDirectory()).toBe(true);
    });

    it('should respect the "--output-path" option (relative) #2', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--output-path', 'binary']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        const stats = await fs.stat(resolve(__dirname, 'binary'));

        expect(stats.isDirectory()).toBe(true);
    });

    it('should respect the "--output-path" option (absolute)', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--output-path', resolve(__dirname, './binary')]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        const stats = await fs.stat(resolve(__dirname, 'binary'));

        expect(stats.isDirectory()).toBe(true);
    });

    it('should respect value from the configuration', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', 'webpack.output-path.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        const stats = await fs.stat(resolve(__dirname, 'bin'));

        expect(stats.isDirectory()).toBe(true);
    });

    it('should respect the "-o" option (alias)', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-o', './binary']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();

        const stats = await fs.stat(resolve(__dirname, 'binary'));

        expect(stats.isDirectory()).toBe(true);
    });

    it('should output file in bin directory using default webpack config with warning for empty output value', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--output-path']);

        expect(exitCode).toEqual(2);
        expect(stderr).toContain("option '-o, --output-path <value>' argument missing");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });
});
