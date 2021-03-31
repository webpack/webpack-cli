'use strict';
const { runAsync, isWebpack5 } = require('../../../utils/test-utils');

const targetValues = ['web', 'webworker', 'node', 'async-node', 'node-webkit', 'electron-main', 'electron-renderer', 'electron-preload'];

describe('--target flag', () => {
    targetValues.forEach((val) => {
        it(`should accept ${val} with --target flag`, async () => {
            const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--target', `${val}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();

            if (isWebpack5) {
                expect(stdout).toContain(`target: [ '${val}' ]`);
            } else {
                expect(stdout).toContain(`target: '${val}'`);
            }
        });

        it(`should accept ${val} with -t alias`, async () => {
            const { exitCode, stderr, stdout } = await runAsync(__dirname, ['-t', `${val}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();

            if (isWebpack5) {
                expect(stdout).toContain(`target: [ '${val}' ]`);
            } else {
                expect(stdout).toContain(`target: '${val}'`);
            }
        });
    });

    it(`should throw error with invalid value for --target`, async () => {
        const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--target', 'invalid']);

        expect(exitCode).toBe(2);

        if (isWebpack5) {
            expect(stderr).toContain(`Unknown target 'invalid'`);
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }

        expect(stdout).toBeFalsy();
    });

    if (isWebpack5) {
        it('should allow multiple targets', async () => {
            const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--target', 'node', '--target', 'async-node']);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`target: [ 'node', 'async-node' ]`);
        });

        it('should throw an error for invalid target in multiple syntax', async () => {
            const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--target', 'node', '--target', 'invalid']);

            expect(exitCode).toBe(2);
            expect(stderr).toContain("Error: Unknown target 'invalid'");
            expect(stdout).toBeFalsy();
        });

        it('should throw an error for incompatible multiple targets', async () => {
            const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--target', 'node', '--target', 'web']);

            expect(exitCode).toBe(2);
            expect(stderr).toContain('Error: Universal Chunk Loading is not implemented yet');
            expect(stdout).toBeFalsy();
        });

        it('should reset target from node to async-node with --target-reset', async () => {
            const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--target-reset', '--target', 'async-node']);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`target: [ 'async-node' ]`);
        });

        it('should throw error if target is an empty array', async () => {
            const { exitCode, stderr, stdout } = await runAsync(__dirname, ['--target-reset']);

            expect(exitCode).toBe(2);
            expect(stderr).toContain('Invalid configuration object');
            expect(stdout).toBeFalsy();
        });
    }
});
