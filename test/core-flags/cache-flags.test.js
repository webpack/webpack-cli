'use strict';

const path = require('path');
const rimraf = require('rimraf');
const { isWindows, run } = require('../utils/test-utils');
const { existsSync, writeFileSync, unlinkSync } = require('fs');
const { resolve, normalize } = require('path');

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
        const cacheLocation = resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-type');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-cache-location', cacheLocation]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`type: 'filesystem'`);
        expect(stdout).toContain(`'${normalize(cacheLocation)}'`);
    });

    it('should set cache.cacheDirectory with --cache-cache-directory', () => {
        const cacheLocation = resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-cache-directory');
        const cacheDirectory = resolve(cacheLocation, './test-cache-path');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = run(__dirname, [
            '--cache-type',
            'filesystem',
            '--cache-cache-directory',
            cacheDirectory,
            '--cache-cache-location',
            cacheLocation,
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain(`'${normalize(cacheLocation)}'`);
        expect(stdout).toContain(`'${normalize(cacheDirectory)}'`);
    });

    it('should set cache.cacheLocation with --cache-cache-locations', () => {
        const cacheLocation = resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-cache-location');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-cache-location', cacheLocation]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain(`'${normalize(cacheLocation)}'`);
        expect(existsSync(cacheLocation)).toBeTruthy();
    });

    it('should set cache.hashAlgorithm with --cache-hash-algorithm', () => {
        const cacheLocation = resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-hash-algorithm');

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
        expect(stdout).toContain(`'${normalize(cacheLocation)}'`);
    });

    it('should set cache.name with --cache-name', () => {
        const cacheLocation = resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-name');

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
        expect(stdout).toContain(`'${normalize(cacheLocation)}'`);
    });

    it('should set cache.store with --cache-store', () => {
        const cacheLocation = resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-store');

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
        expect(stdout).toContain(`'${normalize(cacheLocation)}'`);
    });

    it('should set cache.version with --cache-version', () => {
        const cacheLocation = resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-version');

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
        expect(stdout).toContain(`'${normalize(cacheLocation)}'`);
    });

    it('should assign cache build dependencies correctly when cache type is filesystem', () => {
        const cacheLocation = resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-build-dependencies');

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
        if (isWindows) {
            expect(stdout).toContain('cache-core-flag-test-build-dependencies');
        } else {
            expect(stdout).toContain(`'${cacheLocation}'`);
        }

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
        expect(stdout).toContain(`'${normalize(cacheLocation)}'`);
    });

    it('should assign cache build dependencies correctly when cache type is filesystem in config', () => {
        const cacheLocation = resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-build-dependencies-in-config');

        rimraf.sync(cacheLocation);

        let { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.cache.config.js', '--cache-cache-location', cacheLocation]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('buildDependencies');
        expect(stdout).toContain(`'${normalize(cacheLocation)}'`);
        // expect(stdout).toContain(`'${path.join(__dirname, './webpack.cache.config.js')}'`);

        // Run again to check for cache
        ({ exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.cache.config.js', '--cache-cache-location', cacheLocation]));

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('[cached]');
        expect(stdout).toContain(`'${normalize(cacheLocation)}'`);
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
