'use strict';

const path = require('path');
// eslint-disable-next-line node/no-unpublished-require
const rimraf = require('rimraf');
const { runAsync } = require('../../utils/test-utils');
const { existsSync, writeFileSync, unlinkSync } = require('fs');
const { resolve } = require('path');

describe('cache related flags from core', () => {
    it('should be successful with --cache ', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--cache']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`type: 'memory'`);
    });

    it('should be successful with --no-cache ', async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--no-cache']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('cache: false');
    });

    it('should set cache.type', async () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-type');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = await runAsync(__dirname, [
            '--cache-type',
            'filesystem',
            '--cache-cache-location',
            cacheLocation,
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain(`type: 'filesystem'`);
    });

    it('should set cache.cacheDirectory with --cache-cache-directory', async () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-cache-directory');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = await runAsync(__dirname, [
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

    it('should set cache.cacheLocation with --cache-cache-locations', async () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-cache-location');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = await runAsync(__dirname, [
            '--cache-type',
            'filesystem',
            '--cache-cache-location',
            cacheLocation,
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('cache-core-flag-test-cache-location');
        expect(existsSync(cacheLocation)).toBeTruthy();
    });

    it('should set cache.hashAlgorithm with --cache-hash-algorithm', async () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-hash-algorithm');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = await runAsync(__dirname, [
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

    it('should set cache.name with --cache-name', async () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-name');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = await runAsync(__dirname, [
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

    it('should set cache.store with --cache-store', async () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-store');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = await runAsync(__dirname, [
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

    it('should set cache.version with --cache-version', async () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-version');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = await runAsync(__dirname, [
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

    it('should assign cache build dependencies correctly when cache type is filesystem', async () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-build-dependencies');

        rimraf.sync(cacheLocation);

        let { stderr, stdout, exitCode } = await runAsync(__dirname, [
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
        ({ exitCode, stderr, stdout } = await runAsync(__dirname, [
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

    it('should assign cache build dependencies correctly when cache type is filesystem in config', async () => {
        const cacheLocation = path.resolve(
            __dirname,
            '../../node_modules/.cache/webpack/cache-core-flag-test-build-dependencies-in-config',
        );

        rimraf.sync(cacheLocation);

        let { exitCode, stderr, stdout } = await runAsync(__dirname, [
            '-c',
            './webpack.cache.config.js',
            '--cache-cache-location',
            cacheLocation,
        ]);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('buildDependencies');
        // expect(stdout).toContain(`'${path.join(__dirname, './webpack.cache.config.js')}'`);

        // Run again to check for cache
        ({ exitCode, stderr, stdout } = await runAsync(__dirname, [
            '-c',
            './webpack.cache.config.js',
            '--cache-cache-location',
            cacheLocation,
        ]));

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('[cached]');
    });

    it('should assign cache build dependencies with multiple configs', async () => {
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/config-cache'));

        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['-c', './webpack.cache.config.js', '-c', './webpack.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("type: 'filesystem'");
        expect(stdout).toContain('buildDependencies');
        // expect(stdout).toContain(`'${resolve(__dirname, 'webpack.cache.config.js')}'`);
        expect(stdout).not.toContain(`'${resolve(__dirname, 'webpack.config.js')}'`);
    });

    it('should assign cache build dependencies with default config', async () => {
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-development'));

        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--cache-type', 'filesystem', '--name', 'cache-core-flag-test']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('buildDependencies');
        // expect(stdout).toContain(`'${path.join(__dirname, './webpack.config.js')}'`);
        expect(stdout).toContain("type: 'filesystem'");
    });

    it('should assign cache build dependencies with merged configs', async () => {
        const cacheLocation = path.resolve(__dirname, '../../node_modules/.cache/webpack/cache-core-flag-test-merge');

        rimraf.sync(cacheLocation);

        const { exitCode, stderr, stdout } = await runAsync(__dirname, [
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

    // TODO: fix it later
    it.skip('should invalidate cache when config changes', async () => {
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/default-development'));
        rimraf.sync(path.join(__dirname, '../../node_modules/.cache/webpack/default-production'));

        // Creating a temporary webpack config
        writeFileSync(resolve(__dirname, './webpack.test.config.js'), 'module.exports = {mode: "development"}');

        let { exitCode, stderr, stdout } = await runAsync(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain('[cached]');

        // Running again should use the cache
        ({ exitCode, stderr, stdout } = await runAsync(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']));

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain('[cached]');

        // Change config to invalidate cache
        writeFileSync(resolve(__dirname, './webpack.test.config.js'), 'module.exports = {mode: "production"}');

        ({ exitCode, stderr, stdout } = await runAsync(__dirname, ['--cache-type', 'filesystem', '-c', './webpack.test.config.js']));

        unlinkSync(resolve(__dirname, './webpack.test.config.js'));

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).not.toContain('[cached]');
    });
});
