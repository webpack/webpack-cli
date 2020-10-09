'use strict';

const { run } = require('../utils/test-utils');
const { existsSync, writeFileSync, unlinkSync } = require('fs');
const { resolve } = require('path');

describe('cache related flags from core', () => {
    it('should be successful with --cache ', () => {
        const { stderr, stdout } = run(__dirname, ['--cache']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`type: 'memory'`);
    });

    it('should be successful with --no-cache ', () => {
        const { stderr, stdout } = run(__dirname, ['--no-cache']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('cache: false');
    });

    it('should set cache.type', () => {
        const { stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`type: 'filesystem'`);
    });

    it('should set cache.cacheDirectory with --cache-cache-directory', () => {
        const { stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-cache-directory', './test-cache-path']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('test-cache-path');
        expect(existsSync(resolve(__dirname, './test-cache-path'))).toBeTruthy();
    });

    it('should set cache.cacheLocation with --cache-cache-locations', () => {
        const { stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-cache-location', './test-locate-cache']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('test-locate-cache');
        expect(existsSync(resolve(__dirname, './test-locate-cache'))).toBeTruthy();
    });

    it('should set cache.hashAlgorithm with --cache-hash-algorithm', () => {
        const { stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-hash-algorithm', 'sha256']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`hashAlgorithm: 'sha256'`);
    });

    it('should set cache.name with --cache-name', () => {
        const { stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-name', 'cli-test']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`name: 'cli-test'`);
    });

    it('should set cache.store with --cache-store', () => {
        const { stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-store', 'pack']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`store: 'pack'`);
    });

    it('should set cache.version with --cache-version', () => {
        const { stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-version', '1.1.3']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`version: '1.1.3'`);
    });

    it('should assign cache build dependencies correctly when cache type is filesystem', () => {
        const { stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.config.js']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('buildDependencies');
        expect(stdout).toContain("config: [ './webpack.config.js' ]");
        expect(stdout).not.toContain('[cached] 1 module');
        // Run again to check for cache
        const newRun = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.config.js']);
        expect(newRun.stdout).toContain('[cached] 1 module');
        expect(newRun.stderr).toBeFalsy();
        expect(newRun.exitCode).toEqual(0);
    });

    it('should assign cache build dependencies correctly when cache type is filesystem in config', () => {
        const { stderr, stdout } = run(__dirname, ['-c', './webpack.cache.config.js']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('buildDependencies');
        expect(stdout).toContain("config: [ './webpack.cache.config.js' ]");
        expect(stdout).toContain("type: 'filesystem'");
        // Run again to check for cache
        const newRun = run(__dirname, ['-c', './webpack.cache.config.js']);
        expect(newRun.stdout).toContain('[cached] 1 module');
        expect(newRun.stderr).toBeFalsy();
        expect(newRun.exitCode).toEqual(0);
    });

    it('should assign cache build dependencies with multiple configs', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['-c', './webpack.cache.config.js', '-c', './webpack.config.js']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('buildDependencies');
        expect(stdout).toContain("config: [ './webpack.cache.config.js', './webpack.config.js' ]");
        expect(stdout).toContain("type: 'filesystem'");
        expect(exitCode).toEqual(0);
    });

    it('should assign cache build dependencies with merged configs', () => {
        const { stderr, stdout, exitCode } = run(__dirname, ['-c', './webpack.cache.config.js', '-c', './webpack.config.js', '--merge']);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('buildDependencies');
        expect(stdout).toContain("config: [ './webpack.cache.config.js', './webpack.config.js' ]");
        expect(stdout).toContain("type: 'filesystem'");
        expect(exitCode).toEqual(0);
    });

    it('should invalidate cache when config changes', () => {
        // Creating a temporary webpack config
        writeFileSync(resolve(__dirname, './webpack.test.config.js'), 'module.exports = {mode: "development"}');
        const { stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']);
        expect(stderr).toBeFalsy();
        // modules should not be cached on first run
        expect(stdout).not.toContain('[cached] 1 module');

        // Running again should use the cache
        const newRun = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']);
        expect(newRun.stdout).toContain('[cached] 1 module');

        // Change config to invalidate cache
        writeFileSync(resolve(__dirname, './webpack.test.config.js'), 'module.exports = {mode: "production"}');

        const newRun2 = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']);
        unlinkSync(resolve(__dirname, './webpack.test.config.js'));
        expect(newRun2).not.toContain('[cached] 1 module');
        expect(newRun2.exitCode).toEqual(0);
    });
});
