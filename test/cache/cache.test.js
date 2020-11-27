'use strict';

const path = require('path');
const rimraf = require('rimraf');
const { run, isWebpack5 } = require('../utils/test-utils');

describe('cache', () => {
    beforeEach((done) => {
        rimraf(path.join(__dirname, '../../node_modules/.cache/webpack/test'), () => {
            rimraf(path.join(__dirname, '../../node_modules/.cache/webpack/test-1'), () => {
                done();
            });
        });
    });

    it('should work', () => {
        let { exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.config.js', '--cache-name', 'test'], false);

        if (isWebpack5) {
            expect(stderr).toContain('No pack exists at');
            expect(stderr).toContain('Stored pack');
            expect(stdout).toBeTruthy();
        } else {
            expect(exitCode).toEqual(2);
        }

        ({ exitCode, stderr, stdout } = run(__dirname, ['-c', './webpack.config.js', '--cache-name', 'test'], false));

        if (isWebpack5) {
            expect(exitCode).toEqual(0);
            expect(stderr).toContain('restore cache container');
            expect(stderr).toContain('restore cache content metadata');
            expect(stderr).toContain('restore cache content');
            expect(stdout).toBeTruthy();
        } else {
            expect(exitCode).toEqual(2);
        }
    });

    it('should work with autoloading configuration', () => {
        let { exitCode, stderr, stdout } = run(__dirname, ['--cache-name', 'test-1'], false);

        if (isWebpack5) {
            expect(stderr).toContain('No pack exists at');
            expect(stderr).toContain('Stored pack');
            expect(stdout).toBeTruthy();
        } else {
            expect(exitCode).toEqual(2);
        }

        ({ exitCode, stderr, stdout } = run(__dirname, ['--cache-name', 'test-1'], false));

        if (isWebpack5) {
            expect(exitCode).toEqual(0);
            expect(stderr).toContain('restore cache container');
            expect(stderr).toContain('restore cache content metadata');
            expect(stderr).toContain('restore cache content');
            expect(stdout).toBeTruthy();
        } else {
            expect(exitCode).toEqual(2);
        }
    });
});
