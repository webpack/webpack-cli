'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run, isWebpack5 } = require('../../utils/test-utils');

const targetValues = ['web', 'webworker', 'node', 'async-node', 'node-webkit', 'electron-main', 'electron-renderer', 'electron-preload'];

describe('--target flag', () => {
    targetValues.forEach((val) => {
        it(`should accept ${val} with --target flag`, (done) => {
            const { stdout, stderr, exitCode } = run(__dirname, ['--target', `${val}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            if (isWebpack5) {
                expect(stdout).toContain(`target: [ '${val}' ]`);
            } else {
                expect(stdout).toContain(`target: '${val}'`);
            }

            stat(resolve(__dirname, 'bin/main.js'), (err, stats) => {
                expect(err).toBe(null);
                expect(stats.isFile()).toBe(true);
                done();
            });
        });

        it(`should accept ${val} with -t alias`, (done) => {
            const { stdout, stderr, exitCode } = run(__dirname, ['-t', `${val}`]);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            if (isWebpack5) {
                expect(stdout).toContain(`target: [ '${val}' ]`);
            } else {
                expect(stdout).toContain(`target: '${val}'`);
            }

            stat(resolve(__dirname, 'bin/main.js'), (err, stats) => {
                expect(err).toBe(null);
                expect(stats.isFile()).toBe(true);
                done();
            });
        });
    });

    it(`should throw error with invalid value for --target`, () => {
        const { stderr, exitCode } = run(__dirname, ['--target', 'invalid']);

        expect(exitCode).toBe(2);
        if (isWebpack5) {
            expect(stderr).toContain(`Unknown target 'invalid'`);
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }
    });

    if (isWebpack5) {
        it('should allow multiple targets', () => {
            const { stderr, stdout, exitCode } = run(__dirname, ['--target', 'node', '--target', 'async-node']);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`target: [ 'node', 'async-node' ]`);
        });

        it('should reset target from node to async-node with --target-reset', () => {
            const { stderr, stdout, exitCode } = run(__dirname, ['--target-reset', '--target', 'async-node']);

            expect(exitCode).toBe(0);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`target: [ 'async-node' ]`);
        });

        it('should thorw error if target is an empty array', () => {
            const { stderr, stdout, exitCode } = run(__dirname, ['--target-reset']);

            expect(exitCode).toBe(2);
            expect(stderr).toContain('Invalid configuration object');
            expect(stdout).toBeFalsy();
        });
    }
});
