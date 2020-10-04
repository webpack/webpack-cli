'use strict';

const { run } = require('../utils/test-utils');

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
    });

    it('should set cache.cacheLocation with --cache-cache-locations', () => {
        const { stderr, stdout } = run(__dirname, ['--cache-type', 'filesystem', '--cache-cache-location', './test-locate-cache']);

        expect(stderr).toBeFalsy();
        expect(stdout).toContain('test-locate-cache');
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
});
