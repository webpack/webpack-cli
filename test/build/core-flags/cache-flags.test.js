'use strict';

const path = require('path');
const rimraf = require('rimraf');
const { run } = require('../../utils/test-utils');
const { existsSync, writeFileSync, unlinkSync } = require('fs');
const { resolve } = require('path');

describe('cache related flags from core', () => {
    it('should be successful with --cache ', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--cache']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`type: 'memory'`);
    });

    it('should be successful with --no-cache ', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--no-cache']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('cache: false');
    });

    it('should set cache.type', () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-type');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-cache-location', cacheLocation]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`type: 'filesystem'`);
    });

    it('should set cache.cacheDirectory with --cache-cache-directory', () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-cache-directory');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = run(__dirname, [
            '--cache-type',
            'filesystem',
            '--cache-cache-directory',
            './test-cache-path',
            '--cache-cache-location',
            cacheLocation,
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('test-cache-path');
    });

    it('should set cache.cacheLocation with --cache-cache-locations', () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-cache-location');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-cache-location', cacheLocation]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('cache-core-flag-test-cache-location');
        expect(existsSync(cacheLocation)).toBeTruthy();
    });

    it('should set cache.hashAlgorithm with --cache-hash-algorithm', () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-hash-algorithm');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = run(__dirname, [
            '--cache-type',
            'filesystem',
            '--cache-hash-algorithm',
            'sha256',
            '--cache-cache-location',
            cacheLocation,
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain(`hashAlgorithm: 'sha256'`);
    });

    it('should set cache.name with --cache-name', () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-name');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = run(__dirname, [
            '--cache-type',
            'filesystem',
            '--cache-name',
            'cli-test',
            '--cache-cache-location',
            cacheLocation,
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain(`name: 'cli-test'`);
    });

    it('should set cache.store with --cache-store', () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-store');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = run(__dirname, [
            '--cache-type',
            'filesystem',
            '--cache-store',
            'pack',
            '--cache-cache-location',
            cacheLocation,
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain(`store: 'pack'`);
    });

    it('should set cache.version with --cache-version', () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-version');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = run(__dirname, [
            '--cache-type',
            'filesystem',
            '--cache-version',
            '1.1.3',
            '--cache-cache-location',
            cacheLocation,
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain(`version: '1.1.3'`);
    });

    it('should assign cache build dependencies correctly when cache type is filesystem', () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-build-dependencies');

        rimraf.sync(cacheLocation);

        let { stderr, stdout, exitCode } = run(__dirname, [
            '--cache-type',
            'filesystem',
            '-c',
            './webpack.config.js',
            '--cache-cache-location',
            cacheLocation,
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('buildDependencies');
        // expect(stdout).toContain(`'${path.join(__dirname, './webpack.config.js')}'`);
        expect(stdout).not.toContain('[cached]');

        // Run again to check for cache
        ({ exitCode, stderr, stdout } = run(__dirname, [
            '--cache-type',
            'filesystem',
            '-c',
            './webpack.config.js',
            '--cache-cache-location',
            cacheLocation,
        ]));

        expect(exitCode).toEqual(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('[cached]');
    });

    it('should assign cache build dependencies correctly when cache type is filesystem in config', () => {
        const cacheLocation = path.resolve(
            __dirname,
            '../../node_modules/.cache/webpack/cache-core-flag-test-build-dependencies-in-config',
        );

        rimraf.sync(cacheLocation);

        let { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.cache.config.js', '--cache-cache-location', cacheLocation]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('buildDependencies');
        // expect(stdout).toContain(`'${path.join(__dirname, './webpack.cache.config.js')}'`);

        // Run again to check for cache
        ({ exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.cache.config.js', '--cache-cache-location', cacheLocation]));

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('[cached]');
    });

    it('should assign cache build dependencies with multiple configs', () => {
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/config-cache'));

        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.cache.config.js', '-c', './webpack.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('buildDependencies');
        // expect(stdout).toContain(`'${resolve(__dirname, 'webpack.cache.config.js')}'`);
        expect(stdout).not.toContain(`'${resolve(__dirname, 'webpack.config.js')}'`);
    });

    it('should assign cache build dependencies with default config', () => {
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-development'));

        const { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--name', 'cache-core-flag-test']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('buildDependencies');
        // expect(stdout).toContain(`'${path.join(__dirname, './webpack.config.js')}'`);
        expect(stdout).toContain("type: 'filesystem'");
    });

    it('should assign cache build dependencies with merged configs', () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-merge');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = run(__dirname, [
            '-c',
            './webpack.cache.config.js',
            '-c',
            './webpack.config.js',
            '--merge',
            '--cache-cache-location',
            cacheLocation,
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('buildDependencies');
        // expect(stdout).toContain(`'${path.join(__dirname, './webpack.cache.config.js')}'`);
        // expect(stdout).toContain(`'${path.join(__dirname, './webpack.config.js')}'`);
    });

    it('should invalidate cache when config changes', () => {
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/default-development'));
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/default-production'));

        // Creating a temporary webpack config
        writeFileSync(resolve(__dirname, './webpack.test.config.js'), 'module.exports = {mode: "development"}');

        let { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain('[cached]');

        // Running again should use the cache
        ({ exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']));

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('[cached]');

        // Change config to invalidate cache
        writeFileSync(resolve(__dirname, './webpack.test.config.js'), 'module.exports = {mode: "production"}');

        ({ exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']));

        unlinkSync(resolve(__dirname, './webpack.test.config.js'));

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain('[cached]');
    });
});
