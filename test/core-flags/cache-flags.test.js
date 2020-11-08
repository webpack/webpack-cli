'use strict';

const path = require('path');
const rimraf = require('rimraf');
const { run, isWindows } = require('../utils/test-utils');
const { existsSync, writeFileSync, unlinkSync } = require('fs');
const { resolve } = require('path');

describe('cache related flags from core', () => {
    beforeEach((done) => {
        rimraf(path.join(__dirname, '../../node_modules/.cache/webpack/*'), () => {
            done();
        });
    });

    it('should be successful with --cache ', () => {
        const { stdout, exitCode } = run(__dirname, ['--cache']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`type: 'memory'`);
    });

    it('should be successful with --no-cache ', () => {
        const { stdout, exitCode } = run(__dirname, ['--no-cache']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain('cache: false');
    });

    it('should set cache.type', () => {
        const { stdout, exitCode } = run(__dirname, ['--cache-type', 'filesystem']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`type: 'filesystem'`);
    });

    it('should set cache.cacheDirectory with --cache-cache-directory', () => {
        const { stdout, exitCode } = run(__dirname, ['--cache-type', 'filesystem', '--cache-cache-directory', './test-cache-path']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain('test-cache-path');
        expect(existsSync(resolve(__dirname, './test-cache-path'))).toBeTruthy();
    });

    it('should set cache.cacheLocation with --cache-cache-locations', () => {
        const { stdout, exitCode } = run(__dirname, ['--cache-type', 'filesystem', '--cache-cache-location', './test-locate-cache']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain('test-locate-cache');
        expect(existsSync(resolve(__dirname, './test-locate-cache'))).toBeTruthy();
    });

    it('should set cache.hashAlgorithm with --cache-hash-algorithm', () => {
        const { stdout, exitCode } = run(__dirname, ['--cache-type', 'filesystem', '--cache-hash-algorithm', 'sha256']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`hashAlgorithm: 'sha256'`);
    });

    it('should set cache.name with --cache-name', () => {
        const { stdout, exitCode } = run(__dirname, ['--cache-type', 'filesystem', '--cache-name', 'cli-test']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`name: 'cli-test'`);
    });

    it('should set cache.store with --cache-store', () => {
        const { stdout, exitCode } = run(__dirname, ['--cache-type', 'filesystem', '--cache-store', 'pack']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`store: 'pack'`);
    });

    it('should set cache.version with --cache-version', () => {
        const { stdout, exitCode } = run(__dirname, ['--cache-type', 'filesystem', '--cache-version', '1.1.3']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain(`version: '1.1.3'`);
    });

    it('should assign cache build dependencies correctly when cache type is filesystem', () => {
        // TODO: Fix on windows
        if (isWindows) return;
        const { stdout, exitCode } = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.config.js']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain('buildDependencies');
        expect(stdout).toContain("config: [ './webpack.config.js' ]");
        expect(stdout).not.toContain('[cached]');
        // Run again to check for cache
        const newRun = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.config.js']);
        expect(newRun.stdout).toContain('[cached]');
        expect(newRun.exitCode).toEqual(0);
    });

    it('should assign cache build dependencies correctly when cache type is filesystem in config', () => {
        // TODO: Fix on windows
        if (isWindows) return;
        const { stdout, exitCode } = run(__dirname, ['-c', './webpack.cache.config.js']);

        expect(exitCode).toBe(0);
        expect(stdout).toContain('buildDependencies');
        expect(stdout).toContain("config: [ './webpack.cache.config.js' ]");
        expect(stdout).toContain("type: 'filesystem'");
        // Run again to check for cache
        const newRun = run(__dirname, ['-c', './webpack.cache.config.js']);
        expect(newRun.stdout).toContain('[cached]');
        expect(newRun.exitCode).toEqual(0);
    });

    it('should assign cache build dependencies with multiple configs', () => {
        // TODO: Fix on windows
        if (isWindows) return;
        const { stdout, exitCode } = run(__dirname, ['-c', './webpack.cache.config.js', '-c', './webpack.config.js']);

        expect(stdout).toContain('buildDependencies');
        expect(stdout).toContain("config: [ './webpack.cache.config.js', './webpack.config.js' ]");
        expect(stdout).toContain("type: 'filesystem'");
        expect(exitCode).toEqual(0);
    });

    it('should assign cache build dependencies with default config', () => {
        // TODO: Fix on windows
        if (isWindows) return;
        const { stdout, exitCode } = run(__dirname, ['--cache-type', 'filesystem']);

        expect(stdout).toContain('buildDependencies');
        expect(stdout).toContain(`'${path.join(__dirname, './webpack.config.js')}'`);
        expect(stdout).toContain("type: 'filesystem'");
        expect(exitCode).toEqual(0);
    });

    it('should assign cache build dependencies with merged configs', () => {
        // TODO: Fix on windows
        if (isWindows) return;
        const { stdout, exitCode } = run(__dirname, ['-c', './webpack.cache.config.js', '-c', './webpack.config.js', '--merge']);

        expect(stdout).toContain('buildDependencies');
        expect(stdout).toContain("config: [ './webpack.cache.config.js', './webpack.config.js' ]");
        expect(stdout).toContain("type: 'filesystem'");
        expect(exitCode).toEqual(0);
    });

    it('should invalidate cache when config changes', () => {
        // TODO: Fix on windows
        if (isWindows) return;
        // Creating a temporary webpack config
        writeFileSync(resolve(__dirname, './webpack.test.config.js'), 'module.exports = {mode: "development"}');
        const { stdout } = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']);

        expect(stdout).not.toContain('[cached]');

        // Running again should use the cache
        const newRun = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']);
        expect(newRun.stdout).toContain('[cached]');

        // Change config to invalidate cache
        writeFileSync(resolve(__dirname, './webpack.test.config.js'), 'module.exports = {mode: "production"}');

        const newRun2 = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']);
        unlinkSync(resolve(__dirname, './webpack.test.config.js'));
        expect(newRun2).not.toContain('[cached]');
        expect(newRun2.exitCode).toEqual(0);
    });
});
