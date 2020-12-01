'use strict';
const { run, isWebpack5 } = require('../../utils/test-utils');

const targetValues = ['web', 'webworker', 'node', 'async-node', 'node-webkit', 'electron-main', 'electron-renderer', 'electron-preload'];

describe('--target flag', () => {
    targetValues.forEach((val) => {
        it(`should accept ${val} with --target flag`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['--target', `${val}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toContain('Compilation starting...');
            expect(stderr).toContain('Compilation finished');

            if (isWebpack5) {
                expect(stdout).toContain(`target: [ '${val}' ]`);
            } else {
                expect(stdout).toContain(`target: '${val}'`);
            }
        });

        it(`should accept ${val} with -t alias`, () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['-t', `${val}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toContain('Compilation starting...');
            expect(stderr).toContain('Compilation finished');

            if (isWebpack5) {
                expect(stdout).toContain(`target: [ '${val}' ]`);
            } else {
                expect(stdout).toContain(`target: '${val}'`);
            }
        });
    });

    it(`should throw error with invalid value for --target`, () => {
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
        it('should allow multiple targets', () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['--target', 'node', '--target', 'async-node']);

            expect(exitCode).toBe(0);
            expect(stderr).toContain('Compilation starting...');
            expect(stderr).toContain('Compilation finished');
            expect(stdout).toContain(`target: [ 'node', 'async-node' ]`);
        });

        it('should reset target from node to async-node with --target-reset', () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['--target-reset', '--target', 'async-node']);

            expect(exitCode).toBe(0);
            expect(stderr).toContain('Compilation starting...');
            expect(stderr).toContain('Compilation finished');
            expect(stdout).toContain(`target: [ 'async-node' ]`);
        });

        it('should throw error if target is an empty array', () => {
            const { exitCode, stderr, stdout } = run(__dirname, ['--target-reset']);

            expect(exitCode).toBe(2);
            expect(stderr).toContain('Invalid configuration object');
            expect(stdout).toBeFalsy();
        });
    }
});
