'use strict';

const { run } = require('../../utils/test-utils');

describe('bundle command', () => {
    it('should work without command (default command)', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, [], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work without command and options (default command)', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--mode', 'development'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with multiple entries syntax without command (default command)', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['./src/index.js', './src/other.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with multiple entries syntax without command with options (default command)', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['./src/index.js', './src/other.js', '--mode', 'development'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with multiple entries syntax without command with options #2 (default command)', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--mode', 'development', './src/index.js', './src/other.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with multiple entries syntax without command with options #3 (default command)', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['./src/index.js', './src/other.js', '--entry', './src/again.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with and override entries from the configuration', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['./src/index.js', './src/other.js', '--config', './entry.config.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with the "build" alias', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['build'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with "bundle" alias', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['bundle'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with the "b" alias', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['b'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with entries syntax using the "build" alias', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['build', './src/index.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with entries syntax using the "bundle" alias', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['bundle', './src/index.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with entries syntax using the "b" alias', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['b', './src/index.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with multiple entries syntax using the "build" alias', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['build', './src/index.js', './src/other.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with multiple entries syntax using the "build" alias and options', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['build', './src/index.js', './src/other.js', '--mode', 'development'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should work with multiple entries syntax using the "build" alias and options', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['build', '--mode', 'development', './src/index.js', './src/other.js'], false);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toBeTruthy();
    });

    it('should log error and suggest right name on the "buil" command', async () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['buil'], false);

        expect(exitCode).toBe(2);
        expect(stderr).toContain("Unknown command 'buil'");
        expect(stderr).toContain("Did you mean 'build' (alias 'bundle, b')?");
        expect(stderr).toContain("Run 'webpack --help' to see available commands and options");
        expect(stdout).toBeFalsy();
    });
});
