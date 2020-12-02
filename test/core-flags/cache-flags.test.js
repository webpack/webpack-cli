'use strict';

const path = require('path');
const rimraf = require('rimraf');
const { run } = require('../utils/test-utils');
const { existsSync, writeFileSync, unlinkSync } = require('fs');
const { resolve } = require('path');

describe('cache related flags from core', () => {
    beforeEach((done) => {
        rimraf(path.join(__dirname, '../../node_modules/.cache/webpack/*'), () => {
            done();
        });
    });

    it('should be successful with --cache ', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--cache']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain(`type: 'memory'`);
    });

    it('should be successful with --no-cache ', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--no-cache']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain('cache: false');
    });

    it('should set cache.type', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain(`type: 'filesystem'`);
    });

    it('should set cache.cacheDirectory with --cache-cache-directory', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-cache-directory', './test-cache-path']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('test-cache-path');
    });

    it('should set cache.cacheLocation with --cache-cache-locations', () => {
        const { exitCode, stderr, stdout } = run(__dirname, [
            '--cache-type',
            'filesystem',
            '--cache-cache-location',
            './test-locate-cache',
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('test-locate-cache');
        expect(existsSync(resolve(__dirname, './test-locate-cache'))).toBeTruthy();
    });

    it('should set cache.hashAlgorithm with --cache-hash-algorithm', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-hash-algorithm', 'sha256']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain(`hashAlgorithm: 'sha256'`);
    });

    it('should set cache.name with --cache-name', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-name', 'cli-test']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain(`name: 'cli-test'`);
    });

    it('should set cache.store with --cache-store', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-store', 'pack']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain(`store: 'pack'`);
    });

    it('should set cache.version with --cache-version', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-version', '1.1.3']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain(`version: '1.1.3'`);
    });

    it('should assign cache build dependencies correctly when cache type is filesystem', () => {
        let { stderr, stdout, exitCode } = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('buildDependencies');
        // expect(stdout).toContain(`'${path.join(__dirname, './webpack.config.js')}'`);
        expect(stdout).not.toContain('[cached]');

        // Run again to check for cache
        ({ exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.config.js']));

        expect(exitCode).toEqual(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain('[cached]');
    });

    it('should assign cache build dependencies correctly when cache type is filesystem in config', () => {
        let { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.cache.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler-cache' starting...");
        expect(stderr).toContain("Compilation 'compiler-cache' finished");
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('buildDependencies');
        // expect(stdout).toContain(`'${path.join(__dirname, './webpack.cache.config.js')}'`);

        // Run again to check for cache
        ({ exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.cache.config.js']));

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler-cache' starting...");
        expect(stderr).toContain("Compilation 'compiler-cache' finished");
        expect(stdout).toContain('[cached]');
    });

    it('should assign cache build dependencies with multiple configs', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.cache.config.js', '-c', './webpack.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('buildDependencies');
        // expect(stdout).toContain(`'${resolve(__dirname, 'webpack.cache.config.js')}'`);
        expect(stdout).not.toContain(`'${resolve(__dirname, 'webpack.config.js')}'`);
    });

    it('should assign cache build dependencies with default config', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain('buildDependencies');
        // expect(stdout).toContain(`'${path.join(__dirname, './webpack.config.js')}'`);
        expect(stdout).toContain("type: 'filesystem'");
    });

    it('should assign cache build dependencies with merged configs', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.cache.config.js', '-c', './webpack.config.js', '--merge']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain("Compilation 'compiler' starting...");
        expect(stderr).toContain("Compilation 'compiler' finished");
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('buildDependencies');
        // expect(stdout).toContain(`'${path.join(__dirname, './webpack.cache.config.js')}'`);
        // expect(stdout).toContain(`'${path.join(__dirname, './webpack.config.js')}'`);
    });

    it('should invalidate cache when config changes', () => {
        // Creating a temporary webpack config
        writeFileSync(resolve(__dirname, './webpack.test.config.js'), 'module.exports = {mode: "development"}');

        let { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).not.toContain('[cached]');

        // Running again should use the cache
        ({ exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']));

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).toContain('[cached]');

        // Change config to invalidate cache
        writeFileSync(resolve(__dirname, './webpack.test.config.js'), 'module.exports = {mode: "production"}');

        ({ exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']));

        unlinkSync(resolve(__dirname, './webpack.test.config.js'));

        expect(exitCode).toBe(0);
        expect(stderr).toContain('Compilation starting...');
        expect(stderr).toContain('Compilation finished');
        expect(stdout).not.toContain('[cached]');
    });
});
