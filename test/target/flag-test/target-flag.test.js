'use strict';
const { stat } = require('fs');
const { resolve } = require('path');
const { run, isWebpack5 } = require('../../utils/test-utils');

const targetValues = ['web', 'webworker', 'node', 'async-node', 'node-webkit', 'electron-main', 'electron-renderer', 'electron-preload'];

describe('--target flag', () => {
    targetValues.forEach((val) => {
        it(`should accept ${val} with --target flag`, (done) => {
            const { stdout, stderr } = run(__dirname, ['--target', `${val}`]);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`target: '${val}'`);

            stat(resolve(__dirname, 'bin/main.js'), (err, stats) => {
                expect(err).toBe(null);
                expect(stats.isFile()).toBe(true);
                done();
            });
        });

        it(`should accept ${val} with -t alias`, (done) => {
            const { stdout, stderr } = run(__dirname, ['-t', `${val}`]);
            expect(stderr).toBeFalsy();
            expect(stdout).toContain(`target: '${val}'`);

            stat(resolve(__dirname, 'bin/main.js'), (err, stats) => {
                expect(err).toBe(null);
                expect(stats.isFile()).toBe(true);
                done();
            });
        });
    });

    it(`should throw error with invalid value for --target`, () => {
        const { stderr } = run(__dirname, ['--target', 'invalid']);
        if (isWebpack5) {
            expect(stderr).toContain(`Error: Unknown target 'invalid'`);
        } else {
            expect(stderr).toContain('Invalid configuration object');
        }
    });
});
