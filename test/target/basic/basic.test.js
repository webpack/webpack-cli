'use strict';
const { run, isWebpack5 } = require('../../utils/test-utils');

const targetValues = ['web', 'webworker', 'node', 'async-node', 'node-webkit', 'electron-main', 'electron-renderer', 'electron-preload'];

describe('"--target" option', () => {
    it('should work by default', () => {
        const { exitCode, stderr, stdout } = run(__dirname, []);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("target: 'web");
    });

    targetValues.forEach((val) => {
        it(`should work with the "${val}" value sing the "--target" option`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['--target', `${val}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();

            if (isWebpack5) {
                expect(stdout).toContain(`target: [ '${val}' ]`);
            } else {
                expect(stdout).toContain(`target: '${val}'`);
            }
        });
    });

    it('should work with the "-t" option (alias)', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-t', 'web']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        if (isWebpack5) {
            expect(stdout).toContain("target: [ 'web' ]");
        } else {
            expect(stdout).toContain("target: 'web");
        }
    });

    it('should respect the option from the configuration', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './target.config.js']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();
        expect(stdout).toContain("target: 'web");
    });

    it('should override the option from the configuration', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['-c', './target.config.js', '--target', isWebpack5 ? 'es5' : 'node']);

        expect(exitCode).toBe(0);
        expect(stderr).toBeFalsy();

        if (isWebpack5) {
            expect(stdout).toContain("target: [ 'web', 'es5' ]");
        } else {
            expect(stdout).toContain("target: 'node'");
        }
    });

    it('should throw error with invalid value for --target', () => {
        const { exitCode, stderr, stdout } = run(__dirname, ['--target', 'invalid']);

        expect(exitCode).toBe(2);

        if (isWebpack5) {
            expect(stderr).toContain(`Unknown target 'invalid'`);
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }

        expect(stdout).toBeFalsy();
    });

    if (isWebpack5) {
        it('should work with multiple "--target" options', () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['--target', 'node', '--target', 'async-node']);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain("target: [ 'node', 'async-node' ]");
        });

        it('should log an error for invalid target in multiple syntax', () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['--target', 'node', '--target', 'invalid']);

            expect(exitCode).toBe(2);
            expect(stderr).toContain("Error: Unknown target 'invalid'");
            expect(stdout).toBeFalsy();
        });

        it('should log an error for incompatible multiple targets', () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['--target', 'node', '--target', 'web']);

            expect(exitCode).toBe(2);
            expect(stderr).toContain('Error: Universal Chunk Loading is not implemented yet');
            expect(stdout).toBeFalsy();
        });

        it('should reset target from node to async-node with --target-reset', () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['--target-reset', '--target', 'async-node']);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain("target: [ 'async-node' ]");
        });

        it('should throw error if target is an empty array', () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['--target-reset']);

            expect(exitCode).toBe(2);
            expect(stderr).toContain('Invalid configuration object');
            expect(stdout).toBeFalsy();
        });
    }
});
